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
    participants: string[];
    has_ended?: boolean;
    rules: string;
}

export default function useContest({ contestId } : { contestId: string }) {
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();
 
    async function getContestById(contestId: string): Promise<void> {
        const { data: user } = await supabase.auth.getUser();
        if(!user) return;
        const { data, error } = await supabase.from('contests').select('*').eq('id', contestId).contains('participants', [user?.user?.id]).maybeSingle();
        if (error) {
            setError(error.message);
            setContest(null);
        } else if (!data) {
            setError("contest not found");
            setContest(null);
        } else {
            const now = new Date();
            const has_ended = new Date(data.end_time) < now;
            setContest({ ...data, has_ended });
            setError(null);
        }
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        getContestById(contestId);
    }, [contestId]);

    return { contest, loading, error };
}