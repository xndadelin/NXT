"use client";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { generateRandomUsername } from "../../auth/pass";

type Profile = {
  id: string;
  email: string | null;
  username: string;
  provider: string | null;
  [key: string]: unknown;
};

function toMessage(e: unknown) {
  if (e && typeof e === "object" && "message" in e) return String((e as any).message);
  try { return JSON.stringify(e); } catch { return String(e); }
}

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        const currentUser = authData.user;
        if (!currentUser) {
          if (!cancelled) setUser(null);
          return;
        }

        const { data: profile, error: readErr } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (readErr) throw readErr;
        let ensuredProfile = profile as Profile | null;

        if (!ensuredProfile) {
          const provider = (currentUser.app_metadata as any)?.provider ?? "unknown";
          let lastInsertErr: any = null;
          for (let attempt = 0; attempt < 5; attempt++) {
            const username = generateRandomUsername();
            const { data: upserted, error: upsertErr } = await supabase
              .from("users")
              .upsert(
                {
                  id: currentUser.id,
                  email: currentUser.email,
                  username,
                  provider,
                },
                { onConflict: "id" }
              )
              .select()
              .maybeSingle();

            if (!upsertErr) {
              ensuredProfile = upserted as Profile;
              break;
            }

            lastInsertErr = upsertErr;
            const msg = (upsertErr as any)?.message?.toLowerCase?.() ?? "";
            if (!msg.includes("unique") && !msg.includes("duplicate")) {
              throw upsertErr;
            }
          }
          if (!ensuredProfile && lastInsertErr) throw lastInsertErr;
        }

        const merged = {
          ...currentUser,
          user_metadata: {
            ...(currentUser.user_metadata ?? {}),
            ...(ensuredProfile ?? {}),
          },
        } as User;

        if (!cancelled) setUser(merged);
      } catch (e) {
        const msg = toMessage(e);
        if (
          (typeof e === "object" && e && "status" in e && (e as any).status === 401) ||
          msg.toLowerCase().includes("auth session missing")
        ) {
          if (!cancelled) setUser(null);
        } else {
          if (!cancelled) setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading, error };
}
