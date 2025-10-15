import { useDiscussion } from "@/app/utils/queries/challenges/discussion/getDiscussion";
import { Error } from "../../ui/Error";
import { Card, Text, Group, Title, Badge, Stack, Paper, Avatar, Box } from "@mantine/core";
import { IconClock, IconMessage } from "@tabler/icons-react";
import useUser from "@/app/utils/queries/user/useUser"
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { addComment } from "@/app/utils/mutations/challenges/addComment";
interface DiscussionProps {
    challengeId: string;
}

interface Discussion {
    id: string;
    challenge_id: string;
    user_id: string;
    text: string;
    created_at: string;
    respond_to?: string;
    username: string;
}

export default function Discussion({ challengeId }: DiscussionProps) {
    const { discussion, loading, error, refetch } = useDiscussion(challengeId)
    const { user } = useUser();
    const [newMessage, setNewMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
    const [respondTo, setRespondTo] = useState<string | null>(null);

    const handleSubmitComment = async() => {
        if(!newMessage.trim() || !user) return;
        setIsSubmitting(true);
        try {
            await addComment(challengeId, user.id, newMessage.trim(), respondTo);
            setNewMessage('');
            setRespondTo(null);
            setShowCommentForm(false);
            notifications.show({
                title: 'Success',
                message: 'you commented!',
                color: 'green'
            })
            refetch();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'failed to add comment',
                color: 'red'
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) return (
        <Card withBorder p="lg" radius={"md"}>
            <Text c="dimmed">Loading discussion...</Text>
        </Card>
    )

    if(error) return <Error number={505} />

    if(!discussion || discussion.length === 0) return (
        <Card withBorder p="lg" radius={"md"}>
            <Group mb="md">
                <IconMessage size={18} />
                <Title order={4}>Discussion</Title>
            </Group>
            <Text c="dimmed">No messages yet. Be the first to start the discussion! Yey!</Text>
        </Card>
    )

    return (
        <Card withBorder p="lg" radius={"md"}>
            <Group mb="lg">
                <IconMessage size={18} />
                <Title order={4}>Discussion</Title>
            </Group>
            <Badge variant="light" color="blue">
                {discussion.length} {discussion.length === 1 ? 'message' : 'messages'}
            </Badge>

            <Stack gap="md">
                {discussion.map((msg: Discussion) => (
                    <Paper key={msg.id} withBorder p="md" radius="md">
                        <Group justify="space-betwen" mb="xs">
                            <Group gap="sm">
                                <Avatar
                                    size={32}
                                    radius="md"
                                    color="blue"
                                >
                                    {msg.username ? msg.username.charAt(0).toUpperCase() : 'U'}
                                </Avatar>
                                <div>
                                    <Text fw={500} size="sm">
                                        {msg.username || 'User'}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {new Date(msg.created_at).toLocaleDateString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </div>
                            </Group>
                            <IconClock size={14} color="var(--mantine-color-dimmed)" />
                        </Group>

                        <Box pl="md">
                            <Text size="sm" style={{ whiteSpace: 'pre-wrap'}}>
                                {msg.text}
                            </Text>
                        </Box>

                    </Paper>
                ))}
            </Stack>

        </Card>
    )

}