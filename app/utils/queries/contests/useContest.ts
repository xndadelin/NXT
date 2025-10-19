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
    challenges?: {
        challenge_id: string;
        title: string;
        difficulty: string;
        category: string;
        points: number;
    } []
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
            const has_started = new Date(data.start_time) < now
            if(has_started) {
                const { data: challengesData, error: challengesError } = await supabase.from('contests_challenges').select('challenge_id, points').eq('contest_id', contestId);
                if (challengesError) {
                    setError(challengesError.message);
                    setContest(null);
                    setLoading(false);
                    return;
                }
                const challengeIds = challengesData?.map(c => c.challenge_id) || [];
                const { data: challengesDetails, error: challengesDetailsError } = await supabase.from('challenges').select('id, title, difficulty, category').in('id', challengeIds)
                if (challengesDetailsError) {
                    setError(challengesDetailsError.message);
                    setContest(null);
                    setLoading(false);
                    return ;
                }
                data.challenges = challengesDetails.map(challenge => ({
                    challenge_id: challenge.id,
                    title: challenge.title,
                    difficulty: challenge.difficulty,
                    category: challenge.category,
                    points: challengesData.find(c => c.challenge_id === challenge.id)?.points || 0,
                }))
            }
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