'use client';

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";

export interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    points: number;
    resource?: string;
    mitre?: string;
    case_insensitive: boolean;
    created_at: string;
    flag?: string;
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
                console.error('Error fetching challenges:', err);
            } finally {
                setLoading(false);
            }
        }
        
        fetchChallenges();
    }, []);
    
    return { challenges, loading, error };
}