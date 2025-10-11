import { createClient } from "../../supabase/client";

export default async function getSolvedChallenges(userId: string) {
    if(!userId) return [];
    const supabase = createClient();
    
    try {
        const { data, error } = await supabase
            .from("submissions")
            .select("challenge")
            .eq("user_id", userId)
            .eq("done", true);
            
        if (error) {
            throw error;
        }
    
        return data ? data.map(challenge => challenge.challenge) : [];
    } catch (err) {
        console.error(err) // lint purposes
        return [];
    }
}