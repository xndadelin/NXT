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
  Menu,
  ActionIcon,
} from "@mantine/core";
import { useParams } from "next/navigation";
import useChallenge from "@/app/utils/queries/challenges/getChallenge";
import Loading from "@/app/components/ui/Loading";
import { Error } from "@/app/components/ui/Error";
import DOMPurify from "dompurify";
import Link from "next/link";
import {
  IconBook,
  IconBulb,
  IconCalendar,
  IconCategory,
  IconDots,
  IconExternalLink,
  IconFlag,
  IconMessageCircle,
  IconShield,
  IconTrash,
  IconTrophy,
  IconArrowUp,
  IconArrowDown
} from "@tabler/icons-react";
import { FormEvent, useEffect, useState } from "react";
import checkIfDone from "@/app/utils/queries/challenges/checkIfDone";
import { submitFlag } from "@/app/utils/mutations/challenges/submitFlag";
import { notifications } from "@mantine/notifications";
import useUser from "@/app/utils/queries/user/useUser";
import { useRouter } from "next/navigation";
import deleteChallenge from "@/app/utils/queries/challenges/deleteChallenge";
import Discussion from "@/app/components/challenge/discussion/Discussion";
import { useVoteChallenge } from "@/app/utils/mutations/challenges/useChallengeVotes";
import MDEditor from "@uiw/react-md-editor";

export default function ChallengePage() {
  const { id } = useParams();
  const challengeId = typeof id === "string" ? id : String(id ?? "");
  const { challenge, loading, error } = useChallenge(challengeId);
  const [done, setDone] = useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();
  const [flagValue, setFlagValue] = useState<string>("");
  const [pressedHints, setPressedHints] = useState<boolean>(false);
  const { votes, userVote, loading: votesLoading, vote, votingError, fetchVotes } = useVoteChallenge(challengeId, user?.id)

  useEffect(() => {
    async function fetchDone() {
      const done = await checkIfDone(challengeId);
      setDone(done);
    }
    fetchDone();
  }, [challengeId]);
  
  useEffect(() => {
    if(votingError) {
      notifications.show({
        title: 'Oops, something went wrong!',
        message: votingError,
        color: 'red'
      })
    }
  }, [votingError]);

  if (loading) return <Loading />;
  if (error) return <Error number={500} />;
  if (!challenge) return <Error number={404} />;

  const difficultyColors: { [key: string]: string } = {
    Easy: "green",
    Medium: "yellow",
    Hard: "red",
    Insane: "purple",
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isCorrect = await submitFlag(challengeId, flagValue);
    if (isCorrect) {
      setDone(true);
      notifications.show({
        title: "Success",
        message: "Correct flag! Challenge completed.",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Incorrect",
        message: "The flag you submitted is incorrect. Please try again.",
        color: "red",
      });
    }
  };

  const onDelete = () => {
    if (
      confirm(
        "Are you ABSOLUTELY SURE YOU WANT TO DELETE THIS CHALLENGE? THIS ACTION CANNOT BE UNDONE IN ANY WAY!"
      ) &&
      user?.user_metadata?.admin
    ) {
      try {
        deleteChallenge(challengeId);
        router.push("/challenges");
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "There was an error deleting the challenge." + error,
          color: "red",
        });
      }
    }
  };

  return (
    <Container size="xl" py="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="sm" p="lg" radius="md" withBorder mb="lg">
            <Group justify="space-between" align="flex-start" mb="lg">
              <Group align="center">
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

              {user?.user_metadata?.admin && (
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size={"lg"}
                      radius={"md"}
                    >
                      <IconDots size={18} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Admin actions</Menu.Label>
                    <Menu.Item
                      leftSection={<IconCategory size={14} />}
                      onClick={() =>
                        router.push(`/challenges/${challengeId}/edit`)
                      }
                    >
                      Edit challenge
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash size={14} />}
                      onClick={() => onDelete()}
                    >
                      Delete challenge
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>

            <Divider mb="md" />

            <Box mt="md">
              <MDEditor.Markdown source={challenge.description} />
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
            {user && (
              <form
                onSubmit={onSubmit}
                style={{
                  display: "flex",
                  marginTop: "20px",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <TextInput
                  placeholder={done ? "Challenge completed" : "Flag"}
                  variant="filled"
                  radius="md"
                  size="md"
                  rightSection={<IconFlag size={18} />}
                  style={{ flex: 1 }}
                  disabled={done}
                  value={flagValue}
                  onChange={(e) => setFlagValue(e.target.value)}
                  type="text"
                />
                <Button
                  variant="filled"
                  color="green"
                  size="md"
                  disabled={done}
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            )}
          </Paper>
          <Discussion challengeId={challengeId} />
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
                    <Link
                      target="_blank"
                      style={{ color: "white" }}
                      href={challenge.mitre}
                    >
                      {challenge.mitre.split("/")[4]}
                    </Link>
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
          <Card shadow="sm" p="lg" mb="md" radius={"md"} withBorder>
            <Title order={4} mb="md" fw={600}>
              Need help?
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              Stuck on this challenge?
            </Text>
            <Button
              variant="light"
              fullWidth
              mb="xs"
              leftSection={<IconBulb size={14} />}
              onClick={() => setPressedHints(!pressedHints)}
            >
              View hints
            </Button>
            {pressedHints && (
              <Text size="sm" c="dimmed" mb="md">
                {!challenge?.hints
                  ? "No hints available for this challenge."
                  : challenge?.hints}
              </Text>
            )}
            <Button
              variant="light"
              fullWidth
              leftSection={<IconMessageCircle size={14} />}
              mb="xs"
              component={Link}
              href={"/challenges"}
            >
              Try another challenge
            </Button>
            <Button
              variant="light"
              fullWidth
              mb="xs"
              leftSection={<IconBook size={14} />}
            >
              Writeups
            </Button>
          </Card>
          <Card shadow="sm" p="lg" radius={"md"} withBorder>
            <Group align="center" gap={8} mt="md" justify="center">
              <Button
                variant={userVote === 1 ? "filled" : "light"}
                color="orange"
                size="xs"
                radius={"xl"}
                onClick={async () => {
                  await vote(1);
                  fetchVotes();
                }}
                leftSection={<IconArrowUp size={14} />}
                disabled={!user}
                style={{ flex: 1 }}
              >
                Upvote
              </Button>
              <Text fw={700} fz={18} mx={4} style={{ flex: 1, textAlign: 'center'}}>
                {votes.upvotes}{" "}
                <IconArrowUp size={14} style={{ verticalAlign: "middle" }} /> /{" "}
                {votes.downvotes}{" "}
                <IconArrowDown size={14} style={{ verticalAlign: "middle" }} />
              </Text>
              <Button
                variant={userVote === -1 ? "filled" : "light"}
                color="cyan"
                size="xs"
                radius={"xl"}
                onClick={async () => {
                  await vote(-1);
                  fetchVotes();
                }}
                leftSection={<IconArrowDown size={14} />}
                disabled={!user}
                style={{ flex: 1}}
              >
                Downvote
              </Button>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={12}></Grid.Col>
      </Grid>
    </Container>
  );
}
