import { createClient } from "@/app/utils/supabase/client"

export default async function logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    return;
}