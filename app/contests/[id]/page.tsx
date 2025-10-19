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
  Divider,
  SimpleGrid,
} from "@mantine/core";
import { Tabs } from "@mantine/core";
import MDEditor from "@uiw/react-md-editor";

interface Challenge {
  challenge_id: string;
  title: string;
  difficulty: string;
  category: string;
  points: number;
}

export default function ContestPage() {
  const params = useParams();
  const { contest, loading, error } = useContest({
    contestId: params.id as string,
  });

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
      <div style={{ height: '20px' }}></div>
      <Tabs defaultValue={"about"}>
        <Tabs.List>
          <Tabs.Tab value="about">About</Tabs.Tab>
          <Tabs.Tab value="rules">Rules</Tabs.Tab>
          <Tabs.Tab value="challenges">Challenges</Tabs.Tab>
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
                  >
                    <Title order={5}>{challenge.title}</Title>
                    <Text size="sm" mt="xs">
                      Difficulty: {challenge.difficulty}
                    </Text>
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
      </Tabs>
      <div style={{ height: "200px" }}></div>
    </Container>
  );
}
