import { createClient } from "@/app/utils/supabase/client";

export const signInWithPass = async(email: string, password: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const signUpWithPass = async(email: string, password: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    })

    if (error) {
        throw new Error(error.message);
    }

    return data;
}