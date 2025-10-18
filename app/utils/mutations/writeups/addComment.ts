import { createClient } from "../../supabase/client";

export async function addComment(
  writeup_id: string,
  user_id: string,
  text: string,
  respondTo: string | null
) {
  const supabase = createClient();

  if (!user_id) {
    throw new Error("not authenticated");
  }

  const { error: insertError } = await supabase.from("writeup_comments").insert({
    writeup_id: writeup_id,
    user_id: user_id,
    text: text,
    respond_to: respondTo || null,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }
}
