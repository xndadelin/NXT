import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";

interface Writeup {
    id: string;
    title: string;
    challenge_id: string;
    content_markdown: string;
    short_description: string;
    author_id: string;
}


export default function useWriteup(writeupId: string, method: 'view' | 'edit') {
    const [writeup, setWriteup] = useState<Writeup | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWriteup() {
            setLoading(true);
            switch(method) {
                case 'view': {
                    try {
                        const supabase = await createClient();
                        const { data, error } = await supabase.from('writeups').select('*').eq('id', writeupId).maybeSingle();
                        if(error) {
                            throw error;
                        }
                        setWriteup(data);
                    } catch (error) {
                        setError(error instanceof Error ? error.message : String(error))
                    } finally {
                        setLoading(false);
                    }
                    break;
                };
                case 'edit': {
                    try {
                        const supabase = await createClient();
                        const { data: dataUser } = await supabase.auth.getUser();
                        console.log(dataUser);
                        const { data, error } = await supabase.from('writeups').select('*').eq('id', writeupId).eq('author_id', dataUser?.user?.id).maybeSingle();
                        if(error) {
                            throw error;
                        }
                        setWriteup(data);
                    } catch(error) {
                        setError(error instanceof Error ? error.message : String(error))
                    } finally {
                        setLoading(false);
                    }
                    break;
                }

            }
        }

        fetchWriteup();
        
    }, [writeupId, method])

    return { writeup, loading, error };
}