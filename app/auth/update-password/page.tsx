"use client";

import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Button,
  Title,
  Text,
  PasswordInput,
  Group,
} from "@mantine/core";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      console.log(event);
      if (event === "PASSWORD_RECOVERY") {
        setIsReady(true);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      alert("great! password updated succesfully");
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  if (!isReady)
    return (
      <Container size="xs" mt="xl">
        <Paper p="xl" withBorder>
          <Title order={3} mb="md">
            Password reset
          </Title>
          <Text>Waiting for password reset confirmation...</Text>
          <Text size="sm" c="dimmed">
            If nothing happens, your link might be invalid or expired. Please
            try again!
          </Text>
          <Button mt="lg" onClick={() => router.push("/settings")}>
            Return to settings
          </Button>
        </Paper>
      </Container>
    );

  return (
    <Container size="xs" mt="xl">
      <Paper p="xl" withBorder>
        <Title order={3} mb="lg">
          Reset your password
        </Title>

        {error && (
          <Text c="red" mb="md">
            {error}
          </Text>
        )}

        <form onSubmit={handleUpdatePassword}>
          <PasswordInput
            label="New password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
            required
            mb="xl"
          />

          <Group justify="space-between">
            <Button
              variant="subtle"
              onClick={() => router.push("/settings")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} loading={loading}>
              Update password
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
