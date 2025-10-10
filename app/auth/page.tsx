'use client';

import { Anchor, Button, Checkbox, Divider, Group, Paper, PaperProps, PasswordInput, Text, TextInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form"
import { upperFirst, useToggle } from "@mantine/hooks";

const Signin: React.FC = (props: PaperProps) => {
    const [type, toggle] = useToggle(['login', 'register'])
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            terms: false,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email!'),
            password: (val) => (val.length < 8 ? "Password should include at least 8 characters." : null),
        }
    });

    const GoogleIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png";
    const DiscordIcon = "https://www.svgrepo.com/show/353655/discord-icon.svg"
    const GitHubIcon = "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"

    return (
        <Paper radius={"sm"} p="lg" withBorder {...props} style={{ maxWidth: 600, margin: 'auto' }}>
            <Text size="lg" fw={500}>
                Welcome to NextCTF, {type} with:
            </Text>
            <Group grow mb="md" mt="md">
                <Button leftSection={<img src={GoogleIcon} alt="Google" style={{ width: 18, height: 18 }} />} variant="default" radius="xl" size="md">
                    Google
                </Button>
                <Button leftSection={<img src={DiscordIcon} alt="Discord" style={{ width: 18, height: 18 }} />} variant="default" radius="xl" size="md">
                    Discord
                </Button>
                <Button leftSection={<img src={GitHubIcon} alt="GitHub" style={{ width: 18, height: 18 }} />} variant="default" radius="xl" size="md">
                    GitHub
                </Button>
            </Group>    
            <Divider label="Or continue with email" labelPosition="center" my={"lg"}></Divider>
            <form onSubmit={form.onSubmit(() => {})}>
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