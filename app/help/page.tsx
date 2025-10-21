"use client";

import {
  Container,
  Title,
  Box,
  Group,
  Text,
  TextInput,
  Button,
  Divider,
  Accordion,
} from "@mantine/core";
import { IconHelpCircle, IconHelpHexagon } from "@tabler/icons-react";
import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css"



export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const faq = {
    General: [
      {
        question: "What is NextCTF?",
        answer:
          "NextCTF is a Capture the Flag (CTF) platform designed to help you improve your cybersecurity skills (and problem solving skills) through our fun and challenging CTF challenges & contests.",
      },
      {
        question: "How do I get started?",
        answer:
          "To get started, just simply create an account on our platform, explore the available challenges, and start choping away at them! ",
      },
      {
        question: "Is NextCTF free to use?",
        answer:
          "Yes, NextCTF is completely free! This platform is open sourced and available for everyone to use and contribute to.",
      },
      {
        question: "Where can I find the source code for NextCTF?",
        answer:
          "The source code for NextCTF is available on Github at <a href='https://github.com/xndadelin/NXT'>this link.</a>. You can close the repository, contribute to the project, or even host your own instance of NextCTF!",
      },
      {
        question: "How can I contact support?",
        answer:
          "If you need assistance or have any questions, feel free to reach out to our support team by clicking the 'Contact support' button",
      },
    ],
    Features: [
      {
        general: "What features does NextCTF offer?",
        answer:
          "NextCTF offers a variety of features including: challenging CTF challenges across multiple categories, a competitive leaderboard, writeups & learning resources, and regular contests to test your skills.",
      },
      {
        question: "What is a challenge?",
        answer:
          "A challenge is a specific task or problem that you must solve to earn points. Challenges can cover various topic such as web security, cryptography, reverse engineering, and more.",
      },
      {
        question: "How does the leaderboard work?",
        answer:
          "The leaderboard ranks users based on the points they have earned by solving challenges. The more challenges you solve, the higher you will rank on the leaderboard!",
      },
      {
        question: "What are writeups?",
        answer:
          "Writeups are detailed explanations of how to solve specific challenges. They provide insights into the techniques and tools used to solve the challenges, helping you learn and improve your skills.",
      },
      {
        question: "What are bloods?",
        answer:
          "Bloods are a numerical value that represents how many times a user has solved the first a challenge. Which means that if you are the first person to solve a challenge, you will earn a blood for that challenge.",
      },
      {
        question: "What are contests?",
        answer:
          "Contests are time-limited events where users can compete to solve a set of challenges. Contests often have their own leaderboard and offer unique challenges that are only available during the contest periods.",
      },
    ],
    Contest: [
      {
        question: "How do I join a contest?",
        answer:
          "To join a contest, simply navigate to the 'Contests' section of the platform, select the contest you wish to participate in, and click the 'Join' button. If the contest is open-world, you will see the key in the description, otherwise, you will need the key from the contest organizer.",
      },
      {
        question: "Are there any rules for contests?",
        answer:
          "Yes, each contest may have its own set of rules and guidelines. Make sure to read the contest description and rules before participating to ensure a fair and enjoyable experience for all participants.",
      },
    ],
    "Dynamic points": [
      {
        question: "What are dynamic points?",
        answer:
          "Dynamic points are a scoring system where the points awarded for solving a challenge decrease as more participants solve it. So, challenges with more solves will be less valuable than challenges with less solves. The natural logarithm in the formula means that the points decrease more slowly as the number of solves increases, preventing the points from dropping too quickly.",
      },
    ],
    "Help & Support": [
      {
        question: "How can I report a bug or suggest a feature?",
        answer:
          "If you encounter a bug or have a feature suggestion, please visit our GitHub repository at <a href='https://github.com/xndadelin/NXT/issues'>this link</a> to submit your feedback.",
      },
      {
        question:
          "Where can I find additional resource to learn more about CTFs?",
        answer:
          "We recommend checking out resources like CTFtime (<a href='https://ctftime.org/'>ctftime.org</a>), OverTheWire (<a href='https://overthewire.org/wargames/'>overthewire.org</a>), and various online forums and communities dedicated to CTFs and cybersecurity.",
      },
    ],
  };

  const allQuestions = Object.entries(faq).flatMap(([category, questions]) =>
    questions.map((q) => ({
      ...q,
      category,
      questionText: q.question ?? q.general,
      answerText: q.answer,
    }))
  );

  const filteredQuery = allQuestions.filter((q) => {
    const query = searchQuery.toLowerCase();
    return (
      q.questionText.toLowerCase().includes(query) ||
      q.answerText.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <Container>
        <Box
          my={40}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Group style={{ alignItems: "center" }}>
            <IconHelpCircle size={48} />
            <Text
              style={{
                fontSize: 48,
                fontWeight: 900,
              }}
            >
              Frequently asked questions
            </Text>
          </Group>
          <Text
            w="70%"
            style={{
              textAlign: "center",
            }}
            c="dimmed"
            fw={600}
          >
            Here are some questions and answers about NextCTF. If you have any
            other questions, feel free to reach out to us!
          </Text>
          <Group mt={40}>
            <TextInput
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              w={400}
            />
            <Button leftSection={<IconHelpHexagon size={18} />}>
              Contact support
            </Button>
          </Group>
        </Box>
      </Container>
      <Divider my={80} />
      <Container pb={80}>
        {searchQuery
          ? filteredQuery.length > 0
            ? (
              <Accordion variant="separated" chevronPosition="right">
                {filteredQuery.map((q, index) => (
                  <Accordion.Item key={index} value={q.questionText}>
                    <Accordion.Control>
                      {q.questionText}
                      <Text c="dimmed" size="sm" mt={2}>
                        {q.category}
                      </Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Text
                        dangerouslySetInnerHTML={{ __html: q.answerText }}
                        style={{ whiteSpace: "pre-wrap" }}
                      />
                      {q.questionText === "What are dynamic points?" && (
                        <BlockMath math={`\\text{points} = \\max\\left(\\text{min}, \\frac{\\text{base}}{1 + \\ln(\\text{solves})}\\right)`} />
                      )}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            )
            : (
              <Text ta="center" c="dimmed" fw={500} py={40}>
                No questions found for your search query.
              </Text>
            )
          : Object.entries(faq).map(([category, questions]) =>
              questions.length > 0 && (
                <Box key={category} mb={40}>
                  <Title order={2} mb={10}>
                    {category}
                  </Title>
                  <Accordion variant="separated" chevronPosition="right">
                    {questions.map((q, index) => (
                      <Accordion.Item key={index} value={q.question ?? q.general}>
                        <Accordion.Control>
                          {q.question ?? q.general}
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Text
                            dangerouslySetInnerHTML={{ __html: q.answer }}
                            style={{ whiteSpace: "pre-wrap" }}
                          />
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Box>
              )
            )
        }
      </Container>
    </div>
  );
}