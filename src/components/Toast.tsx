import { AnimatePresence, motion } from 'motion/react'

export function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-40 max-w-[min(90vw,360px)] -translate-x-1/2 rounded-full bg-ink px-4 py-2.5 text-center text-sm text-white shadow-float"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
