import React from 'react'
import cn from 'clsx'

const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'h-4 w-4 animate-spin rounded-full border-b-2 border-white',
        className,
      )}
    ></div>
  )
}

export { LoadingSpinner }
