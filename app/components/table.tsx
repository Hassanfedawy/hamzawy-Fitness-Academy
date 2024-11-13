'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

interface TableProps {
  headers: string[]
  data: (string | number)[][]
}

type SortConfig = {
  key: number
  direction: 'asc' | 'desc' | null
}

export default function Table({ headers, data }: TableProps) {
  const router = useRouter()
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: -1, direction: null })

  const handleDelete = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/players/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Failed to delete player: ${res.status}`);
      }
      router.refresh();
    } catch (error) {
      console.error('Failed to delete player:', error);
    }
  }

  const handleSort = (columnIndex: number) => {
    let direction: 'asc' | 'desc' | null = 'asc';

    if (sortConfig.key === columnIndex && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === columnIndex && sortConfig.direction === 'desc') {
      direction = null;
    }

    setSortConfig({ key: columnIndex, direction });
  }

  const getSortedData = () => {
    if (sortConfig.direction === null) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle numeric values (remove units if present)
      const aNum = typeof aValue === 'string' ? parseFloat(aValue) : aValue;
      const bNum = typeof bValue === 'string' ? parseFloat(bValue) : bValue;

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'asc' 
          ? aNum - bNum 
          : bNum - aNum;
      }

      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }

  const getSortIcon = (columnIndex: number) => {
    if (sortConfig.key !== columnIndex) return <FaSort className="inline ml-1" />;
    if (sortConfig.direction === 'asc') return <FaSortUp className="inline ml-1" />;
    if (sortConfig.direction === 'desc') return <FaSortDown className="inline ml-1" />;
    return <FaSort className="inline ml-1" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-background-light border border-secondary rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-secondary">
            {headers.map((header, index) => (
              <th 
                key={index} 
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-secondary/80"
                onClick={() => handleSort(index)}
              >
                {header}
                {index !== headers.length - 1 && getSortIcon(index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary">
          {getSortedData().map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-secondary/50 transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {cellIndex === row.length - 1 ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/edit/${cell}`)}
                        className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cell as string)}
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}