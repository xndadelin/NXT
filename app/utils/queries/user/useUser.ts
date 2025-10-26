"use client";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { generateRandomUsername } from "../../auth/pass";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = await createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;

        const { data: userData, error: userDataError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user?.id);
        if (userDataError) throw userDataError;

        if (user && userData.length > 0) {
          user.user_metadata = { ...user.user_metadata, ...userData[0] };
        }

        if (userData.length === 0 && user) {
          const username = generateRandomUsername();
          const { error: insertError } = await supabase
            .from("users")
            .insert({
              id: user.id,
              email: user.email,
              username: username,
              provider: user.app_metadata?.provider || "unknown",
            })
            .eq("id", user.id);
          if (insertError) throw insertError;
          user.user_metadata = {
            ...user.user_metadata,
            username: username,
            provider: user.app_metadata?.provider || "unknown",
          };
        }

        setUser(user);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        window.location.reload()
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (error === "Auth session missing!") {
    setUser(null);
    setError(null);
  }

  return { user, loading, error };
}
