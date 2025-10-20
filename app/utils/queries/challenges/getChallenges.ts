"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";

export interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  points: number;
  created_at: string;
  accuracy?: number;
  downvotes?: number;
  upvotes?: number;
}

export default function useChallenges({ method }: { method: "public" | "private" }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const supabase = createClient();
        let query = supabase.from('challenges').select('*');
        if(method === 'public') {
          query = query.eq('private', false);
        }
        const { data, error } = await query;

        if (error) {
          throw error;
        }

        const { data: submissions, error: subError } = await supabase.from('submissions').select('challenge, done, tries');
        if(subError) throw subError;

        const statsMap: Record<string, { triesCount: number; solvesCount: number }> = {};
        submissions?.forEach((submission) => {
          if(!statsMap[submission.challenge]) {
            statsMap[submission.challenge] = {
              triesCount: 0,
              solvesCount: 0
            }
          }
          statsMap[submission.challenge].triesCount += submission.tries || 0;
          if(submission.done) {
            statsMap[submission.challenge].solvesCount += 1
          }
        })

        const challengesWithStats = (data || []).map((challenge) => {
          const stats = statsMap[challenge.id] || { triesCount: 0, solvesCount: 0 };
          const accuracy = stats.triesCount > 0 ? (stats.solvesCount / stats.triesCount) : 0; 
          return {
            ...challenge, 
            accuracy: accuracy * 100
          }
        })

        setChallenges(challengesWithStats);

        const { data: votesData, error: votesError } = await supabase.from('challenge_votes').select('challenge_id, vote_type');
        if(votesError) throw votesError;

        const votesMap: Record<string, { upvotes: number; downvotes: number }> = {};
        votesData?.forEach((votes) => {
          if(!votesMap[votes.challenge_id]) {
            votesMap[votes.challenge_id] = {
              upvotes: 0,
              downvotes: 0
            }
          }
          if(votes.vote_type === -1) {
            votesMap[votes.challenge_id].downvotes += 1;
          } else {
            votesMap[votes.challenge_id].upvotes += 1;
          }
        })

        const challengesWithVotes = challengesWithStats.map((challenge) => {
          const votes = votesMap[challenge.id] || { upvotes: 0, downvotes: 0};
          return {
            ...challenge,
            upvotes: votes.upvotes,
            downvotes: votes.downvotes
          }
        })

        setChallenges(challengesWithVotes)

        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) {
          throw userError;
        }
        if (!userData || !userData.user) {
          setSolvedChallenges([]);
          return;
        }
        const { data: solvedChallenges, error: solvedError } = await supabase
          .from("submissions")
          .select("challenge")
          .eq("done", true)
          .eq("user_id", userData?.user.id);

        if (solvedError) {
          throw solvedError;
        }

        setSolvedChallenges(
          solvedChallenges ? solvedChallenges.map((sc) => sc.challenge) : []
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  return { challenges, loading, error, solvedChallenges };
}
