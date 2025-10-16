import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";

interface Discussion {
    id: string;
    challenge_id: string;
    user_id: string;
    text: string;
    created_at: string;
    respond_to?: string;
    username: string;
}

export function useDiscussion(challengeId: string) {
    const [discussion, setDiscussion] = useState<Discussion[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null)


    const fetchDiscussion = async () => {
        setLoading(true);
        const supabase = createClient();
        try {
            const { data, error } = await supabase.from('discussions').select('*, users!discussions_user_id_fkey (username)').eq('challenge_id', challengeId).order('created_at', { ascending: true})
            if(error) {
                throw new Error(error.message);
            }

            const transformedData = data?.map(d => ({
                ...d,
                username: d.users?.username || 'unk'
            }))

            setDiscussion(transformedData || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchDiscussion();
    }, [challengeId]);

    return { discussion, loading, error, refetch: fetchDiscussion };
}