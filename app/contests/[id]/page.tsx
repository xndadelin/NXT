'use client';

import { Error } from "@/app/components/ui/Error";
import Loading from "@/app/components/ui/Loading";
import useContest from "@/app/utils/queries/contests/useContest";
import { useParams } from "next/navigation";
import { Container, Card, Image, Title, Text, Divider} from "@mantine/core";
import MDEditor from "@uiw/react-md-editor";

export default function ContestPage() {
    const params = useParams();
    const { contest, loading, error } = useContest({ contestId: params.id as string})
    
    if(loading) return <Loading />;
    if(error) return <Error number={500} />
    if(!contest) return <Error number={404} />
    
    return (
        <Container>
            {contest.banner && (
                <Card shadow="sm" radius="md" withBorder p={0}>
                    <Card.Section>
                        <Image src={contest.banner} alt={contest.title} height={200} fit="cover" />
                    </Card.Section>
                </Card>
            )}
            <Text fw={500} fz={50} mb="xs">{contest.title}</Text>
            <MDEditor.Markdown source={contest.description} />
            <Title order={3} mt="lg" mb="md">Rules</Title>
            <MDEditor.Markdown source={contest.rules} />
            <Divider mb="40px" mt="20px" />
        </Container>
    )

}