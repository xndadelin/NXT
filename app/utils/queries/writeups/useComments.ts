import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";

interface comments {
  id: string;
  challenge_id: string;
  user_id: string;
  text: string;
  created_at: string;
  respond_to?: string;
  username: string;
}

export function useComments(writeupId: string) {
  const [comments, setcomments] = useState<comments[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchcomments = async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("writeup_comments")
        .select("*, users!writeup_comments_user_id_fkey (username)")
        .eq("writeup_id", writeupId)
        .order("created_at", { ascending: true });
      if (error) {
        throw new Error(error.message);
      }

      const transformedData = data?.map((d) => ({
        ...d,
        username: d.users?.username || "unk",
      }));

      setcomments(transformedData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchcomments();
  }, [writeupId]);

  return { comments, loading, error, refetch: fetchcomments };
}
