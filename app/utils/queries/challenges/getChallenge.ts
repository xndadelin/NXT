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
  description: string;
  resource: string;
  mitre: string;
  hints: string;
  decay: number;
  max_points: number;
}

export default function useChallenges(id: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("challenges")
          .select(
            "id, title, difficulty, category, points, created_at, description, resource, mitre, hint, decay, max_points, hints"
          )
          .eq("id", id)
          .maybeSingle();
        if (error) {
          throw error;
        }

        setChallenge(data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchChallenge();
  }, [id]);

  return { challenge, loading, error };
}
