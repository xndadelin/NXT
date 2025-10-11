import { Container, Button } from "@mantine/core";
import Link from "next/link";

function Challenges() {
    return (
        <Container style={{ display: 'flex' }}>
            <Button style={{ marginLeft: 'auto' }} component={Link} href={"/challenges/create"} my="md">
                Create challenge
            </Button>
        </Container>
    )
}

export default Challenges;