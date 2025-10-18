import { Container, Group, Text, Button, Title } from "@mantine/core";
import Link from "next/link";

export default function ContestsPage() {
    return (
        <Container>
            <Group align="center" justify="space-between" my="md">
                <Text fz="xl" fw={700}>Contests</Text>
                <Button component={Link} href={"/contests/create"}>Create contest</Button>
            </Group>
        </Container>
    )
}