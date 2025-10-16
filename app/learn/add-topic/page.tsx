'use client';

import { Container } from "@mantine/core"
import useUser from "@/app/utils/queries/user/useUser"
import Loading from "@/app/components/ui/Loading"
import { Error } from "@/app/components/ui/Error"
import { useForm } from "@mantine/form";
import { useState } from "react";
import MDEditor from '@uiw/react-md-editor'


export default function AddTopicPage() {
    const { user, loading, error } = useUser();
    const [headers, setHeaders] = useState<string[]>([]);
    const [quizQuestions, setQuizQuestions] = useState<string[]>([]);
    const [subHeaders, setSubHeaders] = useState<string[]>([]);

    const form = useForm({
        initialValues: {
            title: '',
            shortDescription: '',
            content: '',
        }
    })


    if (loading) return <Loading />;
    if (error) return <Error number={500} />
    if (!user || !user.user_metadata?.admin) return <Error number={401} />
    

    return (
        <Container>
            <MDEditor
                value={form.values.content}
                onChange={(value) => form.setFieldValue('content', value || '')}
            />
        </Container>
    )
}