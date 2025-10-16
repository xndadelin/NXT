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
import { useState } from "react";
import { Text } from "@mantine/core";
import MDEditor from "@uiw/react-md-editor";
import { useDisclosure } from "@mantine/hooks";

export default function AddTopicPage() {
  const { user, loading, error } = useUser();
  const [headers, setHeaders] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<{ question: string, answer: string }[]>([]);
  const [subHeaders, setSubHeaders] = useState<string[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

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
        </Paper>
      ))}
    </Container>
  );
}
