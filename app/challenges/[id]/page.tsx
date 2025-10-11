"use client";

import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Paper,
  Card,
  Grid,
  List,
  Divider,
  Box,
  ThemeIcon,
  Anchor,
  TextInput,
  Button,
} from "@mantine/core";
import { useParams } from "next/navigation";
import useChallenge from "@/app/utils/queries/challenges/getChallenge";
import Loading from "@/app/components/ui/Loading";
import { Error } from "@/app/components/ui/Error";
import {
  IconCalendar,
  IconCategory,
  IconExternalLink,
  IconFlag,
  IconShield,
  IconTrophy,
} from "@tabler/icons-react";

export default function ChallengePage() {
  const { id } = useParams();
  const challengeId = typeof id === "string" ? id : String(id ?? "");
  const { challenge, loading, error } = useChallenge(challengeId);

  if (loading) return <Loading />;
  if (error) return <Error number={500} />;
  if (!challenge) return <Error number={404} />;

  const difficultyColors: { [key: string]: string } = {
    Easy: "green",
    Medium: "yellow",
    Hard: "red",
    Insane: "purple",
  };

  return (
    <Container size="xl" py="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="sm" p="lg" radius="md" withBorder mb="lg">
            <Group mb="xs" justify="space-between">
              <Title order={2} fw={700}>
                {challenge.title}
              </Title>
              <Badge
                size="lg"
                radius="md"
                color={difficultyColors[challenge.difficulty] || "gray"}
                variant="filled"
              >
                {challenge.difficulty}
              </Badge>
            </Group>

            <Divider mb="md" />

            <Box mt="md">
              <Text size="md" lh={1.6} style={{ whiteSpace: "pre-wrap" }}>
                {challenge.description}
              </Text>
            </Box>

            {challenge.resource && (
              <Box mt="xl">
                <Title order={4} mb="xs">
                  Resource
                </Title>
                <Anchor
                  href={challenge.resource}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconExternalLink size={16} />
                  <Text style={{ wordBreak: "break-all" }}>
                    {challenge.resource}
                  </Text>
                </Anchor>
              </Box>
            )}
            <form
              style={{
                display: "flex",
                marginTop: "20px",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <TextInput
                placeholder="Flag"
                variant="filled"
                radius="md"
                size="md"
                rightSection={<IconFlag size={18} />}
                style={{ flex: 1 }}
              />
              <Button variant="filled" color="green" size="md">
                Submit
              </Button>
            </form>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" p="lg" radius="md" mb="lg" withBorder>
            <Title order={4} mb="md" fw={600}>
              Challenge details
            </Title>
            <List spacing={"md"} size="md" ml={0} pl={0}>
              <List.Item
                icon={
                  <ThemeIcon color="blue" size={28} radius={"md"}>
                    <IconTrophy size={16} />
                  </ThemeIcon>
                }
              >
                <Group align="center" gap={"5"}>
                  <Text fw={500}>Points:</Text>
                  <Text>{challenge.points}</Text>
                </Group>
              </List.Item>

              <List.Item
                icon={
                  <ThemeIcon color="teal" size={28} radius="md">
                    <IconCategory size={16} />
                  </ThemeIcon>
                }
              >
                <Group align="center" gap={5}>
                  <Text fw={500}>Category: </Text>
                  <Text>{challenge.category}</Text>
                </Group>
              </List.Item>

              {challenge.mitre && (
                <List.Item
                  icon={
                    <ThemeIcon color="indigo" size={28} radius={"md"}>
                      <IconShield size={16} />
                    </ThemeIcon>
                  }
                >
                  <Group align="center" gap={5}>
                    <Text fw={500}>MITRE ATT&CK:</Text>
                    <Text>{challenge.mitre}</Text>
                  </Group>
                </List.Item>
              )}

              <List.Item
                icon={
                  <ThemeIcon color="orange" size={28} radius={"md"}>
                    <IconCalendar size={16} />
                  </ThemeIcon>
                }
              >
                <Group align="center" gap={5}>
                  <Text fw={500}>Created on:</Text>
                  <Text>
                    {new Date(challenge.created_at).toLocaleDateString()}
                  </Text>
                </Group>
              </List.Item>
            </List>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
