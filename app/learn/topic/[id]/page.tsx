'use client';

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

import Loading from "@/app/components/ui/Loading";
import useUser from "@/app/utils/queries/user/useUser";
import { notifications } from "@mantine/notifications";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Error } from "@/app/components/ui/Error";

export default function LearnPage() {
    const { id } = useParams();
    const { user, loading: userLoading } = useUser();


    const [topic, setTopic] = useState<Topic | null>(null);
    const [sections, setSections] = useState<TopicSection[]>([]);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState<boolean | null>(false);
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const [quizInputs, setQuizInputs] = useState<Record<string, string>>({});
    const [quizResults, setQuizResults] = useState<Record<string, boolean | null>>({});

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const supabase = createClientComponentClient();
            const { data: topicData } = await supabase.from('topics').select('*').eq('id', id).single();

            setTopic(topicData);

            const { data: sectionsData } = await supabase.from('topic_sections').select('*').eq('topic_id', id).order('order_index', { ascending: true });
            setSections(sectionsData ?? []);

            const { data: quizData } = await supabase.from('quiz_questions').select('*').in('section_id', sectionsData?.map((s: TopicSection) => s.id) ?? [])
            setQuizQuestions(quizData ?? [])

            const sectionsIds = Array.isArray(sectionsData) ? sectionsData.map((s: TopicSection) => s.id) : [];
            if (sectionsIds.length > 0) {
                const { data: quizzesData } = await supabase.from('quiz_questions').select('*').in('section_id', sectionsIds);
                setQuizQuestions(quizzesData ?? [])
            }
            setLoading(false);
        }
        if(!userLoading) fetchData();
    }, [id]);

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
    
} 