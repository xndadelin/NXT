import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";

interface Leaderboard {
    user_id: string;
    username: string;
    total_points: number;
    rank: number;
}

export default function useLeaderboard(contestId: string) {
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([])
    const supabase = createClient();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchLeaderboard() {
        setLoading(true);
        try {
            const { data: contest, error: contestError } = await supabase.from('contests').select('participants').eq('id', contestId).maybeSingle();

            if(contestError) throw contestError
            if(!contest){
                setLeaderboard([]);
                return;
            }
            const participantsIds = contest.participants ?? [];
            
            if(participantsIds.length === 0) {
                setLeaderboard([]);
                setLoading(false);
                return;
            }

            const { data: users, error: usersError } = await supabase.from('users').select('id, username').in('id', participantsIds);

            if(usersError) throw usersError;

            const { data: submissions, error: submissionsError } = await supabase.from('submissions').select('user_id, challenge, done').eq('contest_id', contestId).eq('done', true);

            if(submissionsError) throw submissionsError;

            const { data: contestsChallenges, error: ccError } = await supabase.from('contests_challenges').select('challenge_id, points').eq('contest_id', contestId);

            if(ccError) throw ccError;

            const userPointsMap: Record<string, number> = {};
            submissions.forEach(submission => {
                const challengeLink = contestsChallenges.find(cc => cc.challenge_id === submission.challenge)
                const points = Number(challengeLink?.points || 0)
                if(!userPointsMap[submission.user_id]) userPointsMap[submission.user_id] = 0;
                userPointsMap[submission.user_id] += points
            })

            let leaderboardData: Leaderboard[] = users.map(user => ({
                user_id: user.id,
                username: user.username,
                total_points: userPointsMap[user.id] || 0,
                rank: 0
            }))

            leaderboardData.sort((a, b) => b.total_points - a.total_points);

            leaderboardData = leaderboardData.map((entry, index) => ({
                ...entry,
                rank: index + 1
            }))
            setLeaderboard(leaderboardData)
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeaderboard();
    }, [contestId])

    return { leaderboard, loading, error };
}