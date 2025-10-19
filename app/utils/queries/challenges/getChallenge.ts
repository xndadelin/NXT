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
  decay: number;
  max_points: number;
  hints?: string;
}

export default function useChallenges(id: string, method: "public" | "contest", contest?: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const supabase = createClient();
        const { data: user } = await supabase.auth.getUser();
        const userId = user?.user?.id

        if (method === "contest" && contest) {
          const { data: contestData, error: contestError } = await supabase
            .from("contests")
            .select("participants")
            .eq("id", contest)
            .maybeSingle();
          if (!contestData?.participants?.includes(userId)) {
            setChallenge(null);
            setLoading(false);
            return;
          }

          const { data: link, error: linkError } = await supabase
            .from("contests_challenges")
            .select("challenge_id, points, max_points, decay")
            .eq("challenge_id", id)
            .eq("contest_id", contest)
            .maybeSingle();

          if (linkError || !link) {
            setChallenge(null);
            setLoading(false);
            return;
          }

          const { data, error } = await supabase
            .from("challenges")
            .select(
              "id, title, difficulty, category, created_at, description, resource, mitre"
            )
            .eq("id", id)
            .maybeSingle();
          if (error) {
            throw error;
          }
          if(!data) {
            setChallenge(null);
            setLoading(false);
            return;
          }
          setChallenge({
            ...data,
            points: link.points,
            max_points: link.max_points,
            decay: link.decay
          })
          return;
        }

        const { data, error } = await supabase
          .from("challenges")
          .select(
            "id, title, difficulty, category, points, created_at, description, resource, mitre, decay, max_points, hints"
          )
          .eq("id", id)
          .eq("private", method === "public" ? false : true)
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
  }, [id, method, contest]);

  return { challenge, loading, error };
}
