import { Message } from "@/types/chat"
import SourcesPanel from "@/components/SourcesPanel"

export default function ChatMessage({ message }: { message: Message }) {
    const isUser = message.role === "user"
    
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} px-4 py-2`}>
            <div className="flex items-start gap-3 max-w-3xl">
                {!isUser && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                        AI
                    </div>
                )}
                
                {/* Message bubble */}
                <div
                    className={`
                        group relative px-4 py-3 rounded-2xl shadow-sm transition-all
                        ${isUser 
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm" 
                            : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                        }
                    `}
                >
                    <div className="prose prose-sm max-w-none">
                        {message.content}
                    </div>

                    {!isUser && message.sourceQuestion && (
                        <details className="mt-3">
                            <summary className="cursor-pointer text-sm text-blue-600">
                                View sources
                            </summary>
                            <SourcesPanel source={message.sourceQuestion} />
                        </details>
                    )}
                    
                    <div className={`
                        absolute -bottom-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity
                        ${isUser ? "right-0 text-gray-400" : "left-0 text-gray-400"}
                    `}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                {isUser && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold shadow-md">
                        U
                    </div>
                )}
            </div>
        </div>
    )
}
