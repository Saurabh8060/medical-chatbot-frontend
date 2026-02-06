export type Source = {
    text: string
    source?: string
}

export type ChatResponse = {
    answer: string
    sources: Source[]
}

export type Message = {
    role: "user" | "assistant"
    content: string
    sources?:Source[]
}
