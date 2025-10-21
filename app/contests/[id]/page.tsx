"use client";

import { Error } from "@/app/components/ui/Error";
import Loading from "@/app/components/ui/Loading";
import useContest from "@/app/utils/queries/contests/useContest";
import { useParams } from "next/navigation";
import {
  Container,
  Card,
  Image,
  Title,
  Text,
  SimpleGrid,
  Badge,
  Group,
  Table,
} from "@mantine/core";
import { Tabs } from "@mantine/core";
import MDEditor from "@uiw/react-md-editor";
import Link from "next/link";
import useLeaderboard from "@/app/utils/queries/contests/getLeaderboard";

interface Challenge {
  challenge_id: string;
  title: string;
  difficulty: string;
  category: string;
  points: number;
}

function getDifficultyColor(difficulty: string) {
    switch(difficulty.toLowerCase()) {
        case 'easy':
            return 'green';
        case 'medium':
            return 'yellow';
        case 'hard':
            return 'red'
        case 'insane':
            return 'purple'
        default:
            return 'gray'
    }
}

export default function ContestPage() {
  const params = useParams();
  const { contest, loading, error } = useContest({
    contestId: params.id as string,
  });
  const { leaderboard } = useLeaderboard(params.id as string)
  console.log(leaderboard)

  if (loading) return <Loading />;
  if (error) return <Error number={500} />;
  if (!contest) return <Error number={404} />;

  return (
    <Container>
      {contest.banner && (
        <Card shadow="sm" radius="md" withBorder p={0}>
          <Card.Section>
            <Image
              src={contest.banner}
              alt={contest.title}
              height={200}
              fit="cover"
            />
          </Card.Section>
        </Card>
      )}
      <div style={{ height: "20px" }}></div>
      <Tabs defaultValue={"about"}>
        <Tabs.List>
          <Tabs.Tab value="about">About</Tabs.Tab>
          <Tabs.Tab value="rules">Rules</Tabs.Tab>
          <Tabs.Tab value="challenges">Challenges</Tabs.Tab>
          <Tabs.Tab value="leaderboard">Leaderboard</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="about" pt="xs">
          <Text fw={500} fz={50} mb="xs">
            {contest.title}
          </Text>
          <MDEditor.Markdown source={contest.description} />
        </Tabs.Panel>
        <Tabs.Panel value="rules" pt="xs">
          <Title order={3} mt="lg" mb="md">
            Rules
          </Title>
          <MDEditor.Markdown source={contest.rules} />
        </Tabs.Panel>
        <Tabs.Panel value="challenges" pt="xs">
          {contest.challenges && contest.challenges.length > 0 ? (
            <>
              <Title order={3} mt="lg" mb="md">
                Challenges
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {contest.challenges.map((challenge: Challenge) => (
                  <Card
                    key={challenge.challenge_id}
                    shadow="sm"
                    radius="sm"
                    withBorder
                    style={{
                      transition: "transform 0.3s cubic-bezier(.4,2,.3,1)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1.00)")
                    }
                    component={Link}
                    href={`/challenges/${challenge.challenge_id}/contest/${params.id}`}
                  >
                    <Group justify="space-between" align="center" mb="xs">
                      <Title order={5}>{challenge.title}</Title>
                      <Badge
                        color={getDifficultyColor(challenge.difficulty)}
                        size="sm"
                      >
                        {challenge.difficulty}
                      </Badge>
                    </Group>
                    <Text size="sm" mt="xs">
                      Category: {challenge.category}
                    </Text>
                    <Text size="sm" mt="xs">
                      Points: {challenge.points}
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>
            </>
          ) : (
            <Text>The contest did not start yet!</Text>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="leaderboard" pt="xs">
          <Title order={3} mt="lg" mb="md">
            Leaderboard
          </Title>
          <Table highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Rank</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>Points</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {leaderboard.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text c="dimmed">No solves yet.</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                leaderboard.map((entry) => (
                  <Table.Tr key={entry.user_id}>
                    <Table.Td>
                      {entry.rank === 1 && <Badge color="yellow">🥇</Badge>}
                      {entry.rank === 2 && <Badge color="gray">🥈</Badge>}
                      {entry.rank === 3 && <Badge color="orange">🥉</Badge>}
                      {entry.rank > 3 && entry.rank}
                    </Table.Td>
                    <Table.Td>{entry.username}</Table.Td>
                    <Table.Td>{entry.total_points}</Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
      </Tabs>
      <div style={{ height: "200px" }}></div>
    </Container>
  );
}
