import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";

interface Stats {
  solvedChallenges: number;
  triedChallenges: number;
  accuracy: number;
}

export default function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient();
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData || !userData.user) {
          setStats(null);
          return;
        }
        const userId = userData.user.id;

        const { data: solvedChallenges, error: solvedError } = await supabase
          .from("submissions")
          .select("challenge, tries")
          .eq("done", true)
          .eq("user_id", userId);
        if (solvedError) throw solvedError;

        const { data: triedChallenges, error: triedError } = await supabase
          .from("submissions")
          .select("challenge, tries")
          .eq("user_id", userId)
          .eq("done", false);
        if (triedError) throw triedError;

        const solvedCount = solvedChallenges ? solvedChallenges.length : 0;
        const triedCount = triedChallenges ? triedChallenges.length : 0;
        const totalAttempts1 = solvedChallenges
          ? solvedChallenges.reduce((acc, curr) => acc + (curr.tries || 0), 0)
          : 0;
        const totalAttempts2 = triedChallenges
          ? triedChallenges.reduce((acc, curr) => acc + (curr.tries || 0), 0)
          : 0;
        const totalAttempts = totalAttempts1 + totalAttempts2;

        const accuracy = solvedCount / totalAttempts || 0;
        setStats({
          solvedChallenges: solvedCount,
          triedChallenges: triedCount,
          accuracy: parseFloat((accuracy * 100).toFixed(2)),
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
