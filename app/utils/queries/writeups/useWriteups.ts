

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";

interface Writeup {
    id: string;
    title: string;
    challenge_id: string;
    content_markdown: string;
    short_description: string;
    author_id: string;
    created_at: string;
    challenges : {title : string } | null;
}


export default function useWriteups() {
    const [writeups, setWriteups] = useState<Writeup[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWriteup() {
            setLoading(true);
            try {
                const supabase = createClient();
                const { data, error } = await supabase.from('writeups').select(`*, challenges (title)`);
                if(error) throw error;
                setWriteups(data || []);
            } catch (error) {
                setError(error instanceof Error ? error.message : String(error));
            } finally {
                setLoading(false);
            }
        }

        fetchWriteup();
        
    }, [])

    return { writeups, loading, error };
}