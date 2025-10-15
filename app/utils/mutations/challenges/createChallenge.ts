import { createClient } from '@/app/utils/supabase/client'

interface Challenge {
    title: string;
    description: string;
    difficulty: string;
    category: string;
    flag: string;
    points: number;
    resource?: string;
    mitre?: string;
    case_insensitive?: boolean;
    id?: string;
}


export default async function createChallenge(challenge: Challenge) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('challenges').upsert(
        [challenge],
        { onConflict: 'id' }
    ).select().single();

    if (error) {
        throw new Error(error.message);
    }
    
    return data;
}
