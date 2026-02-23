"use client"

import { useEffect, useRef, useState } from "react"
import ChatInput from "@/components/ChatInput"
import ChatMessage from "@/components/ChatMessages"
import Loader from "@/components/Loader"
import { askQuestion } from "@/lib/api"
import { Message } from "@/types/chat"

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const suggestedQuestions = [
    "What is acne?",
    "What are rashes?",
    "What is rosacea?"
  ]

  async function handleSend(question: string) {
    console.log("[ui] handleSend", question)
    const lastUser = [...messages].reverse().find(m => m.role === "user")?.content
    setMessages(prev => [
      ...prev,
      { role: "user", content: question }
    ])

    setLoading(true)

    try {
      const res = await askQuestion(question, lastUser)
      console.log("[ui] got response", res)

      const safeFallback = "I don't know based on the available medical data."
      const content =
        res.answer?.trim() === safeFallback ? safeFallback : res.answer
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: content || safeFallback,
          sourceQuestion: res.source_question
        }
      ])
    } catch (err) {
      console.error("[ui] request failed", err)
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
      return
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages, loading])

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50/40 to-purple-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Medical Knowledge Assistant
            </h1>
            <p className="text-xs text-gray-500">Powered by MedQuAD RAG (Pinecone)</p>
          </div>
        </div>
        <div className="px-6 pb-3 text-xs text-amber-700">
          ⚠️ This chatbot is for informational purposes only and is not a substitute for professional medical advice.
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {/* Welcome Section */}
        {messages.length === 0 && (
          <div className="flex items-center justify-center min-h-full p-6">
            <div className="max-w-2xl w-full space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25 mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Ask about medical conditions
                </h2>
                <p className="text-gray-600 text-base max-w-md mx-auto">
                  Get evidence-based information from our comprehensive medical knowledge base
                </p>
              </div>

              {/* Suggested Questions */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Try asking:</p>
                <div className="space-y-2.5">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="w-full group bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl px-5 py-3.5 text-left transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium flex-1">
                          {q}
                        </span>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Disclaimer moved to header for persistent display */}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} />
              ))}
              {loading && <Loader />}
              <div ref={bottomRef} />
            </div>
          </div>
        )}
      </div>

      {/* Chat Input - Fixed at Bottom */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-md border-t border-gray-200">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  )
}
