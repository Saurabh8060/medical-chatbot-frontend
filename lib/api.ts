import { ChatResponse, Source } from "@/types/chat";

export async function askQuestion(
    question:string
): Promise<ChatResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    console.log("[api] Sending question", question);
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({ question, message: question }),
        signal: controller.signal
    })
    clearTimeout(timeoutId);

    if(!res.ok) {
        console.error("[api] Response failed", res.status);
        throw new Error(`Chat request failed (${res.status})`)
    }

    const data = await res.json();
    console.log("[api] Response payload", data);
    return {
        answer: data.answer ?? data.response ?? "",
        sources: normalizeSources(data.sources)
    };
}

export async function ingestText(text: string): Promise<{ status: string; message?: string; chunks_added?: number }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/ingest`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text, replace: false }),
        signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
        throw new Error(`Ingest failed (${res.status})`);
    }

    return res.json();
}

export async function resetIndex(): Promise<{ status: string }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/reset`, {
        method: "POST"
    });
    if (!res.ok) {
        throw new Error(`Reset failed (${res.status})`);
    }
    return res.json();
}

export async function ingestPdf(file: File, replace: boolean = false): Promise<{ status: string; message?: string; chunks_added?: number }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("replace", String(replace));

    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/ingest_pdf`, {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
        throw new Error(`PDF ingest failed (${res.status})`);
    }
    return res.json();
}

function normalizeSources(raw: any): Source[] {
    if (!raw) return [];
    if (Array.isArray(raw)) {
        return raw.map((item) => {
            if (typeof item === "string") return { text: item };
            if (item?.text) return { text: item.text, source: item.source };
            return { text: String(item) };
        });
    }
    return [];
}
