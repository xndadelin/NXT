'use client'

import useChallenges from "@/app/utils/queries/challenges/getChallenges";
import { useForm } from "@mantine/form";
import {
    TextInput, 
    Button,
    Select,
    Container,
    Title
} from "@mantine/core"
import MDEditor from "@uiw/react-md-editor";
import { FormEvent, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import useUser from "@/app/utils/queries/user/useUser";
import { notifications } from "@mantine/notifications";
import { useParams } from "next/navigation";
import useWriteup from "@/app/utils/queries/writeups/useWriteup";
import Loading from "@/app/components/ui/Loading";
import { Error } from "@/app/components/ui/Error";
import { useRouter } from "next/navigation";

export interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  points: number;
  created_at: string;
}


export default function EditWriteup() {
    const { challenges } = useChallenges();
    const { user, loading, error } = useUser();
    const { id } = useParams();
    const { writeup, loading: writeupLoading, error: writeupError} = useWriteup(id as string, 'edit');
    const router = useRouter();

    useEffect(() => {
        if(writeup) {
            form.setValues({
                title: writeup.title,
                challengeId: writeup.challenge_id,
                contentMarkdown: writeup.content_markdown,
                shortDescription: writeup.short_description
            })
        }
    }, [writeup])

    const form = useForm({
        initialValues: {
            title: '',
            challengeId: '',
            contentMarkdown: '',
            shortDescription: ''
        }
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const supabase = createClient();

        const { error } =  await supabase.from('writeups').upsert({
            title: form.values.title,
            challenge_id: form.values.challengeId,
            content_markdown: form.values.contentMarkdown,
            short_description: form.values.shortDescription,
            author_id: user?.id,
            published: true
        }, { onConflict: 'id'})

        if(error) {
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red'
            })
            return;
        } 

        notifications.show({
            title: 'Success',
            message: 'Writeup submitted successfully',
            color: 'green'
        })

        router.push(`/writeups/${id}`)        
    }

    if(loading || writeupLoading) return <Loading />;
    if(error || writeupError) return <Error number={500} />
    if(!user) return <Error number={401} />;
    if(writeup === null) return <Error number={404} />;

    return (
        <Container pt="xl">
            <Title mb="lg">Edit writeup</Title>
            <form onSubmit={handleSubmit}> 
                <TextInput
                    label="Title"
                    required
                    {...form.getInputProps('title')}
                    mb="md"
                />
                <TextInput
                    label="Short description"
                    {...form.getInputProps('shortDescription')}
                    mb="md"
                />
                <Select
                    label="Challenge"
                    data={challenges?.map((challenge : Challenge) => ({
                        value: challenge.id,
                        label: challenge.title
                    })) || []}
                    {...form.getInputProps('challengeId')}
                    mb="md"
                />
                <label style={{ color: "var(--mantine-color-white-6)" }}>Content</label>
                <MDEditor
                    value={form.values.contentMarkdown}
                    onChange={(value) => form.setFieldValue("contentMarkdown", value || '')}
                    style={{ background: "var(--mantine-color-dark-8)", marginTop: "0.5rem" }}
                />
                <Button type="submit" mt="lg">Submit</Button>
            </form>
        </Container>
    )

}