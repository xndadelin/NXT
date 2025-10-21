'use client';

import { Container, Title, Anchor, Text, Stack, Box, Divider } from "@mantine/core";
import useWriteups from "../utils/queries/writeups/useWriteups";
import Loading from "../components/ui/Loading";
import { Error } from "../components/ui/Error";

interface Writeup {
    id: string;
    title: string;
    short_description: string;
    challenge_id: string;
    created_at: string;
    challenges : {title : string } | null; 
}

export default function Writeups() {
    const { writeups, loading, error } = useWriteups();

    if(loading) return <Loading />;
    if(error) return <Error number={500} />
    if(!writeups.length) return (
        <Container pt="xl">
            <Title mb={24}>Writeups</Title> 
        </Container>
    )
    return (
        <Container pt="xl">
            <Title mb={32} fw={700} fz={36}>Writeups</Title>
            <Stack gap="md">
                {writeups.map((writeup: Writeup, index: number) => (
                    <Box key={writeup.id} mb={index === writeups.length - 1 ? 0 : 32}>
                        <Anchor 
                            href={`/writeups/${writeup.id}`}
                            fz={22}
                            fw={600}
                            style={{ color: 'var(--mantine-color-blue-4)' }}
                        >
                            {writeup.title}
                        </Anchor>
                        <Text c="dimmer" size="sm" mb={2} mt={4}>
                            {writeup.short_description}
                        </Text>
                        <Text size="xs" c="gray">
                            Challenge: <b>{writeup.challenges?.title}</b> · {new Date(writeup.created_at).toLocaleDateString()}
                        </Text>
                        {index !== writeups.length - 1 && <Divider my={12} />}
                    </Box>
                ))}
            </Stack>
        </Container>
    )
}