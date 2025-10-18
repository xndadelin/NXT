'use client';

import { Container, Title, Text } from "@mantine/core";
import useWriteup from "@/app/utils/queries/writeups/useWriteup";
import { useParams } from "next/navigation";
import Loading from "@/app/components/ui/Loading";
import { Error } from "@/app/components/ui/Error";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";

export default function Writeup() {
    const { id } = useParams();
    const { writeup, loading, error } = useWriteup(id as string, 'view');
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
      const getUserUsername = async (authorId: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", authorId)
          .maybeSingle();

        if (error || !data) {
          setUsername('a gracious hacker!')
        }
        setUsername(data?.username);
      };

      if(writeup && typeof writeup.author_id === 'string') {
        getUserUsername(writeup.author_id)
      }

    }, [writeup?.author_id]);

    if(loading) return <Loading />;
    if(error) return <Error number={500} />
    if(!writeup) return <Error number={404} />;

    return (
        <Container>
            <Title>
                {writeup.title}
            </Title>
            <Text component={Link} href={`/users/${writeup.author_id}`} c="dimmed" fz="sm" mb="md">
                By @{username}
            </Text>
            <div className="markdown-body" style={{ marginTop: '1rem' }}>
                <MDEditor.Markdown source={writeup.content_markdown} />
            </div>
            <div style={{ height: "4rem" }}></div>
        </Container>
    )
}