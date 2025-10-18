'use client';

import Loading from "@/app/components/ui/Loading";
import useUser from "@/app/utils/queries/user/useUser";
import { notifications } from "@mantine/notifications";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Error } from "@/app/components/ui/Error";
import { Container, Title, Text, Group, Button, Paper, Grid, TextInput, ScrollArea, Box } from "@mantine/core"; 
import { IconListSearch } from "@tabler/icons-react";
import Link from "next/link";
import clsx from "clsx";
import MDEditor from "@uiw/react-md-editor";
import classes from '@/app/styles/Learn.module.css'
import "@uiw/react-markdown-preview/markdown.css";


interface TopicSection {
    id: string;
    topic_id: string;
    title: string;
    content: string;
    level: number;
    parent_id: string | null;
    order_index: number;
}

interface QuizQuestion {
    id: string;
    section_id: string;
    question: string;
    answer: string[];
}

interface Topic {
    id: string;
    title: string;
    short_description: string;
    created_at: string;
    published: boolean;
}

type SectionTree = TopicSection & { children: SectionTree[] };

export default function LearnPage() {
    const { id } = useParams();
    const { user, loading: userLoading } = useUser();

    const [topic, setTopic] = useState<Topic | null>(null);
    const [sections, setSections] = useState<TopicSection[]>([]);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState<boolean | null>(false);
    const [quizInputs, setQuizInputs] = useState<Record<string, string>>({});
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const sectionTree = useMemo(() => buildTree(sections), [sections]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const supabase = createClientComponentClient();
            const { data: topicData } = await supabase.from('topics').select('*').eq('id', id).single();
            setTopic(topicData);

            const { data: sectionsData } = await supabase.from('topic_sections').select('*').eq('topic_id', id).order('order_index', { ascending: true });
            
            const uniqueSections = Array.from(
              new Map((sectionsData ?? []).map(s => [s.id, s])).values()
            );
            setSections(uniqueSections);

            const { data: quizData } = await supabase.from('quiz_questions').select('*').in('section_id', uniqueSections.map((s: TopicSection) => s.id))
            setQuizQuestions(quizData ?? [])

            setLoading(false);
        }
        if(!userLoading) fetchData();
    }, [id, userLoading]);

    const handleInputChange = (quizId: string, value: string) => {
        setQuizInputs(prev => ({...prev, [quizId]: value }));
    }

    const handleQuizSubmit = async(quiz: QuizQuestion) => {
        const supabase = createClientComponentClient();
        const userAnswer = quizInputs[quiz.id];
        const { data } = await supabase.from('quiz_questions').select('id').eq('answer', userAnswer).eq('id', quiz.id).single();
        const isCorrect = !!data;
        notifications.show({
            title: isCorrect ? 'Correct!' : 'Wrong!',
            message: isCorrect ? 'You are right! Keep it up!' : 'Try again! Better luck next time!',
            color: isCorrect ? 'green' : 'red'
        })
    }

    if(loading || userLoading) return <Loading />;
    if(!topic) return <Error number={404} />

    const getSectionQuizzes = (sectionId: string) => quizQuestions.filter(q => q.section_id === sectionId);

    function buildTree(sections: TopicSection[], parentId: string | null = null): SectionTree[] {
        return sections
            .filter(s => s.parent_id === parentId)
            .sort((a, b) => a.order_index - b.order_index)
            .map(s => ({
                ...s,
                children: buildTree(sections, s.id)
            }));
    }

    const tableOfContents = sections
        .sort((a, b) => a.level - b.level || a.order_index - b.order_index)
        .map((section) => ({
            label: section.title,
            link: `#section-${section.id}`,
            order: section.level,
            id: section.id
        }));

    function TableOfContents() {
        const [active, setActive] = useState<string | null>(null);

          useEffect(() => {
            const sectionIds = tableOfContents.map((item) => item.id);

            const observer = new window.IntersectionObserver(
              (entries) => {
                const visibleEntries = entries.filter((e) => e.isIntersecting);

                if (visibleEntries.length > 0) {
                  const topmost = visibleEntries.sort(
                    (a, b) =>
                      a.target.getBoundingClientRect().top -
                      b.target.getBoundingClientRect().top
                  )[0];

                  const sectionId = topmost.target.id.replace("section-", "");
                  setActive(`#section-${sectionId}`);
                } else {
                  const allElements = sectionIds
                    .map((id) => {
                      const el = sectionRefs.current[id];
                      if (!el) return null;
                      const rect = el.getBoundingClientRect();
                      return { id, rect, distance: Math.abs(rect.top) };
                    })
                    .filter(Boolean);

                  if (allElements.length > 0) {
                    const closest = allElements.sort(
                      (a, b) => {
                        if (!a || !b) return 0;
                        return a.distance - b.distance;
                      }
                    )[0];
                    setActive(`#section-${closest?.id}`);
                  }
                }
              },
              {
                rootMargin: "-100px 0px -80% 0px",
                threshold: 0,
              }
            );

            sectionIds.forEach((id) => {
              const el = sectionRefs.current[id];
              if (el) observer.observe(el);
            });

            return () => observer.disconnect();
          }, [tableOfContents]);


        return (
            <div>
                <Group mb="md">
                    <IconListSearch size={18} stroke={1.5} />
                    <Text fw={700}>Table of contents</Text>
                </Group>
                {tableOfContents.map((item) => (
                    <Box
                        component={Link}
                        href={item.link}
                        key={item.id}
                        style={{
                            paddingLeft: `calc(${item.order} * var(--mantine-spacing-md))`,
                            display: "block",
                        }}
                        className={clsx(classes.link, {
                            [classes.linkActive]: active === item.link
                        })}
                        onClick={(e) => {
                            e.preventDefault();
                            setActive(item.link);
                            sectionRefs.current[item.id]?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        {item.label}
                    </Box>
                ))}
            </div>
        )
    }

    function QuizInput({ quiz, onSubmit, initialValue }: { quiz: QuizQuestion, onSubmit: (value: string) => void, initialValue: string }) {
        const [value, setValue] = useState(initialValue)
        useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);

        return (
            <Group>
                <TextInput
                    value={value}
                    onChange={(e) => setValue(e.currentTarget.value)}
                    style={{ flex :1, marginRight: 0}}
                />
                <Button
                    variant="light"
                    onClick={() => onSubmit(value)}
                >
                    Check
                </Button>

            </Group>
        )

    }

    const RenderSection = memo(function RenderSection({ section }: { section: SectionTree }) {
        return (
            <div
                id={`section-${section.id}`}
                ref={el => { sectionRefs.current[section.id] = el;}}
            >
                <Title mb={0} order={Math.min(section.level + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}>
                    {section.title}
                </Title>
                <MDEditor.Markdown source={section.content} />
                {getSectionQuizzes(section.id).length > 0 && (
                    getSectionQuizzes(section.id).map((quiz) => (
                        <div key={quiz.id} style={{ margin: "24px 0" }}>
                            <Text mb="sm">{quiz.question}</Text>
                            <QuizInput
                                quiz={quiz}
                                initialValue={quizInputs[quiz.id] || ''}
                                onSubmit={(value) => {
                                    handleInputChange(quiz.id, value);
                                    handleQuizSubmit( {...quiz, answer: [value]} )
                                }}
                            />
                        </div>
                    ))
                )}
                {section.children && section.children.map(child => (
                    <RenderSection section={child} key={child.id} />
                ))}
            </div>
        );
    })

    return (
        <Container size="lg">
            <Grid style={{ marginBottom: 100 }}>
                <Grid.Col
                    style={{
                        height: 'calc(100vh - 100px)',
                        overflowY: 'auto',
                        paddingRight: '2rem'
                    }}
                    span={{ base: 12, md: 8 }}
                    className={clsx("markdown-body", classes.hideScrollbar)}
                >
                    <Title mt={0} mb="md">{topic.title}</Title>
                    <Text c="dimmed">{topic.short_description}</Text>
                    {sectionTree.map(section => (
                        <RenderSection section={section} key={section.id} />
                    ))}
                    <div style={{ height: 500 }} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }} >
                    <div style={{
                        position: 'sticky',
                        top: 32
                    }}>
                        <ScrollArea>
                            <Paper p="md" shadow="sm">
                                <TableOfContents />
                            </Paper>
                        </ScrollArea>
                    </div>
                </Grid.Col>
            </Grid>
        </Container>
    )
}