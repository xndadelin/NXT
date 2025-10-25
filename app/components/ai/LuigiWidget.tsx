'use client';
import { useState } from "react";
import { Modal, ActionIcon, Image, ScrollArea, Group, Stack, Button, Text, Textarea, Paper, Loader } from "@mantine/core";
import useUser from "@/app/utils/queries/user/useUser";
import ReactMarkdown from 'react-markdown'

export default function LuigiWidget() {
     const luigiImage = "https://hackclub.com/stickers/single%20neuron%20activated.png";
     const [opened, setOpened] = useState<boolean>(false);
     const { user, loading } = useUser();
     const [prompt, setPrompt] = useState<string>('');
     const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
     const [error, setError] = useState<string | null>(null);
     const [result, setResult] = useState<string | null>(null);

     if(!user && !loading) return null;

     async function sendPrompt() {
        if(!prompt.trim()) return ;
        setError(null);
        setResult(null);
        setLoadingRequest(true);
        try {
            const response = await fetch('/api/luigi', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt })
            })
            const json = await response.json();
            if(!response.ok) {
                setError(json.error || 'an unknown error occured');
                return ;
            }
            const data = json.data;
            setResult(data);
        } catch(error) {
            setError('an error occured while processing your request' + String(error));
        } finally {
            setLoadingRequest(false);
        }
     }

     return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Luigi - Your AI assistant"
                size="lg"
                centered
            >   
                <Stack>
                    <Textarea
                        placeholder="Ask Luigi anything related to cybersecurity or CTFs..."
                        label="Your prompt"
                        minRows={4}
                        value={prompt}
                        autosize
                        disabled={loadingRequest}
                        onChange={(e) => setPrompt(e.currentTarget.value)}
                    />

                    <Group justify="flex-end">
                        <Button
                            onClick={sendPrompt}
                            loading={loadingRequest}
                            disabled={loadingRequest}
                        >
                            Send
                        </Button>
                    </Group>

                    {loadingRequest && (
                        <Paper p="md" withBorder>
                            <Group gap="sm">
                                <Loader size="sm" />
                                <Text size="sm">Luigi is thinking...</Text>
                            </Group>
                        </Paper>
                    )}

                    {error && (
                        <Paper p="md" withBorder style={{
                            borderColor: 'var(--mantine-color-red-6)'
                        }}>
                            <Text size="sm" c="red" fw={500}>Error: </Text>
                            <Text size="sm" c="red">{error}</Text>
                        </Paper>
                    )}

                    {result && (
                        <Paper p="md" withBorder>
                            <Text size="sm" fw={500} mb="xs">
                                Luigi&rsquo;s response:
                            </Text>
                            <ScrollArea.Autosize mah={400}>
                                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }} className="markdown-body">
                                    <ReactMarkdown>
                                        {result}
                                    </ReactMarkdown>
                                </Text>
                            </ScrollArea.Autosize>
                        </Paper>
                    )}

                </Stack>
            </Modal>
            <div
                style={{
                    position: 'fixed',
                    left: 20,
                    bottom: 20,
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ActionIcon
                    onClick={() => setOpened(true)}
                    size={64}
                    radius='xl'
                    variant="transparent"
                    aria-label="Open Luigi AI Assistant"
                    style={{
                        padding: 0,
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <Image
                        src={luigiImage}
                        alt="Luigi AI assistant"
                        width={64}
                        height={64}
                        style={{ borderRadius: '50%' }}
                    />
                </ActionIcon>
            </div>
        </>
     )
}