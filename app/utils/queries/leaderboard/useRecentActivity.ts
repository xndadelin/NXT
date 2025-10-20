import { useEffect, useState } from "react"
import { createClient } from "../../supabase/client"
import { Submission } from "./getLeaderboard"

export function useRecentActivity() {
    const [recent, setRecent] = useState<Submission[]>([])
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const supabase = createClient();
        const fetchRecentActivity = async () => {
            setLoading(true);
            const time  = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            const { data } = await supabase
                .from('submissions')
                .select("user_id, users(username), challenges(points, id, title), updated_at")
                .eq('done', true)
                .gte('updated_at', time)
                .order('updated_at', {
                    ascending: false
                })

            setRecent((data as unknown as Submission[] ?? []));
            setLoading(false);
        }

        fetchRecentActivity();

        const channel = supabase
            .channel('recent_activity')
            .on(
                "postgres_changes",
                {
                    event: '*',
                    schema: 'public',
                    table: 'submissions',
                }, () => {
                    fetchRecentActivity();
                }
            ).subscribe();
        
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { recent, loading }
}