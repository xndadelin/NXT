import { createClient } from "../../supabase/client";

export const getLearderboard = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("users")
        .select("id, username, points")
        .order("points", { ascending: false })
    
    if (error) {
        throw error;
    };

    return data || []
}