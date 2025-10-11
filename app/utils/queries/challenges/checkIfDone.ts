import { createClient } from "../../supabase/client";

export default async function checkIfDone(challengeId: string) {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data) return false;

    const { user } = data;
    const id = user?.id;
    if (!id) return false;

    const { data: challengeData } = await supabase
        .from("submissions")
        .select("id")
        .eq("user_id", id)
        .eq("challenge", challengeId)
        .eq("done", true);

    return Boolean(challengeData && challengeData.length > 0);
}