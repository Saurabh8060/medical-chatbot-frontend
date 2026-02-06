export default function SourcesPanel({ source }: { source: string | null | undefined }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-3">Sources</p>
      {!source ? (
        <div className="text-sm text-gray-400 italic">No sources available</div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-xs font-medium text-gray-500 mb-1.5">
            MedQuAD Question
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            {source}
          </div>
        </div>
      )}
    </div>
  )
}
