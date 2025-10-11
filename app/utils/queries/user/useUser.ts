'use client';
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const supabase = await createClient();
                const { data: { user }, error } = await supabase.auth.getUser();
                if(error) throw error;
                setUser(user);
            } catch (error) {
                setError(error instanceof Error ? error.message : String(error));
            } finally {
                setLoading(false)
            }
        }

        fetchUser();

        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        })

        return () => {
            subscription.unsubscribe();
        }

    }, []);


    if (error === 'Auth session missing!') {
        setUser(null);
        setError(null);
    }
    
    return { user, loading, error };
}