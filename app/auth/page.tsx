'use client';

import { Anchor, Button, Checkbox, Divider, Group, Paper, PasswordInput, Text, TextInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form"
import { upperFirst, useToggle } from "@mantine/hooks";
import OAuth from "../utils/auth/oauth";
import { signInWithPass, signUpWithPass } from "../utils/auth/pass";
import { notifications } from "@mantine/notifications";
import useUser from "../utils/queries/user/useUser";
import { Error } from "../components/ui/Error";
import { useRouter } from "next/navigation";
import Loading from "../components/ui/Loading";
const Signin: React.FC = () => {
    const [type, toggle] = useToggle(['login', 'register'])
    const router = useRouter();
    const { user, loading, error } = useUser();
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            terms: false,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email!'),
            password: (val) => (val.length < 8 ? "Password should include at least 8 characters." : null),
        },
    });

    if(loading) return <Loading />

    if(error) return <Error number={500} />

    if(user) {
        router.push('/');
        return null;
    }

    const SlackIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png";
    const DiscordIcon = "https://www.svgrepo.com/show/353655/discord-icon.svg"
    const GitHubIcon = "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"


    const onSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        const validation = form.validate();
        if (validation.hasErrors) {
            notifications.show({
                title: 'Error',
                message: validation.errors[Object.keys(validation.errors)[0]] || 'Please fill out the form correctly.',
                color: 'red'
            })
            return;
        }

        if (type === 'register') {
            if (!form.values.terms) {
                notifications.show({
                    title: 'Error',
                    message: 'You must agree to the terms and conditions to register.',
                    color: 'red'
                })
                return;
            }
            try {
                const data = await signUpWithPass(form.values.email, form.values.password);
                if (data.session === null) {
                    notifications.show({
                        title: 'Success',
                        message: 'Registration successful! Please check your email to confirm your account.',
                        color: 'green'
                    })
                }
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: (error as Error).message || 'An error occured during registration.',
                    color: 'red'
                })
                return;
            }
        } else {
            try {
                await signInWithPass(form.values.email, form.values.password);
                notifications.show({
                    title: 'Success',
                    message: 'Login successful!!! YEY!',
                    color: 'green'
                })
                router.push('/')
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: (error as Error).message || 'An error occured during login.',
                    color: 'red'
                });
                return;
            }
        }
    }

    return (
        <Paper radius={"lg"} p="lg" withBorder style={{ maxWidth: 600, margin: 'auto' }}>
            <Text size="lg" fw={500}>
                Welcome to NextCTF, {type} with:
            </Text>
            <Group grow mb="md" mt="md">
                <Button onClick={() => OAuth("slack_oidc")} leftSection={<img src={SlackIcon} alt="Slack" style={{ width: 18, height: 18 }} />} variant="default" radius="xl" size="md">
                    Slack
                </Button>
                <Button onClick={() => OAuth("discord")} leftSection={<img src={DiscordIcon} alt="Discord" style={{ width: 18, height: 18 }} />} variant="default" radius="xl" size="md">
                    Discord
                </Button>
                <Button onClick={() => OAuth("github")} leftSection={<img src={GitHubIcon} alt="GitHub" style={{ width: 18, height: 18 }} />} variant="default" radius="xl" size="md">
                    GitHub
                </Button>
            </Group>    
            <Divider label="Or continue with email" labelPosition="center" my={"lg"}></Divider>
            <form onSubmit={(e: React.FormEvent) => onSubmit(e)}>
                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="Your email address"
                        value={form.values.email}
                        onChange={(e) => form.setFieldValue('email', e.currentTarget.value)}
                        radius={"md"}
                        required
                    />
                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(e) => form.setFieldValue('password', e.currentTarget.value)}
                        radius={"md"}
                    />
                    {type === 'register' && (
                        <Checkbox
                            label="I agree to the terms and conditions"
                            checked={form.values.terms}
                            onChange={(e) => form.setFieldValue('terms', e.currentTarget.checked)}
                        />
                    )}

                    <Group justify="space-between" mt="xl">
                        <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="sm">
                            {type === 'register' ? 'Already have an account? Login' : "Do not have an account? Register"}
                        </Anchor>
                        <Button type="submit" radius={"xl"}>
                            {upperFirst(type)}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    )

}

export default Signin;