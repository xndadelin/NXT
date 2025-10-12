'use client';

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";

export interface Challenge {
    id: string;
    title: string;
    difficulty: string;
    category: string;
    points: number;
    created_at: string;
}

export default function useChallenges() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        async function fetchChallenges() {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('challenges')
                    .select('*');
                
                if (error) {
                    throw error;
                }
                
                setChallenges(data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }
        
        fetchChallenges();
    }, []);
    
    return { challenges, loading, error };
}