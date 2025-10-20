import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";

export interface LeaderboardUser {
  id: string;
  username: string;
  points: number;
  blood: number;
  tries: number;
  completedChallenges: number;
  notCompletedChallenges: number;
}

export interface Submission {
  user_id: string;
  users: {
    username: string;
  } | null;
  challenges: {
    id: string;
    points: number;
    title?: string;
  } | null;
  updated_at: Date;
  blood: boolean;
  done: boolean;
  tries: number;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("submissions")
          .select("user_id, users(username), challenges(points, id), updated_at, blood, done, tries")
          .filter('contest_id', 'is', null);

        if (error) {
          throw error;
        }

        const leaderboardMap: Record<string, LeaderboardUser> = {};
        const submissions = data as unknown as Submission[]

        (submissions)?.forEach((submission) => {
          const userId = submission.user_id;
          const username = submission.users?.username ?? "unk";
          const points = submission.challenges?.points ?? 0;

          if (!leaderboardMap[userId]) {
            leaderboardMap[userId] = {
              id: userId,
              username,
              points: 0,
              blood: 0,
              tries: 0,
              completedChallenges: 0,
              notCompletedChallenges: 0
            }
          }
          leaderboardMap[userId].points += submission.done ? points: 0;
          leaderboardMap[userId].blood += submission.blood ? 1 : 0 ;
          leaderboardMap[userId].tries += submission.tries || 0;
          if(submission.done) {
            leaderboardMap[userId].completedChallenges += 1;
          } else {
            leaderboardMap[userId].notCompletedChallenges += 1;
          }
        })


        setLeaderboard(leaderboardMap ? Object.values(leaderboardMap).sort((a, b) => b.points - a.points) : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    const channel = supabase
      .channel("challenges_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submissions",
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { leaderboard, loading, error };
}
