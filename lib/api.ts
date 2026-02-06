import { ChatResponse } from "@/types/chat";

export async function askQuestion(
    question:string,
    lastTopic?: string
): Promise<ChatResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    console.log("[api] Sending question", question);
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({ question, message: question, last_topic: lastTopic, debug: true }),
        signal: controller.signal
    })
    clearTimeout(timeoutId);

    if(!res.ok) {
        console.error("[api] Response failed", res.status);
        throw new Error(`Chat request failed (${res.status})`)
    }

    const data = await res.json();
    console.log("[api] Response payload", data);
    if (data?.matches) {
        console.log("[api] Vector matches", data.matches);
    }
    return {
        answer: data.answer ?? data.response ?? "",
        source_question: data.source_question ?? null,
        matches: data.matches ?? undefined
    };
}
