import { Suspense } from 'react'
import CreateOrUpdateTask from './CreateOrUpdateTask'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  return (
    <main className="relative mt-10 flex justify-center p-4">
      <Suspense fallback={'Loading...'}>
        <CreateOrUpdateTask searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
