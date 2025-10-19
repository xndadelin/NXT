import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import useUser from "../user/useUser";
import { notifications } from "@mantine/notifications";

interface Contest {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    created_at: string;
    banner: string;
    participants: string[];
    has_ended?: boolean;
}

export default function useContests() {
    const supabase = createClient();
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userIsParticipating, setUserIsParticipating] = useState<boolean>(false);

    async function fetchContests() {
        setLoading(true);
        const { data: user } = await supabase.auth.getUser();
        try {
            const { data, error } = await supabase.from('contests').select('id, title, description, start_time, end_time, created_at, banner, participants');
            if (error) throw error;

            const contestsWithParticipants = data?.map(contest => ({
                ...contest,
                participants: contest.participants ?? [],
                isParticipating: user ? (contest.participants ?? []).includes(user?.user?.id) : false,
                has_ended: new Date(contest.end_time) < new Date()
            }))
            setContests(contestsWithParticipants);

            if(user && contestsWithParticipants.length > 0) {
                const participating = contestsWithParticipants.some(contest => contest.isParticipating)
                setUserIsParticipating(participating);
            } else {
                setUserIsParticipating(false);
            }

        } catch (error) {
            setError(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false);
        }
    }
    
    function isValidUUID(str: string) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
    }

    async function verifyKey(contestId: string, key: string): Promise<boolean> {
        if(!isValidUUID(key)) {
            return false;
        }
        const supabase = createClient();
        const { data, error } = await supabase.from('contests').select('id, participants').eq('id', contestId).eq('key', key).maybeSingle();
        if(error) {
            return false;
        }

        if(data) {
            const { data: user } = await supabase.auth.getUser();
            if(user && user?.user?.id) {
                const { error: updateError } = await supabase.from('contests').update({
                    participants: [...(data.participants || []), user.user.id]
                }).eq('id', data.id)
                if(updateError) {
                    notifications.show({
                        title: 'Error',
                        message: 'Failed to join contest!! Please try again later.',
                        color: 'red'
                    });
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        fetchContests();
    }, [])

    return { contests, loading, error, userIsParticipating, verifyKey }
}