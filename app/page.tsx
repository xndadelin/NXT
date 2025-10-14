"use client";

import Image from "next/image";
import { HeroSection } from "./components/ui/HeroSection";
import {
  Divider,
  SimpleGrid,
  Text,
  Title,
  Card,
  ThemeIcon,
  Container,
  Paper,
  Button,
  Box,
  Group,
  Badge,
} from "@mantine/core";
import useUser from "./utils/queries/user/useUser";
import { Error } from "./components/ui/Error";
import {
  IconArrowRight,
  IconAward,
  IconBook,
  IconBrain,
  IconRocket,
  IconShield,
  IconUserCode,
} from "@tabler/icons-react";
import Link from "next/link";
import Loading from "./components/ui/Loading";
import useStats from "./utils/queries/user/useStats";
import { getLastTriedChallenge } from "./utils/queries/challenges/getLastTriedChallenge";

function FeatureCard({
  icon,
  color,
  title,
  description,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <Card p="lg" radius="md" withBorder>
      <ThemeIcon size={50} radius="md" color={color} variant="light" mb={"md"}>
        {icon}
      </ThemeIcon>
      <Text fw={500} size="lg" mb="xs">
        {title}
      </Text>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Card>
  );
}

export default function Home() {
  const { user, loading, error } = useUser();
  const { stats, loading: statsLoading } = useStats();
  const { lastTriedChallenge, error: lastTriedChallengeError, loading: loadingLastTriedChallenge } = getLastTriedChallenge();
  console.log(lastTriedChallenge, lastTriedChallengeError);
  if (loading) return <Loading />;

  if (error) return <Error number={500} />;

  return (
    <div>
      {!user ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 300px)",
          }}
        >
          <HeroSection />
          <svg
            style={{ marginTop: 140, marginBottom: 40 }}
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-down"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 3.66a1 1 0 0 0 -1 1v5.585l-2.293 -2.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l4 4c.028 .028 .057 .054 .094 .083l.092 .064l.098 .052l.081 .034l.113 .034l.112 .02l.117 .006l.115 -.007l.114 -.02l.142 -.044l.113 -.054l.111 -.071a.939 .939 0 0 0 .112 -.097l4 -4l.083 -.094a1 1 0 0 0 -1.497 -1.32l-2.293 2.291v-5.584l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
          </svg>
          <section id="about">
            <Container size="lg" mb={80}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2rem",
                }}
              >
                <Title order={2} ta="center" fw={800} size={36}>
                  About NextCTF
                </Title>

                <Text
                  size="xl"
                  ta="center"
                  style={{ maxWidth: "700px", lineHeight: 1.6 }}
                >
                  NextCTF is a cybersecurity training platform where
                  participants solve challenges to develop and improve their
                  security skills.
                </Text>

                <SimpleGrid
                  cols={{ base: 1, sm: 3 }}
                  spacing="xl"
                  style={{ width: "100%" }}
                >
                  <Paper p="md" radius="md" withBorder>
                    <ThemeIcon
                      size={48}
                      radius="md"
                      color="blue"
                      variant="light"
                      mb="md"
                    >
                      <IconShield size={24} />
                    </ThemeIcon>
                    <Text fw={600} mb="xs">
                      What is a CTF?
                    </Text>
                    <Text size="sm" c="dimmed">
                      &quot;Capture The Flag&quot; competitions are
                      cybersecurity contests where you solve challenges to find
                      hidden flags and earn points.
                    </Text>
                  </Paper>

                  <Paper p="md" radius="md" withBorder>
                    <ThemeIcon
                      size={48}
                      radius="md"
                      color="grape"
                      variant="light"
                      mb="md"
                    >
                      <IconBrain size={24} />
                    </ThemeIcon>
                    <Text fw={600} mb="xs">
                      Learn by doing
                    </Text>
                    <Text size="sm" c="dimmed">
                      Practice with web security, cryptography, reverse
                      engineering, and forensics challenges designed for all
                      skill levels.
                    </Text>
                  </Paper>

                  <Paper p="md" radius="md" withBorder>
                    <ThemeIcon
                      size={48}
                      radius="md"
                      color="teal"
                      variant="light"
                      mb="md"
                    >
                      <IconAward size={24} />
                    </ThemeIcon>
                    <Text fw={600} mb="xs">
                      Compete
                    </Text>
                    <Text size="sm" c="dimmed">
                      Join competitions, climb the leaderboard, and track your
                      progress as you develop your cybersecurity expertise.
                    </Text>
                  </Paper>
                </SimpleGrid>
              </div>
            </Container>
          </section>
          <Divider my={80} w={200} />
          <Container id="features">
            <Title order={2} ta={"center"} size={36} mb="lg">
              Why choose NextCTF?
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
              <FeatureCard
                icon={<IconShield size={32} />}
                color="cyan"
                title="Various challenges"
                description="NextCTF offers a wide range of challenges across multiple categories, including   web security, cryptography, reverse engineering, and more."
              />
              <FeatureCard
                icon={<IconAward size={32} />}
                color="orange"
                title="Competitions"
                description="Participate in regular CTF competitions hosted on the platform to test your skills against others, climb the leaderboard, and win prizes!"
              />
              <FeatureCard
                icon={<IconBrain size={32} />}
                color="grape"
                title="AI-Powered assistant"
                description="Get help from Luigi! He provides hints, explanations, and guidance on solving challenges, making it easier for beginners to learn and improve their skills."
              />
              <FeatureCard
                icon={<IconUserCode size={32} />}
                color="blue"
                title="Skill progression"
                description="Track your progress over time with statistics and performance metrics, helping you identify areas for improvement."
              />
              <FeatureCard
                icon={<IconRocket size={32} />}
                color="teal"
                title="Dynamic scoring"
                description="Earn more points for solving harder challenges that fewer people have solved, making it more rewarding to tackle difficult problems."
              />
              <FeatureCard
                icon={<IconBook size={32} />}
                color="red"
                title="Learning resources"
                description="Access a variety of learning materials, tutorials, and guides to help you improve your cybersecurity skills."
              />
            </SimpleGrid>
          </Container>
          <Divider my={80} w={200} />
          <Container
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              marginBottom: 80,
            }}
          >
            <Text style={{ fontSize: 40 }}>
              We know it&apos;s tough, but with NextCTF, we&apos;ve made it
              simple and fun!
            </Text>
            <Image
              src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/e4a06e09270ddc83e06c3471a97c8701f7466efe_laptop_work.svg"
              alt="laptop working"
              width={600}
              height={400}
            />
          </Container>
          <Divider my={80} w={200} />
          <Container
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              marginBottom: 80,
              backgroundColor: "#15aabf",
              color:
                "light-dark(var(--mantine-color-dark-0), var(--mantine-color-dark-7))",
              borderRadius: "16",
              padding: 40,
            }}
          >
            <Title order={3} style={{ fontSize: "2rem" }}>
              🤠 So, what are you waiting for? Join us and start today!
            </Title>
            <Text style={{ fontSize: "1.2rem" }}>
              It would be our pleasure to have you on board! We are still in
              beta, so if you have any feedback, please let us know! We are
              always looking for ways to improve our platform and make it better
              for you.
              <Link color="dark" href="/auth">
                <Button color="cyan" style={{ marginTop: 20 }}>
                  Sign up now, it&apos;s free!
                </Button>
              </Link>
            </Text>
          </Container>
        </div>
      ) : (
        <Container size="md">
          <Title order={2}>
            Welcome back,{" "}
            {user?.user_metadata.full_name || user?.user_metadata.username}!
          </Title>
          <Container p="0" size="md" py="md">
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
              <Paper p="xl" radius="md" withBorder>
                <ThemeIcon
                  size={48}
                  radius="md"
                  color="grape"
                  variant="light"
                  mb="md"
                >
                  <IconBrain size={24} />
                </ThemeIcon>
                <Text c="dimmed" fz="sm" fw={500} mb="xs">
                  Solved challenges
                </Text>
                <Group
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text fz="2.5rem" fw={700}>
                    {statsLoading ? "-" : stats?.solvedChallenges || 0}
                  </Text>
                  <Button
                    variant="light"
                    color="grape"
                    size="sm"
                    component={Link}
                    href="/challenges"
                  >
                    View all
                  </Button>
                </Group>
              </Paper>

              <Paper p="xl" radius="md" withBorder>
                <ThemeIcon
                  size={48}
                  radius="md"
                  color="blue"
                  variant="light"
                  mb="md"
                >
                  <IconShield size={24} />
                </ThemeIcon>
                <Text c="dimmed" fz="sm" fw={500} mb="xs">
                  Not completed challenges
                </Text>
                <Group
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text fz="2.5rem" fw={700}>
                    {statsLoading ? "-" : stats?.triedChallenges || 0}
                  </Text>
                  <Badge size="lg" color="blue" variant="light">
                    {statsLoading
                      ? "-"
                      : stats?.solvedChallenges && stats?.triedChallenges
                      ? Math.round(
                          (stats?.solvedChallenges /
                            (stats?.solvedChallenges +
                              stats?.triedChallenges)) *
                            100
                        )
                      : 0}
                    %
                  </Badge>
                </Group>
              </Paper>

              <Paper p="xl" radius="md" withBorder>
                <ThemeIcon
                  size={48}
                  radius="md"
                  color="teal"
                  variant="light"
                  mb="md"
                >
                  <IconAward size={24} />
                </ThemeIcon>
                <Text c="dimmed" fz="sm" fw={500} mb="xs">
                  Accuracy
                </Text>
                <Group
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text fz="2.5rem" fw={700}>
                    {statsLoading ? "-" : stats?.accuracy || 0}%
                  </Text>
                  <Box
                    style={{
                      width: 80,
                      height: 8,
                      backgroundColor: "var(--mantine-color-gray-2)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      style={{
                        width: `${statsLoading ? 0 : stats?.accuracy || 0}%`,
                        height: "100%",
                        backgroundColor: "var(--mantine-color-teal-6)",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </Box>
                </Group>
              </Paper>
            </SimpleGrid>
          </Container>
          {lastTriedChallenge && (
            <Paper withBorder p="xl" radius="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Group mb="sm">
                <ThemeIcon size={32} radius="md" color="blue" variant="light">
                  <IconRocket size={18} />
                </ThemeIcon>
                <Text fw={600} size="lg">Continue where you left off: {<Link style={{ color: 'white', cursor: 'pointer' }} href={`/challenge/${lastTriedChallenge.id}`}>{lastTriedChallenge.title}</Link>}</Text>
              </Group>
              <Button component={Link} href={`/challenges/${lastTriedChallenge.id}`} rightSection={<IconArrowRight size={16} />}>
                Continue challenge
              </Button>
            </Paper>
          )}

          {!lastTriedChallenge && !loadingLastTriedChallenge && (
            <Paper withBorder p="xl" radius="md" mb={"xl"}>
              <Group mb="lg">
                <ThemeIcon size={32} radius={"md"} variant="light">
                  <IconRocket size={18} />
                </ThemeIcon>
                <Text fw={600} size="lg">Ready to start?</Text>
              </Group>
              <Text c="dimmed" mb="md">
                You haven&apos;t started any challenges yet. Explore challenges!
              </Text>

              <Button
                component={Link}
                href={"/challenges"}
                variant="light"
                rightSection={<IconArrowRight size={16} />}
              >
                Browse challenges             
              </Button>

            </Paper>
          )}

        </Container>
      )}
    </div>
  );
}
