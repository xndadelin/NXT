import { createClient } from "@/app/utils/supabase/client";


export default async function getUser() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    return { data, error }
}