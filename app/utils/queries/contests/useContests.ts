import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";

interface Contest {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    created_at: string;
    banner: string;
}

export default function useContests() {
    const supabase = createClient();
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchContests() {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('contests').select('*');
            if (error) {
                throw error;
            } 
            setContests(data || [])
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchContests();
    }, [])

    return { contests, loading, error }
}