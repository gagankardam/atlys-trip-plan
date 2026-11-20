import { ArrowLeft } from 'lucide-react'

export function ScreenHeader({
  title,
  onBack,
}: {
  title: string
  onBack?: () => void
}) {
  return (
    <header className="flex items-center gap-3 px-6 pt-5 pb-1">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lift ring-1 ring-line"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
      ) : (
        <span className="w-10" />
      )}
      <p className="flex-1 text-center text-[15px] font-medium tracking-tight">{title}</p>
      <span className="w-10" />
    </header>
  )
}
