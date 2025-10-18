import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";

export function useVoteChallenge(challengeId: string, userId: string | undefined) {
    const [loading, setLoading] = useState<boolean>(false);
    const [userVote, setUserVote] = useState<1 | -1 | null>(null)
    const [votes, setVotes] = useState<{ upvotes: number; downvotes: number }>({ upvotes: 0, downvotes: 0 });
    const [votingError, setVotingError] = useState<string | null>(null)

    async function fetchVotes() {
        const supabase = createClient();
        const { count: upvotes } = await supabase.from('challenge_votes').select('*', {
            count: 'exact',
            head: true
        }).eq('challenge_id', challengeId).eq('vote_type', 1);

        const { count: downvotes } = await supabase.from('challenge_votes').select('*', {
            count: 'exact',
            head: true
        }).eq('challenge_id', challengeId).eq('vote_type', -1);

        setVotes({
            upvotes: upvotes ?? 0,
            downvotes: downvotes ?? 0
        })

        if(userId) {
            const { data } = await supabase.from('challenge_votes').select('vote_type').eq('challenge_id', challengeId).eq('user_id', userId).maybeSingle();
            setUserVote(data?.vote_type ?? null);
        } else setUserVote(null);
    }

    useEffect(() => {
        fetchVotes();
    }, [challengeId, userId]);

    const vote = async (type: 1 | -1) => {
        if(!userId) return;
        setLoading(true);
        const supabase = createClient();
        const {error} = await supabase.from('challenge_votes').upsert({
            challenge_id: challengeId,
            user_id: userId,
            vote_type: type
        }, { onConflict: 'challenge_id,user_id' })
        if(error) {
            setVotingError(error.message)
        }
        setLoading(false);
    }

    return { votes, userVote, loading, vote, votingError, fetchVotes }
}