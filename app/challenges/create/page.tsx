'use client';

import { Container, Title, TextInput, Select, NumberInput, Checkbox, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import useUser from "@/app/utils/queries/user/useUser";
import { Error } from "@/app/components/ui/Error";
import Loading from "@/app/components/ui/Loading";

function CreateChallenge() {
    const { user, loading, error } = useUser();

    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            difficulty: '',
            category: '',
            flag: '',
            resource: '',
            points: 0,
            mitre: '',
            case_insensitive: false,
        }
    })

    const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Insane'];
    const categoryOptions = ['Web', 'Crypto', 'Forensics', 'Pwn', 'Misc', 'Reversing', 'Stego', 'AI'];
    

    if (loading) return null;
    if (error) return <Error number={500} />;
    if (!user) return <Loading />;
    if (!user?.user_metadata?.admin) return <Loading />;
    

    return (
        <Container>
            <Title order={2} my="md">Create challenge</Title>
            <form onSubmit={form.onSubmit((values) => {
                console.log(values);
            })}>
                <TextInput
                    label="Title"
                    placeholder="Challenge title"
                    required
                    size="md"
                    value={form.values.title}
                    onChange={(e) => form.setFieldValue('title', e.currentTarget.value)}
                />
                
            </form>
        </Container>
    )
}

export default CreateChallenge;