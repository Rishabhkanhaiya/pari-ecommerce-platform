'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface CategorySortProps {
  currentSort: string
  sortOptions: { label: string; value: string }[]
}

export default function CategorySort({ currentSort, sortOptions }: CategorySortProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('sort', newSort)
    params.delete('page') // reset page on sort
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="input-field w-auto text-sm cursor-pointer"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
