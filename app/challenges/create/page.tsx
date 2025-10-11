'use client';

import { Container, Title, TextInput, Select, NumberInput, Checkbox, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import useUser from "@/app/utils/queries/user/useUser";
import { Error } from "@/app/components/ui/Error";
import Loading from "@/app/components/ui/Loading";
import { notifications } from "@mantine/notifications";
import createChallenge from "@/app/utils/mutations/challenges/createChallenge";
import { useRouter } from "next/navigation";

function CreateChallenge() {
    const { user, loading, error } = useUser();
    const router = useRouter();

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
        },

        validate: {
            title: (value) => (!value ? 'Title is required' : null),
            description: (value) => (!value ? 'Description is required' : null),
            difficulty: (value) => (!value ? 'Difficulty is required': null),
            category: (value) => (!value ? 'Category is required' : null),
            flag: (value) => (!value ? 'Flag is required' : null),
            points: (value) => (value <= 0 ? 'Points must be greater than 0' : null),
        }
    })

    const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Insane'];
    const categoryOptions = ['Web', 'Crypto', 'Forensics', 'Pwn', 'Misc', 'Reversing', 'Stego', 'AI'];

    if (loading) return null;
    if (error) return <Error number={500} />;
    if (!user) return <Loading />;
    if (!user?.user_metadata?.admin) return <Loading />;

    const onSubmit = async(values: typeof form.values) => {
        const hasErrors = form.validate().hasErrors;
        
        if (hasErrors) {
            notifications.show({
                title: 'Error',
                message: error as string || 'Please fix the errors in the form',
                color: 'red'
            })
            return ;
        }

        try {
            const data = await createChallenge(values);
            router.push(`/challenges/${data.id}`)

        } catch (error: any) {
            const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
                ? error.message 
                : String(error);
                
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
        }

    }
    

    return (
        <Container>
            <Title order={2} my="md">Create challenge</Title>
            <form onSubmit={async (e) => {
                e.preventDefault();
                await onSubmit(form.values);
            }}>
                <TextInput
                    label="Title"
                    placeholder="Challenge title"
                    required
                    size="md"
                    value={form.values.title}
                    onChange={(e) => form.setFieldValue('title', e.currentTarget.value)}
                />
                <TextInput
                    label="Description"
                    placeholder="Challenge description"
                    required
                    size="md"
                    value={form.values.description}
                    onChange={(e) => form.setFieldValue('description', e.currentTarget.value)}
                />
                <Select
                    label="Difficulty"
                    placeholder="Select difficulty"
                    required
                    size="md"
                    value={form.values.difficulty}
                    onChange={(e) => form.setFieldValue('difficulty', e || '')}
                    data={difficultyOptions}
                    mt="md"
                />
                <Select
                    label="Category"
                    placeholder="Select category"
                    required
                    size="md"
                    value={form.values.category}
                    onChange={(e) => form.setFieldValue('category', e || '')}
                    data={categoryOptions}
                    mt={"md"}
                />
                <TextInput
                    label="Flag"
                    placeholder="Challenge flag"
                    required
                    size="md"
                    value={form.values.flag}
                    onChange={(e) => form.setFieldValue('flag', e.currentTarget.value)}
                    mt={"md"}
                />
                <TextInput
                    label="Resource"
                    placeholder="Resource link"
                    size="md"
                    value={form.values.resource}
                    onChange={(e) => form.setFieldValue('resource', e.currentTarget.value)}
                    mt="md"
                />
                <TextInput
                    label="MITRE ATT&CK"
                    placeholder="MITRE ATT&CK link"
                    size="md"
                    value={form.values.mitre}
                    onChange={(e) => form.setFieldValue('mitre', e.currentTarget.value)}
                    mt="md"
                />
                <NumberInput
                    label="Points"
                    placeholder="Challenge points"
                    size="md"
                    value={form.values.points}
                    onChange={(e) => form.setFieldValue('points', Number(e) || 500)}
                    mt={"md"}
                />
                <Checkbox
                    label="Case insensitive flag"
                    size="md"
                    checked={form.values.case_insensitive}
                    onChange={(e) => form.setFieldValue('case_insensitive', e.currentTarget.checked)}
                    mt="md"
                />
                <Button type="submit" mt="md" style={{ marginLeft: 'auto' }} >Create challenge</Button>

            </form>
        </Container>
    )
}

export default CreateChallenge;