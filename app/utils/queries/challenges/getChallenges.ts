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

        setChallenges(data || []);
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
