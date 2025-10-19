'use client'

import { Container, Group, Text, Button, Title, Grid, Card, Image, Box} from "@mantine/core";
import Link from "next/link";
import useContests from "../utils/queries/contests/useContests";
import useUser from "../utils/queries/user/useUser";
import Loading from "../components/ui/Loading";

export default function ContestsPage() {
    const {contests, loading, error} = useContests();
    const {user, loading: userLoading, error: userError} = useUser();

    if(loading || userLoading) return <Loading />

    const onHandleClickContest = (contestId: string) => {


    }

    return (
        <Container>
            <Group align="center" justify="space-between" my="md">
                <Text fz="xl" fw={700}>Contests</Text>
                <Button component={Link} href={"/contests/create"}>Create contest</Button>
            </Group>
            {contests.length === 0 && (
                <Text>No contests available.</Text>
            )}
            <Grid mt="md" gutter="md" my="lg" mx="sm">
                {contests.map((contest) => (
                    <Card 
                        key={contest.id} 
                        shadow="sm" 
                        style={{ cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(.4,2,.3,1)' }}
                        radius="md" 
                        withBorder 
                        p={0}
                        onMouseEnter={e => {
                            (e.currentTarget as unknown as HTMLDivElement).style.transform = 'scale(1.03)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as unknown as HTMLDivElement).style.transform = 'scale(1.00)';
                        }}
                        component={Link}
                        href={`/contests/${contest.id}`}
                    >
                        {contest.banner && (
                            <Image 
                                src={contest.banner}
                                alt={contest.title}
                                height={140}
                                radius="0"
                                
                            />
                        )}
                        <Box p="lg">
                            <Title order={4} mb="xs" fw={700}>{contest.title}</Title>
                            <Text c="dimmed" size="sm" mb="xs" lineClamp={2}>{contest.description}</Text>
                            <Text size="xs" c="gray">
                                {new Date(contest.start_time).toUTCString()} - {new Date(contest.end_time).toUTCString()}
                            </Text>
                        </Box>
                    </Card>
                ))}
            </Grid>
        </Container>
    )
}