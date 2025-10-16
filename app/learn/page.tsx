'use client';

import { Container, Grid } from "@mantine/core";
import { Button, Text } from "@mantine/core";
import useUser from "../utils/queries/user/useUser";
import Loading from "../components/ui/Loading";
import { Error } from "../components/ui/Error";
import Link from "next/link";

function Learn() {
  const { user, loading, error } = useUser();

  if (loading) return <Loading />;
  if (error) return <Error number={500} />
  return (
    <Container>
      <Grid justify="space-between" align="center" mb="md">
        <Text size="xl" fw={700} my="md">Learn</Text>
        {user?.user_metadata?.admin && (
          <Button variant="light" component={Link} href={"/learn/add-topic"} color="cyan">Add topic</Button>
        )}
      </Grid>
    </Container>
  )
}

export default Learn;
