export type ChatResponse = {
    answer: string
    source_question: string | null
    matches?: Array<{
        score: number
        question: string
        answer: string
    }>
}

export type Message = {
    role: "user" | "assistant"
    content: string
    sourceQuestion?: string | null
}
