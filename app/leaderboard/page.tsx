'use client'

import { Container, Table } from "@mantine/core"
import { useEffect, useState } from "react";
import { getLearderboard } from "../utils/queries/leaderboard/getLeaderboard";


function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    useEffect(() => {
        const fetchLeaderboard = async () => {
            const data = await getLearderboard();
            setLeaderboardData(data);
        };
        fetchLeaderboard();
    }, [])

    console.log(leaderboardData);

    const rows = leaderboardData.map((user, index) => (
        <Table.Tr key={index}>
            <Table.Td>
                {user.username}
            </Table.Td>
            <Table.Td>
                {user.points}
            </Table.Td>
            
        </Table.Tr>
    ))

    return (
        <Container>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>
                            Username
                        </Table.Th>
                        <Table.Th>
                            Points
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows}
                </Table.Tbody>
            </Table>
        </Container>
    )
}

export default Leaderboard;