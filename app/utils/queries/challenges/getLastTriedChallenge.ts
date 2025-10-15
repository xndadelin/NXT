import { createClient } from "../../supabase/client";
import { useEffect, useState } from "react";

interface lastTriedChallenge {
    id: string;
    title: string;
    points: number;
    category: string;
    difficulty: string
}

export function useGetLastTriedChallenge() {
    const supabase = createClient();
    const [error, setError] = useState<Error>()
    const [lastTriedChallenge, setLastTriedChallenge] = useState<lastTriedChallenge | null>(null)
    const [loading, setLoading] = useState(true);

    const getLastTriedChallenge = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            setError(error);
        }
        const userId = data.user?.id;
        if(!userId) {
            return ;
        }

        const { data: last, error: lastError } = await supabase
            .from('submissions')
            .select('challenge')
            .filter('user_id', 'eq', userId)
            .filter('done', 'eq', false)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if(lastError) {
            setError(lastError);
            setLoading(false);
            return;
        }

        if(!last) {
            setLastTriedChallenge(null);
            setLoading(false);
            return;
        } else {
            const challengeId = last.challenge as string;
            const { data: challengeData, error: challengeError } = await supabase
                .from('challenges')
                .select('id, title, points, category, difficulty')
                .eq('id', challengeId);

            if(challengeError) {
                setError(challengeError);
                setLoading(false);
                return;
            }

            if(!challengeData || challengeData.length === 0) {
                setLastTriedChallenge(null);
                setLoading(false);
                return ;
            }

            setLastTriedChallenge(challengeData[0] as lastTriedChallenge);
            setLoading(false);

        }
    }

    useEffect(() => {
        getLastTriedChallenge();
    }, []);

    return { lastTriedChallenge, error, loading}

}