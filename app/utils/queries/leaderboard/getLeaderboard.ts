import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";

export interface LeaderboardUser {
    id: string;
    username: string;
    points: number;
}

export function useLeaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {

        const supabase = createClient();

        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('users').select('id, username, points').order('points', { ascending: false });

                if (error) {
                    throw error;
                }

                setLeaderboard(data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err))
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();

        const channel = supabase
            .channel('challenges_realtime')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'users'
            }, () => {
                fetchLeaderboard();
            })
            .subscribe();
            
        return () => {
            supabase.removeChannel(channel);
        };

    }, [])

    return { leaderboard, loading, error };
}