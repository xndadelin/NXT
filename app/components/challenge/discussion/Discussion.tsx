import { useDiscussion } from "@/app/utils/queries/challenges/discussion/getDiscussion";
import { Error } from "../../ui/Error";
import { Card, Text, Group, Title, Badge, Stack, Paper, Avatar, Box, Textarea, Button, Divider } from "@mantine/core";
import { IconClock, IconCornerDownRight, IconMessage, IconPlus, IconSend } from "@tabler/icons-react";
import useUser from "@/app/utils/queries/user/useUser"
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { addComment } from "@/app/utils/mutations/challenges/addComment";
import { setRequestMeta } from "next/dist/server/request-meta";
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
    const [replyText, setReplyText] = useState<string>('')
    const [isReplying, setIsReplaying] = useState<boolean>(false);

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

    const handleSubmitReply = async(parentId: string) => {
        if(!replyText.trim() || !user?.id) return;
        setIsReplaying(true);
        try {   
            await addComment(challengeId, user.id, replyText.trim(), parentId);
            setReplyText('');
            setRespondTo(null);
            notifications.show({
                title: 'Success',
                message: 'your reply has been posted! yey',
                color: 'greeen'
            })
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'failed to add reply',
                color: 'red'
            })
        } finally {
            setIsReplaying(false)
        }
    }

    const CommentComponent = ({ comment, isReply = false }: { comment: Discussion, isReply?: boolean}) => (
        <Box>
            <Group gap="sm" align="flex-start">
                {isReply && (
                    <IconCornerDownRight size={16} color="var(--mantine-color-gray-5)" />
                )}
            </Group>
        </Box>
    )

    const organizeComments = (comments: Discussion[]) => {
        const topLevel: Discussion[] = [];
        const replies: { [key: string]: Discussion[] } = {}

        comments.forEach(comment => {
            if(!comment.respond_to) {
                topLevel.push(comment);
            } else {
                if(!replies[comment.respond_to]) {
                    replies[comment.respond_to] = []
                }
                replies[comment.respond_to].push(comment);
            }
        })
        return { topLevel, replies }
    }


    const { topLevel, replies } = discussion ? organizeComments(discussion) : { topLevel: [], replies: {} }

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
            {user && (
                <Box mt={"lg"}>
                    <Group align="flex-start" gap="sm">
                        <Avatar size={32} radius={"md"} color="blue">
                            {user.user_metadata?.username ?
                                user.user_metadata.username.charAt(0).toUpperCase()
                                : 'u'}
                        </Avatar>
                        <Box style={{ flex: 1}}>
                            <Textarea
                                placeholder="Add a comment..."
                                value={newMessage}
                                autosize
                                mb="xs"
                                maxRows={4}
                                minRows={2}
                                onChange={(e) => setNewMessage(e.currentTarget.value)}
                            />
                            <Group justify="flex-end">
                                <Button
                                    size="sm"
                                    leftSection={<IconSend size={14} />}
                                    onClick={handleSubmitComment}
                                    loading={isSubmitting}
                                    disabled={!newMessage.trim()}
                                >
                                    Post
                                </Button>
                            </Group>
                        </Box>
                    </Group>
                </Box>
            )}
        </Card>
    )

    return (
        <Card withBorder p="lg" radius={"md"}>
            <Group mb="lg">
                <IconMessage size={18} />
                <Title order={4}>Comments</Title>
            </Group>
            <Badge variant="light" color="blue" mb="md">
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
                            {user && (
                                <Button
                                    variant="outlined"
                                    color="cyan"
                                    size="xs"
                                    onClick={() => {
                                        setRespondTo(msg.id);
                                        setShowCommentForm(true)
                                    }}  
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Reply
                                </Button>
                            )}
                        </Group>

                        <Box pl="md">
                            <Text size="sm" style={{ whiteSpace: 'pre-wrap'}}>
                                {msg.text}
                            </Text>
                        </Box>

                    </Paper>
                ))}
            </Stack>

            <Divider my="md" />

            {user && (
                <Box>
                    <Group align="flex-start" gap="sm">
                        <Avatar size={32} radius={"md"} color="blue">
                            {user.user_metadata?.username ?
                                user.user_metadata.username.charAt(0).toUpperCase()
                                : 'u'}
                        </Avatar>
                        <Box style={{ flex: 1}}>
                            <Textarea
                                placeholder="Add a comment..."
                                value={newMessage}
                                autosize
                                mb="xs"
                                maxRows={4}
                                minRows={2}
                                onChange={(e) => setNewMessage(e.currentTarget.value)}
                            />
                            <Group justify="flex-end">
                                <Button
                                    size="sm"
                                    leftSection={<IconSend size={14} />}
                                    onClick={handleSubmitComment}
                                    loading={isSubmitting}
                                    disabled={!newMessage.trim()}
                                >
                                    Post
                                </Button>
                            </Group>
                        </Box>
                    </Group>
                </Box>
            )}

        </Card>
    )

}