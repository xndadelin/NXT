import { createClient } from "../../supabase/client";

export default async function checkFlag(challengeId: string, flag: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from('challenges').select('id').eq('id', challengeId).eq('flag', flag);
    if (error) {
        throw error;
    }
    return true ? data.length > 0 : false;
}