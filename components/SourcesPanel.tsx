import { Source } from "@/types/chat"

export default function SourcesPanel({ sources }: { sources: Source[] }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-3">Sources</p>
      {sources.length === 0 ? (
        <div className="text-sm text-gray-400 italic">No sources available</div>
      ) : (
        <div className="space-y-2.5">
          {sources.map((s, i) => {
            const text = s.text || ""
            const snippet = text.length > 260 ? `${text.slice(0, 260)}…` : text
            return (
              <div key={i} className="border border-gray-200 rounded-lg p-3.5 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="text-xs font-medium text-gray-500 mb-1.5">
                  {s.source || "Source"}
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">{snippet}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}