import { createClient } from "../../supabase/client";

export async function addComment(challengeId: string, user_id: string, text: string, respondTo: string | null) {
    const supabase = createClient();

    if(!user_id) {
        throw new Error('not authenticated');
    }

    const { error: insertError }  = await supabase.from('discussions').insert({
        challenge_id: challengeId,
        user_id: user_id,
        text: text,
        respondTo: respondTo || null
    });

    if (insertError) {
        throw new Error(insertError.message)
    }
 
}