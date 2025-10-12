'use client'

import { Container, Table } from "@mantine/core"
import { useLeaderboard } from "../utils/queries/leaderboard/getLeaderboard";


function Leaderboard() {

    const { leaderboard, loading, error } = useLeaderboard();

    const rows = leaderboard.map((user, index) => (
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