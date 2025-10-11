import { createClient } from "../../supabase/client";
import checkFlag from "@/app/utils/queries/challenges/checkFlag";

export async function submitFlag(challengeId: string, flag: string) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data) throw new Error("User not authenticated");

  const { user } = data;
  const id = user?.id;
  if (!id) throw new Error("User ID not found");

  const isCorrect = await checkFlag(challengeId, flag);

  const { data: existentSubmission, error: errorFetch } = await supabase
    .from("submissions")
    .select("tries")
    .eq("user_id", id)
    .eq("challenge", challengeId)
    .maybeSingle();

  if (errorFetch && errorFetch.code !== "PGRST116") {
    throw new Error("Failed to fetch submission");
  }

  const tries = existentSubmission ? existentSubmission.tries + 1 : 1;

  if (existentSubmission) {
    if (isCorrect) {
      const { error: updateError } = await supabase
        .from("submissions")
        .update({
          done: true,
          tries: tries,
        })
        .eq("user_id", id)
        .eq("challenge", challengeId);

      if (updateError) {
        throw new Error("Failed to submit correct flag");
      }
    } else {
      const { error: updateError } = await supabase
        .from("submissions")
        .update({
          tries: tries,
        })
        .eq("user_id", id)
        .eq("challenge", challengeId);

      if (updateError) {
        throw new Error("Failed to submit incorrect flag");
      }
    }
  } else {
    if (isCorrect) {
      const { error: insertError } = await supabase.from("submissions").insert({
        user_id: id,
        challenge: challengeId,
        done: true,
        tries: 1,
      });

      if (insertError) {
        throw new Error("Failed to submit correct flag");
      }
    } else {
      const { error: insertError } = await supabase.from("submissions").insert({
        user_id: id,
        challenge: challengeId,
        done: false,
        tries: 1,
      });

      if (insertError) {
        throw new Error("Failed to submit incorrect flag");
      }
    }
  }
  if(isCorrect) {
    const { error: userError, data: userData } = await supabase.from('users').select('points').eq('id', id).single();
    const { error: challengeError, data: challengeData } = await supabase.from('challenges').select('points').eq('id', challengeId).single();
    if(challengeError) {
      throw new Error("Failed to fetch challenge points");
    }
    if(userError) {
      throw new Error("Failed to fetch user points");
    }
    const totalPoints = (userData?.points || 0 ) + (challengeData?.points || 0);
    const { error: updateUserError } = await supabase.from('users').update({ points: totalPoints }).eq('id', id);
    if(updateUserError) {
      throw new Error("Failed to update user points");
    }
  }
  return isCorrect;
}
