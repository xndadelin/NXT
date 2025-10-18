'use client';

import { Container, Grid, SimpleGrid, Group, Card, Badge, Text, Button } from "@mantine/core";
import useUser from "../utils/queries/user/useUser";
import Loading from "../components/ui/Loading";
import { Error } from "../components/ui/Error";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; 
import { useEffect, useState } from "react";


interface Topic {
  id: string;
  title: string;
  short_description: string;
  created_at: string;
  published: boolean;
}

function Learn() {
  const { user, loading: userLoading, error: userError } = useUser();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const supabase = createClientComponentClient();
        const isAdmin = user?.user_metadata?.admin === true;

        let query = supabase.from('topics').select('*').order('created_at', { ascending: false });

        if (!isAdmin) {
          query = query.eq('published', true);
        }

        const { data, error } = await query;

        if (error) {
          setError(error.message);
          return ;
        }
        setTopics(data || []);
      } catch (err) {
          setError(err as string);
        } finally {
          setLoading(false);
        }
    }
    if(!userLoading) {
      fetchTopics();
    }
  }, [user, userLoading])


  if (userLoading || loading) return <Loading />;
  if (userError || error) return <Error number={500} />

  return (
    <Container>
      <Grid justify="space-between" align="center" mb="md">
       <Grid.Col span={"content"}>
         <Text size="xl" fw={700} my="md">Learn</Text>
       </Grid.Col>
        {user?.user_metadata?.admin && (
          <Grid.Col span={"content"}>
            <Button variant="light" component={Link} href="/learn/add-topic">
              Add topic
            </Button>
          </Grid.Col>
        )}
      </Grid>

        <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 2 }} spacing={"md"}>
          {topics.map((topic) => (
            <Card key={topic.id} withBorder radius="md" shadow="sm">
              <Group justify="space-between" mb='xs'>
                <Text fw={700} size="lg">{topic.title}</Text>
                {user?.user_metadata?.admin && (
                  <Badge color={topic.published ? 'green' : 'red'}>
                    {topic.published ? 'Published' : 'Unpublished'}
                  </Badge>
                )}
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                {new Date(topic.created_at).toLocaleDateString()}
              </Text>
              <Text size="sm" lineClamp={3} mb="md">
                {topic.short_description}
              </Text>
              <Group justify="space-between" mt="md">
                <Button
                  variant="light"
                  component={Link}
                  href={`/learn/topic/${topic.id}`}
                >
                  Start learning
                </Button>

                {user?.user_metadata?.admin && (
                  <Group gap="xs">
                    <Button
                      component={Link}
                      href={`/learn/edit-topic/${topic.id}`}
                    >
                      Edit
                    </Button>

                     {!topic.published && (
                      <Button
                        variant="subtle"
                        color="green"
                        size="xs"
                        onClick={async () => {
                          try {
                            const supabase = createClientComponentClient();
                            await supabase.from('topics').update({ published: true }).eq('id', topic.id);

                            setTopics(topics.map(t => t.id === topic.id ? {...t, published: true} : t))
                          } catch (error) {
                            alert(error)
                          }
                        }}
                      >
                        Publish
                      </Button>
                    )}

                  </Group>
                )}
              </Group>
            </Card>
          ))}
        </SimpleGrid>
    </Container>
  )
}

export default Learn;
