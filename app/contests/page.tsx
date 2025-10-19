'use client'

import { Container, Group, Text, Button, Title, Grid, Card, Image, Box, Modal, TextInput} from "@mantine/core";
import Link from "next/link";
import useContests from "../utils/queries/contests/useContests";
import useUser from "../utils/queries/user/useUser";
import Loading from "../components/ui/Loading";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { Error } from "../components/ui/Error";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export default function ContestsPage() {
    const {contests, loading, error, userIsParticipating, verifyKey} = useContests();
    const {user, loading: userLoading, error: userError} = useUser();
    const router = useRouter(); 
    const [opened, { open, close }] = useDisclosure(false);
    const [openedContestId, setOpenedContestId] = useState<string | null>(null)

    if(loading || userLoading) return <Loading />
    if(error || userError) return <Error number={500} />


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
                            (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.00)';
                        }}
                        onClick={() => {
                            if(!user) {
                                notifications.show({
                                    title: 'Unauthorized',
                                    message: 'You must be logged in to view/join a contest.',
                                    color: 'red'
                                });
                            }
                            else {
                                if(contest.participants && contest.participants.includes(user.id)) {
                                    router.push(`/contests/${contest.id}`)
                                } else {
                                    setOpenedContestId(contest.id)
                                    open();
                                }
                            }
                        }}
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
            <Modal opened={opened} onClose={close} title="Join contest">
                <Text mb="md">
                    Hello! You must enter a key to join/view this contest!
                </Text>
                <TextInput
                    placeholder="Enter contest key"
                    label="Contest key"
                    required
                    mt="sm"
                />
                <Button
                    mt="md"
                    fullWidth
                    onClick={async () => {
                        const isValid = await verifyKey(openedContestId as string, (document.querySelector('input[placeholder="Enter contest key"]') as HTMLInputElement).value)
                        if(isValid) {
                            close();
                            notifications.show({
                                title: 'Success',
                                message: 'You have joined the contest successfully!',
                                color: 'green'
                            })
                            router.push('/contests/' + openedContestId)
                        } else {
                            notifications.show({
                                title: 'Error',
                                message: 'Invalid contest key. Please try again.',
                                color: 'red'
                            })
                        }
                    }}
                    disabled={!openedContestId}
                >
                    Join contest
                </Button>
            </Modal>
        </Container>
    )
}