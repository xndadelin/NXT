import { createClient } from "@/app/utils/supabase/client";

export default async function deleteChallenge(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("challenges").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return;
}
