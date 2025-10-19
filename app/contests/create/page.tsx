'use client';

import Loading from "@/app/components/ui/Loading";
import useUser from "@/app/utils/queries/user/useUser";
import { Error } from "@/app/components/ui/Error";
import { Container, TextInput, Title, Textarea, MultiSelect, Group, Text, NumberInput, Button } from "@mantine/core";
import useChallenges from "@/app/utils/queries/challenges/getChallenges";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates"
import '@mantine/dates/styles.css';
import { createClient } from "@/app/utils/supabase/client";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function CreateContest() {
    const {user, loading, error} = useUser();
    const { challenges } = useChallenges({ method: "private"});
    const [challengesPoints, setChallengesPoints] = useState<Record<string, number>>({})
    const router = useRouter();

    const form = useForm({
        initialValues: {
            title: "",
            description: "",
            start_date: null as Date | null,
            end_date: null as Date | null,
            challenges: [] as string[],
            rules: '',
            key: crypto.randomUUID(),
            banner: ''
        }
    })

    const handleSubmit = async (values: typeof form.values) => {
        const supabase = createClient();
        const { data: contest, error: contestError } = await supabase.from('contests').insert([{
            title: values.title,
            description: values.description,
            start_time: values.start_date,
            end_time: values.end_date,
            created_by: user?.id,
            key: values.key,
            rules: values.rules,
            banner: values.banner,
            participants: [user?.id]
        }]).select().single();
        if(contestError) {
            notifications.show({
                title: 'Error',
                message: contestError.message,
                color: 'red'
            })
            return ;
        }
        const contestId = contest?.id
        if(!contestId) {
            notifications.show({
                title: 'Error',
                message: 'Contest not created, smh',
                color: 'red'
            })
            return ;
        }
        const challengeInserts = values.challenges.map((challengeId) => ({
            contest_id: contestId,
            challenge_id: challengeId,
            max_points: challengesPoints[challengeId] || 500,
            points: challengesPoints[challengeId] || 500
        }))
        const { error: contestChallangesError } = await supabase.from('contests_challenges').insert(challengeInserts)
        if(contestChallangesError) {
            notifications.show({
                title: 'Error',
                message: contestChallangesError.message,
                color: 'red'
            })
            return;
        }

        notifications.show({
            title: 'Success',
            message: 'Contest created successfully!',
            color: 'green'
        })

        router.push('/contests')

    }

    if(loading) return <Loading />
    if(error) return <Error number={500} />
    if(!user) return <Error number={401} />;
    if(!user.user_metadata?.admin) return <Error number={403} />;

    return (
       <Container>
        <Title fw={700} fs={"lg"} my="lg">Create contest</Title>
        <Text c="dimmed" my="sm">
            The key is {form.values.key}. This what users will use to join the contest.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
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
                rows={7}
            />
            <Textarea
                label="Rules"
                {...form.getInputProps('rules')}
                required
                mb="md"
                rows={4}
            />
            <TextInput
                label="Banner URL"
                {...form.getInputProps('banner')}
                required
                mb="md"
            />
            <Text c="dimmed" fz="sm">
                The start and end date must be in UTC timezone!
            </Text>
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

            {form.values.challenges.length > 0 && (
                <div>
                    <Title order={4} mb="sm">Set challenge points</Title>
                    {form.values.challenges.map((challengeId) => {
                        const challenge = challenges.find((c) => c.id === challengeId)
                        return (
                            <NumberInput
                                key={challengeId}
                                label={challenge?.title || challengeId}
                                value={challengesPoints[challengeId] || ''}
                                onChange={(value) => {
                                    setChallengesPoints((prev) => ({
                                        ...prev,
                                        [challengeId]: typeof value === 'number' && !isNaN(value) ? value : 0
                                    }))
                                }}
                            />
                        )
                    })}
                </div>
            )}

            <Button type="submit" mt="md">
                Create contest
            </Button>

        </form>
       </Container>
    )
}