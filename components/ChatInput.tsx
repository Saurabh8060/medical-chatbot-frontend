"use client"

import { useState } from "react"

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
    const [text, setText] = useState("")

    function handleSend() {
        if (!text.trim()) return
        onSend(text)
        setText("")
    }

    return (
        <div className="border-t bg-gradient-to-b from-white to-gray-50 p-4">
            <div className="max-w-3xl mx-auto">
                <div className="relative flex items-end gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-12 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400"
                            placeholder="Ask me anything..."
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                            rows={1}
                            style={{
                                minHeight: "48px",
                                maxHeight: "200px",
                                height: "auto"
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement
                                target.style.height = "auto"
                                target.style.height = target.scrollHeight + "px"
                            }}
                        />
                        <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                            {text.length > 0 && `${text.length} chars`}
                        </div>
                    </div>
                    <button
                        className="flex-shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        onClick={handleSend}
                        disabled={!text.trim()}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <p className="mt-2 text-xs text-gray-500 text-center">
                    Press Enter to send, Shift + Enter for new line
                </p>
            </div>
        </div>
    )
}