'use client';

import Loading from "@/app/components/ui/Loading";
import useUser from "@/app/utils/queries/user/useUser";
import { Error } from "@/app/components/ui/Error";
import { Container, TextInput, Title, Textarea, MultiSelect, Group } from "@mantine/core";
import useChallenges from "@/app/utils/queries/challenges/getChallenges";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates"

export default function CreateContest() {
    const {user, loading, error} = useUser();
    const { challenges } = useChallenges({ method: "private"});
    const [submitting, setSubmitting] = useState<boolean>(false);

    const form = useForm({
        initialValues: {
            title: "",
            description: "",
            start_date: "",
            end_date: "",
            challenges: [] as string[],
        }
    })

    if(loading) return <Loading />
    if(error) return <Error number={500} />
    if(!user) return <Error number={401} />;
    if(!user.user_metadata?.admin) return <Error number={403} />;

    return (
       <Container>
        <Title fw={700} fs={"lg"} my="lg">Create contest</Title>
        <form>
            <TextInput
                label="Title"
                required
                {...form.getInputProps('title')}
                mb="md"
            />
            <Textarea 
                label="Description" 
                {...form.getInputProps('description')}
                required
                mb="md"
            />
            <Group grow >
                <DateTimePicker
                    label="Start date"
                    required
                    {...form.getInputProps('start_date')}
                    mb='md'
                />
                <DateTimePicker
                    label="End date"
                    required
                    {...form.getInputProps('end_date')}
                    mb="md"
                    style={{ width: '100%'}}
                />
            </Group>
            <MultiSelect
                label="Challenges"
                data={challenges.map((challenges) => {
                    return {value: challenges.id, label: challenges.title}
                })}
                {...form.getInputProps('challenges')}

                mb="md"
            />
        </form>
       </Container>
    )
}