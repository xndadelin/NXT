"use client";

import {
  Container,
  Table,
  Title,
  Text,
  Card,
  Group,
  Pagination,
  Box,
} from "@mantine/core";
import { useLeaderboard } from "../utils/queries/leaderboard/getLeaderboard";
import Loading from "../components/ui/Loading";
import { Error } from "../components/ui/Error";
import { useState } from "react";
import { useRecentActivity } from "../utils/queries/leaderboard/useRecentActivity";
import Link from "next/link";

function Leaderboard() {
  const { leaderboard, loading, error } = useLeaderboard();
  const [activePage, setActivePage] = useState<number>(1);
  const usersPerPage = 10;
  const { recent, loading: recentLoading } = useRecentActivity();

  if (loading) return <Loading />;
  if (error) return <Error number={500} />;

  const totalPages = Math.max(1, Math.ceil(leaderboard.length / usersPerPage));
  const currentPage = activePage > totalPages ? totalPages : activePage;

  const paginatedUsers = leaderboard.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const startIndex = (currentPage - 1) * usersPerPage;

  const rows = paginatedUsers.map((user, index) => {
    const realRank = startIndex + index;
    const isTopThree = realRank < 3;

    return (
      <Table.Tr key={user.id} style={{ height: "56px" }}>
        <Table.Td style={{ width: "60px" }}>
          <Box
            style={{
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              background: isTopThree
                ? getRankBackground(realRank)
                : "transparent",
              color: isTopThree ? "white" : "inherit",
              margin: "0 auto",
            }}
          >
            {realRank + 1}
          </Box>
        </Table.Td>
        <Table.Td>
          <Text fw={isTopThree ? 600 : 400} size="md">
            {user.username}
          </Text>
        </Table.Td>
        <Table.Td style={{ textAlign: "right", width: "100px" }}>
          <Text
            fw={500}
            size="md"
            c={isTopThree ? getRankColor(realRank) : "dimmed"}
          >
            {user.points}
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  function getRankColor(rank: number) {
    if (rank === 0) return "yellow.7";
    if (rank === 1) return "gray.7";
    if (rank === 2) return "orange.7";
    return "blue";
  }

  function getRankBackground(rank: number) {
    if (rank === 0) return "linear-gradient(45deg, #FFD700, #FFC107)";
    if (rank === 1) return "linear-gradient(45deg, #C0C0C0, #9E9E9E)";
    if (rank === 2) return "linear-gradient(45deg, #CD7F32, #BF360C)";
    return "transparent";
  }

  return (
    <Container size="md">
      <Title order={2} mb="md">
        Leaderboard
      </Title>

      <Card withBorder shadow="sm" my="md" padding={0}>
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: "60px", textAlign: "center" }}>
                Rank
              </Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th style={{ textAlign: "right", width: "100px" }}>
                Points
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        {totalPages > 1 && (
          <Box
            py="md"
            px="lg"
            style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
          >
            <Group justify="space-between" align="center">
              <Text size="sm" c="dimmed">
                Showing {startIndex + 1}-
                {Math.min(startIndex + usersPerPage, leaderboard.length)} of{" "}
                {leaderboard.length}
              </Text>
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={setActivePage}
                size="sm"
                withEdges
              />
            </Group>
          </Box>
        )}
      </Card>
      <Title order={3} mt="xl" mb="xs" style={{
        maxHeight: '500px', overflowy: 'auto'
      }}>
        Live activity (last 24 hours)
      </Title>
      <Group dir="column" gap={0} style={{
        overflow: 'hidden'
      }} >
        {recent.map((sub) => (
          <Card
            key={sub.user_id + sub.updated_at.toString()}
            style={{
              backgroundColor: '#1b4332',
              color: '#d8f3dc',
              borderRadius: 0,
              borderBottom: '1px solid #2d6a4f',
              transition: 'background-color 0.3s ease',
              width: '100%'
            }}
            p={"sm"}
            withBorder={false}
            onMouseEnter={(e) => (
              e.currentTarget.style.backgroundColor = '#2d6a4f'
            )}
            onMouseLeave={(e) => (
              e.currentTarget.style.backgroundColor = '#1b4332'
            )}
          >
            <Group justify="space-between" gap={0} style={{
              width: '100%'
            }}> 
              <Text fw={600} style={{
                width: '100%'
              }}>
                {sub.users?.username} completed the challenge <Link style={{
                  color: '#95d5b2', textDecoration: 'none'
                }} href={`/challenges/${sub.challenges?.id}`}>{sub.challenges?.title}</Link> worth {sub.challenges?.points} points!
              </Text>
            </Group>
          </Card>
        ))}
      </Group>
    </Container>
  );
}

export default Leaderboard;
