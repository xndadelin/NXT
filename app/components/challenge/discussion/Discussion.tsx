import { useDiscussion } from "@/app/utils/queries/challenges/discussion/getDiscussion";
import { Error } from "../../ui/Error";
import {
  Card,
  Text,
  Group,
  Title,
  Badge,
  Stack,
  Avatar,
  Box,
  Textarea,
  Button,
  TextInput,
  Divider,
} from "@mantine/core";
import {
  IconCornerDownRight,
  IconMessage,
  IconSend,
} from "@tabler/icons-react";
import useUser from "@/app/utils/queries/user/useUser";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
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
  const { discussion, loading, error, refetch } = useDiscussion(challengeId);
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [respondTo, setRespondTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const replyInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (respondTo && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyText, respondTo]);

  const submitComment = async (text: string, parentId: string | null) => {
    if (!text.trim() || !user) return;

    const isReply = parentId !== null;
    const stateUpdater = isReply ? setIsReplying : setIsSubmitting;

    stateUpdater(true);
    try {
      await addComment(challengeId, user.id, text.trim(), parentId);

      if (isReply) {
        setReplyText("");
        setRespondTo(null);
      } else {
        setNewMessage("");
      }

      notifications.show({
        title: "Success",
        message: isReply ? "Reply posted" : "Comment posted",
        color: "green",
      });
      refetch();
    } catch (error) {
      console.error(error)
      notifications.show({
        title: "Error",
        message: "Failed to post",
        color: "red",
      });
    } finally {
      stateUpdater(false);
    }
  };

  const organizeComments = (comments: Discussion[]) => {
    const topLevel: Discussion[] = [];
    const replies: { [key: string]: Discussion[] } = {};

    comments.forEach((comment) => {
      if (!comment.respond_to) {
        topLevel.push(comment);
      } else {
        if (!replies[comment.respond_to]) {
          replies[comment.respond_to] = [];
        }
        replies[comment.respond_to].push(comment);
      }
    });

    return { topLevel, replies };
  };

  const { topLevel, replies } = discussion
    ? organizeComments(discussion)
    : { topLevel: [], replies: {} };

  const CommentComponent = ({
    comment,
    isReply = false,
  }: {
    comment: Discussion;
    isReply?: boolean;
  }) => (
    <Box>
      <Group gap="sm" align="flex-start">
        {isReply && (
          <IconCornerDownRight size={16} color="var(--mantine-color-gray-5)" />
        )}
        <Avatar size={isReply ? 24 : 28} radius="md" color="blue">
          {comment.username ? comment.username.charAt(0).toUpperCase() : "U"}
        </Avatar>
        <Box style={{ flex: 1 }}>
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <Text fw={500} size={isReply ? "xs" : "sm"}>
                {comment.username}
              </Text>
              <Text c="dimmed" size="xs">
                •
              </Text>
              <Text c="dimmed" size="xs">
                {new Date(comment.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Group>

            {user && !isReply && (
              <Button size="xs" onClick={() => setRespondTo(comment.id)}>
                Reply
              </Button>
            )}
          </Group>

          <Text
            size={isReply ? "xs" : "sm"}
            mb="xs"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {comment.text}
          </Text>

          {user && respondTo === comment.id && (
            <Box
              mt="sm"
              style={{
                borderLeft: "1px solid var(--mantine-color-dark-2)",
                paddingLeft: "10px",
              }}
            >
              <Text size="xs" c="dimmed" mb="xs">
                Replying to {comment.username}
              </Text>
              <Group align="flex-start" gap="sm">
                <Avatar size={24} radius="md" color="blue">
                  {user.user_metadata?.username
                    ? user.user_metadata.username.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
                <Box style={{ flex: 1 }}>
                  <TextInput
                    ref={replyInputRef}
                    placeholder={`Reply to ${comment.username}`}
                    mb="xs"
                    size="xs"
                    onChange={(e) => setReplyText(e.currentTarget.value)}
                    value={replyText}
                  />
                  <Group gap="xs">
                    <Button
                      size="xs"
                      leftSection={<IconSend size={10} />}
                      onClick={() => submitComment(replyText, comment.id)}
                      loading={isReplying}
                      disabled={!replyText.trim()}
                    >
                      Reply
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        setRespondTo(null);
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </Group>
                </Box>
              </Group>
            </Box>
          )}
        </Box>
      </Group>
    </Box>
  );

  if (loading)
    return (
      <Card withBorder p="lg" radius="md">
        <Text c="dimmed">Loading discussion...</Text>
      </Card>
    );

  if (error) return <Error number={505} />;

  const hasComments = discussion && discussion.length > 0;

  return (
    <Card withBorder p="lg" radius="md">
      <Group mb="lg">
        <IconMessage size={18} />
        <Title order={4}>Discussion</Title>
        {hasComments && (
          <Badge variant="light" color="blue">
            {discussion.length}{" "}
            {discussion.length === 1 ? "comment" : "comments"}
          </Badge>
        )}
      </Group>

      {!hasComments && (
        <Text c="dimmed" mb="lg">
          No messages yet. Be the first to start the discussion!
        </Text>
      )}

      {topLevel.length > 0 && (
        <Stack gap="lg" mb="lg">
          {topLevel.map((comment) => (
            <Box key={comment.id}>
              <CommentComponent comment={comment} />

              {replies[comment.id] && (
                <Box ml="xl" mt="md">
                  <Stack gap="md">
                    {replies[comment.id].map((reply) => (
                      <CommentComponent
                        key={reply.id}
                        comment={reply}
                        isReply={true}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      )}

      {hasComments && <Divider my="lg" />}

      {user ? (
        <Group align="flex-start" gap="sm">
          <Avatar size={32} radius="md" color="blue">
            {user.user_metadata?.username
              ? user.user_metadata.username.charAt(0).toUpperCase()
              : "U"}
          </Avatar>
          <Box style={{ flex: 1 }}>
            <Textarea
              placeholder={
                hasComments ? "Add a comment..." : "Start the discussion..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.currentTarget.value)}
              rows={3}
              mb="xs"
              autosize={false}
            />
            <Group justify="flex-end">
              <Button
                size="sm"
                leftSection={<IconSend size={14} />}
                onClick={() => submitComment(newMessage, null)}
                loading={isSubmitting}
                disabled={!newMessage.trim()}
              >
                Post
              </Button>
            </Group>
          </Box>
        </Group>
      ) : (
        <Text c="dimmed" ta="center">
          Please sign in to join the discussion
        </Text>
      )}
    </Card>
  );
}
