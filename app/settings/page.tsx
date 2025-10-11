'use client'

import { 
    Container, 
    Input, 
    Text, 
    Button, 
    Title, 
    Paper, 
    Stack, 
    Card, 
    Group, 
    Divider,
    Avatar,
    Flex,
    Tooltip
} from "@mantine/core";
import useUser from "@/app/utils/queries/user/useUser" 
import Loading from "@/app/components/ui/Loading";
import { Error } from "@/app/components/ui/Error";
import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { IconUser, IconMail, IconSettings, IconCheck, IconLock } from "@tabler/icons-react";

export default function SettingsPage() {
    const { user, loading } = useUser();
    const [username, setUsername] = useState('');
    const router = useRouter();
    
    const form = useForm({
        initialValues: {
            username: '',
            email: '',
        }
    });
    
    useEffect(() => {    
        if (user && user.user_metadata && user.user_metadata.username) {
            setUsername(user.user_metadata.username);
            form.setFieldValue('username', user.user_metadata.username);
        }
        
        if (user && user.email) {
            form.setFieldValue('email', user.email);
        }
    }, [user])

    if (loading) return <Loading />;
    if (!user) return <Error number={401} />;

    const onChangeUsername = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!form.values.username.trim()) {
            notifications.show({
                title: 'Error',
                message: 'Username cannot be empty',
                color: 'red'
            });
            return;
        }
        
        const supabase = createClient();

        const { data, error } = await supabase.from('users').update({
            username: form.values.username
        }).eq('id', user.id);

        if (error) {
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red'
            });
            return;
        }
        
        setUsername(form.values.username);
        notifications.show({
            title: 'Success',
            message: 'Username updated successfully!',
            color: 'teal',
            icon: <IconCheck size={16} />,
        });
        window.location.reload();
    }

    const onChangeEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!form.values.email.trim()) {
            notifications.show({
                title: 'Error',
                message: 'Email cannot be empty',
                color: 'red'
            });
            return;
        }
        
        if (form.values.email === user.email) {
            notifications.show({
                title: 'Information',
                message: 'This is already your current email address',
                color: 'blue'
            });
            return;
        }

        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
            email: form.values.email
        });
        
        if (error) {
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red'
            });
            return;
        }
        
        notifications.show({
            title: 'Success',
            message: 'Confirmation email sent to your new email address. Please check your inbox (and spam folder).',
            color: 'teal',
            icon: <IconCheck size={16} />,
        });
    }
    
    return (
        <Container py="xl">
            <Paper radius="md" p="xl" withBorder mb="xl">
                <Group justify="space-between" mb="lg">
                    <Group>
                        <Avatar size="lg" radius="xl" color="cyan" src={user?.user_metadata.avatar_url} />
                        <div>
                            <Title order={3} mb={5}>Hello, {username}</Title>
                            <Text size="sm" c="dimmed">Manage your account settings</Text>
                        </div>
                    </Group>
                    <IconSettings size={24} stroke={1.5} />
                </Group>
                
                <Divider my="md" />
                
                <Stack gap="xl">
                    <Card withBorder shadow="sm" radius="md" padding="xl">
                        <Card.Section withBorder inheritPadding py="xs" mb="md">
                            <Group>
                                <IconUser size={20} stroke={1.5} />
                                <Text fw={500}>Profile information</Text>
                            </Group>
                        </Card.Section>
                        
                        <form onSubmit={onChangeUsername}>
                            <Stack gap="md">
                                <Text size="sm" fw={500} c="dimmed">Username</Text>
                                <Group grow align="center">
                                    <Input
                                        placeholder="Username"
                                        size="md"
                                        value={form.values.username}
                                        onChange={(e) => form.setFieldValue('username', e.currentTarget.value)}
                                        leftSection={<IconUser size={16} />}
                                    />
                                    <Tooltip label="Update username">
                                        <Button 
                                            variant="light" 
                                            color="cyan" 
                                            type="submit"
                                            rightSection={<IconCheck size={14} />}
                                            h={42} 
                                            style={{ alignSelf: 'stretch' }}
                                        >
                                            Update
                                        </Button>
                                    </Tooltip>
                                </Group>
                            </Stack>
                        </form>
                    </Card>
                    
                    <Card withBorder shadow="sm" radius="md" padding="xl">
                        <Card.Section withBorder inheritPadding py="xs" mb="md">
                            <Group>
                                <IconMail size={20} stroke={1.5} />
                                <Text fw={500}>Email settings</Text>
                            </Group>
                        </Card.Section>
                        
                        <form onSubmit={onChangeEmail}>
                            <Stack gap="md">
                                <Text size="sm" fw={500} c="dimmed">Email address</Text>
                                <Group grow align="center">
                                    <Input
                                        placeholder="Email"
                                        size="md"
                                        value={form.values.email}
                                        onChange={(e) => form.setFieldValue('email', e.currentTarget.value)}
                                        leftSection={<IconMail size={16} />}
                                    />
                                    <Tooltip label="Update email">
                                        <Button 
                                            variant="light" 
                                            color="cyan" 
                                            type="submit"
                                            rightSection={<IconCheck size={14} />}
                                            h={42}
                                            style={{ alignSelf: 'stretch' }}
                                        >
                                            Update
                                        </Button>
                                    </Tooltip>
                                </Group>
                                <Text size="xs" c="dimmed" mt={5}>
                                    Changing your email will require confirmation via the new address & the old one.
                                </Text>
                            </Stack>
                        </form>
                    </Card>
                </Stack>
            </Paper>
        </Container>
    )
}