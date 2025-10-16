"use client";

import {
  Container,
  TextInput,
  Title,
  Grid,
  Button,
  Modal,
  Paper,
  Group,
} from "@mantine/core";
import useUser from "@/app/utils/queries/user/useUser";
import Loading from "@/app/components/ui/Loading";
import { Error } from "@/app/components/ui/Error";
import { useForm } from "@mantine/form";
import { FormEvent, useState } from "react";
import { Text } from "@mantine/core";
import MDEditor from "@uiw/react-md-editor";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface HeaderItem {
    id: string;
    title: string;
    parentId: string | null;
}

export default function AddTopicPage() {
  const { user, loading, error } = useUser();
  const [headers, setHeaders] = useState<HeaderItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<{ question: string, answer: string }[]>([]);
  const [subHeaders, setSubHeaders] = useState<string[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [finalContent, setFinalContent] = useState<string>('')

  const form = useForm({
    initialValues: {
      title: "",
      shortDescription: "",
      content: "",
    },
  });

  const formQuiz = useForm({
    initialValues: {
      question: "",
      answer: "",
    },
  });

  const onHandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!form.values.title || !form.values.shortDescription || !form.values.content) {
        notifications.show({
            title: 'Error',
            message: 'Please fill in all required fields.',
            color: 'red'
        })
        return;
    }
    try {
        const result = generateFinalContent(parseMarkdown(form.values.content, quizQuestions), quizQuestions);
        setFinalContent(JSON.stringify(result, null, 2));

        const supabase = createClientComponentClient();
        const { data, error } = await supabase.rpc('insert_topic', {
            p_title: form.values.title,
            p_short_description: form.values.shortDescription,
            p_author_id: user?.id || '',
            p_content: result,
        })

        if(error) {
            notifications.show({
                title: 'Error',
                message: error?.message,
                color: 'red'
            })
            return ;
        }

        notifications.show({
            title: 'Success',
            message: 'topic created!',
            color: 'green'
        })
    } catch(error) {
        notifications.show({
            title: 'Error',
            message: 'an unexpected error occurred',
            color: 'red'
        })
    }
  }

  const parseMarkdown = (markdown: string, quizQuestions: { question: string, answer: string}[]) => {
    const lines = markdown.split('\n');

    const structure: {
        id: string;
        level: number;
        title: string;
        parentId: string | null;
        content: string[]
        quizIds: number[]
    }[] = [];

    let currentHeader: any = null;
    let contentBuffer: string[] = [];

    lines.forEach((line) => {
        const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

        if (headerMatch) {
            if (currentHeader) {
                const headerIndex = structure.findIndex(h => h.id === currentHeader.id);
                if (headerIndex !== -1) {
                    let start = 0;
                    let end = contentBuffer.length - 1;
                    
                    while (start <= end && contentBuffer[start].trim() === '') start++;
                    while (end >= start && contentBuffer[end].trim() === '') end--;
                    
                    structure[headerIndex].content = contentBuffer.slice(start, end + 1);
                }
                contentBuffer = []; 
            }

            const level = headerMatch[1].length;
            const title = headerMatch[2].trim();
            const id = crypto.randomUUID();

            let parentId = null;
            for (let i = structure.length - 1; i >= 0; i--) {
                if (structure[i].level < level) {
                    parentId = structure[i].id;
                    break;
                }
            }

            const newHeader = {
                id,
                level,
                title,
                parentId,
                content: [],
                quizIds: [] as number[],
            }

            structure.push(newHeader);
            currentHeader = newHeader;
        } else if(line.trim().match(/^<(\d+)>$/)) {
            const quizMatch = line.trim().match(/^<(\d+)>$/);
            if(quizMatch && currentHeader) {
                const quizIndex = parseInt(quizMatch[1], 10) - 1;
                if(quizIndex >= 0 && quizIndex < quizQuestions.length) {
                    currentHeader.quizIds.push(quizIndex);
                }
            }
        } else { 
            contentBuffer.push(line);
        }
    });

    if (currentHeader) {
        const headerIndex = structure.findIndex((h) => h.id === currentHeader.id);
        if (headerIndex !== -1) {
            let start = 0;
            let end = contentBuffer.length - 1;
            
            while (start <= end && contentBuffer[start].trim() === '') start++;
            while (end >= start && contentBuffer[end].trim() === '') end--;
            
            structure[headerIndex].content = contentBuffer.slice(start, end + 1);
        }
    }
    
    return structure;
}

  const generateFinalContent = (structure: any[], quizQuestions: { question: string, answer: string }[]) => {
    const headerTree = structure.filter(header => !header.parentId)

    const addChildren = (parent: any) => {
        parent.children = structure.filter(header => header.parentId === parent.id);
        parent.children.forEach(addChildren)
        return parent;
    }

    const tree = headerTree.map(addChildren)
    const result = [] as TopicNode[];

    type TopicNode = {
        title: string;
        level: number;
        content: string;
        quizzes: { question: string; answer: string }[];
        children: TopicNode[];
    };

    const processNode = (node: any, depth = 0): TopicNode => {
        const item: TopicNode = {
            title: node.title,
            level: node.level,
            content: node.content.join('\n'),
            quizzes: node.quizIds.map((id: number) => quizQuestions[id]),
            children: []
        };

        if(node.children && node.children.length > 0) {
            node.children.forEach((child: any) => {
                item.children.push(processNode(child, depth + 1));
            });
        }
        return item;
    };

    tree.forEach((node) => {
        result.push(processNode(node))
    })

    return result;
  }

  if (loading) return <Loading />;
  if (error) return <Error number={500} />;
  if (!user || !user.user_metadata?.admin) return <Error number={401} />;

  return (
    <Container>
      <Title size="xl" fw={700} my="md" order={3} style={{ fontSize: "2rem" }}>
        Add a new topic
      </Title>
      <TextInput
        label="Title"
        placeholder="Set a title for your topic"
        mb="md"
        {...form.getInputProps("title")}
        my="md"
        required
      />
      <TextInput
        label="Short description"
        placeholder="Set a short description for your topic"
        mb="md"
        {...form.getInputProps("shortDescription")}
        my="md"
        required
      />
      <label style={{ color: "var(--mantine-color-white-6)" }}>Content</label>
      <MDEditor
        value={form.values.content}
        onChange={(value) => form.setFieldValue("content", value || "")}
        style={{ background: "var(--mantine-color-dark-8)", marginTop: "0.5rem" }}
      />
      <Grid justify="space-between" align="center" my="md" p="sm">
        <Text size="lg" fw={700}>
          Quiz questions
        </Text>
        <Button variant="light" color="cyan" onClick={open}>
          Add quiz question
        </Button>
      </Grid>
      <Modal opened={opened} onClose={close} title="Add a quiz question">
        <form>
          <TextInput
            label="Question"
            required
            mb="md"
            {...formQuiz.getInputProps("question")}
          />
          <TextInput
            label="Answer"
            required
            mb="md"
            {...formQuiz.getInputProps('answer')}
          />
          <Button
            variant="light"
            onClick={() => {
                setQuizQuestions([...quizQuestions, { question: formQuiz.values.question, answer: formQuiz.values.answer}])
                formQuiz.reset();
                close();
            }}
            disabled={!formQuiz.values.question || !formQuiz.values.answer}
          >
            Add question
          </Button>
        </form>
      </Modal>
      {quizQuestions.map((q, index) => (
        <Paper withBorder shadow="sm" radius="md" mb="md" key={index} p="md">
            <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">Question {index + 1}</Text>
                <Button variant="light" color="red" size="xs" onClick={() => {
                    setQuizQuestions(quizQuestions.filter((_, i) => i !== index))
                }}>
                    Remove
                </Button>
            </Group>

            <Text fw={600} size="md" mb="md">
                {q.question}?
            </Text>
            
            <Paper p="xs" withBorder radius={"sm"} bg="var(--mantine-color-dark-7)">
                <Group gap="xs">
                    <Text size="sm" fw={500} c="dimmed">Answer: </Text>
                    <Text size="sm">{q.answer}</Text>
                </Group>
            </Paper>

        </Paper>
      ))}
      {quizQuestions.length === 0 && (
        <Text c="dimmed">
            No quiz questions added yet. You can add some by clicking that button.
        </Text>
      )}
      <Button variant="light" color="green" my="md" onClick={(e) => onHandleSubmit(e as any)}>
        Create topic
      </Button>
    </Container>
  );
}
