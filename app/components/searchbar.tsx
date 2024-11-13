'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  initialSearch?: string;
}

export default function SearchBar({ initialSearch = '' }: SearchBarProps) {
  const [search, setSearch] = useState(initialSearch)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?search=${encodeURIComponent(search)}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search players..."
        className="flex-grow px-4 py-2 rounded-md bg-secondary text-white"
      />
      <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
        Search
      </button>
    </form>
  )
}