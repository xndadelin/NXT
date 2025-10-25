import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const prompt = body.prompt;
    const supabase = await createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if(!user) {
        return NextResponse.json({
            error: 'Unauthorized'
        }, {
            status: 401
        })
    }

    if(!prompt) return NextResponse.json({
        error: 'Prompt is missing'
    }, {
        status: 400
    })

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if(!apiKey) return NextResponse.json({
        error: 'Deepseek API key is not configured'
    }, {
        status: 500
    })

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7
            })
        })

        if(!response.ok) {
            const text = await response.text();
            return NextResponse.json({
                error: `Deepseek API error: ${text}`
            }, {
                status: 500
            })
        }
        const data = await response.json();
        return NextResponse.json({ data: data?.choices?.[0]?.message?.content?.trim?.() ?? "" })


    } catch(error) {
        return NextResponse.json({
            error: 'deepseek error'
        }, {
            status: 500
        })
    }

}