'use client'

import { Badge, Container, Table, Title, Text, Card, Group, Pagination } from "@mantine/core"
import { useLeaderboard } from "../utils/queries/leaderboard/getLeaderboard";
import Loading from "../components/ui/Loading";
import { Error } from "../components/ui/Error"; 
import { useState } from "react";


function Leaderboard() {

    const { leaderboard, loading, error } = useLeaderboard();
    const [activePage, setActivePage] = useState<number>(1);
    const usersPerPage = 10;
    if (loading) return <Loading />;
    if (error) return <Error number={500} />;

    const getRankColor = (rank: number) => {
        if(rank === 0) return 'yellow';
        if(rank === 1) return 'gray';
        if(rank === 2) return 'orange';
        return 'transparent';
    }

    const totalPages = Math.max(1, Math.ceil(leaderboard.length / usersPerPage));
    const currentPage = activePage > totalPages ? totalPages : activePage;

    const paginatedUsers = leaderboard.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    )

    const startIndex = (currentPage - 1) * usersPerPage;

    const rows = paginatedUsers.map((user, index) => {

      const realRank = startIndex + index;

      return (
          <Table.Tr key={user.id}>
            <Table.Td
                style={{ width: '60px', textAlign: 'center'}}
            >
                <Badge
                    color={getRankColor(realRank)}
                    variant={realRank < 3 ? 'filled': 'outline'}
                    size="md"
                >
                    {realRank + 1}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text fw={realRank < 3 ? 600 : 400} size="md">
                    {user.username}
                </Text>
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                <Text size="md" fw={500} c={realRank < 3 ? 'blue' : 'dimmed'}>
                    {user.points}
                </Text>
            </Table.Td>
            
        </Table.Tr>
      )
    });

    return (
      <Container size={"md"} py="xl">
        <Card withBorder shadow="sm" radius={"sm"} p={0}>
          <Group p="md" pb="xs" justify="space-between" style={{ borderBottom: '1px solid var(--mantine-color-gray-8)'}}>
            <Title order={2} style={{margin: 0}}>
                Leaderboard
            </Title>
            <Badge size="md" variant="light">
                Top {leaderboard.length} users
            </Badge>
          </Group>
          <Table withColumnBorders striped horizontalSpacing={"lg"} verticalSpacing={"md"} highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: "60px", textAlign: "center" }}>
                  Rank
                </Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Points</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0'}}>
            {totalPages > 1 && (
              <Group p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-8)' }}>
                <Text size="sm" c="dimmed">
                  Showing {startIndex + 1}-{startIndex + paginatedUsers.length} of {leaderboard.length} users
                </Text>
                <div style={{ marginLeft: 'auto' }}>
                  <Pagination
                    total={totalPages}
                    value={currentPage}
                    onChange={setActivePage}
                    withEdges
                    size={"sm"}
                  />
                </div>
              </Group>
            )}
          </div>
        </Card>
      </Container>
    );
}

export default Leaderboard;