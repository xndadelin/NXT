"use client";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import type { User, PostgrestError } from "@supabase/supabase-js";
import { generateRandomUsername } from "../../auth/pass";

type Profile = {
  id: string;
  email: string | null;
  username: string;
  provider: string | null;
  [key: string]: unknown;
};

type AugmentedUser = User & {
  user_metadata: (User["user_metadata"] extends Record<string, unknown> ? User["user_metadata"] : Record<string, unknown>) & Profile;
};

function getMessage(e: unknown): string {
  if (typeof e === "string") return e;
  if (e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string") {
    return (e as { message: string }).message;
  }
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

function isPostgrestError(e: unknown): e is PostgrestError {
  return !!(e && typeof e === "object" && "message" in e && "code" in e);
}

function isUniqueViolation(e: unknown): boolean {
  if (isPostgrestError(e)) {
    if (e.code === "23505") return true;
    const m = e.message.toLowerCase();
    return m.includes("duplicate key") || m.includes("unique constraint") || m.includes("already exists");
  }
  const m = getMessage(e).toLowerCase();
  return m.includes("duplicate key") || m.includes("unique constraint") || m.includes("already exists");
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
          const provider =
            typeof currentUser.app_metadata?.provider === "string"
              ? currentUser.app_metadata.provider
              : "unknown";

          let lastErr: unknown = null;
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

            lastErr = upsertErr;
            if (!isUniqueViolation(upsertErr)) {
              throw upsertErr;
            }
          }
          if (!ensuredProfile && lastErr) throw lastErr;
        }

        const merged: AugmentedUser = {
          ...currentUser,
          user_metadata: {
            ...(currentUser.user_metadata ?? {}),
            ...(ensuredProfile ?? ({} as Profile)),
          },
        };

        if (!cancelled) setUser(merged);
      } catch (e) {
        const msg = getMessage(e);
        if (
          (e && typeof e === "object" && "status" in e && typeof (e as { status?: unknown }).status === "number" && (e as { status: number }).status === 401) ||
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
