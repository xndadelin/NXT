'use client';

import { Container, Button, Table } from "@mantine/core";
import Link from "next/link";
import useChallenges from "../utils/queries/challenges/getChallenges";
import { Error } from "../components/ui/Error";

function Challenges() {

    const { challenges, loading, error } = useChallenges();

    if (loading) return null;
    if (error) return <Error number={500} />;
    if (!challenges) return <Error number={505} />;

    return (
        <Container style={{ display: 'flex' }}>
            <Button style={{ marginLeft: 'auto' }} component={Link} href={"/challenges/create"} my="md">
                Create challenge
            </Button>
            
        </Container>
    )
}

export default Challenges;