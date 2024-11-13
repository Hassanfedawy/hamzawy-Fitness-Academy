'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
export default function PlayerForm() {
  const [name, setName] = useState('');
  const [sprintSpeed, setSprintSpeed] = useState('');
  const [verticalJump, setVerticalJump] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    try {
      const response = await axios.post(`/api/players`, {
        name: name.trim(),
        sprintSpeed: [{
          month: currentMonth,
          value: Number(sprintSpeed)
        }],
        verticalJump: [{
          month: currentMonth,
          value: Number(verticalJump)
        }]
      });

      console.log('Response:', response.data);
      
      setName('');
      setSprintSpeed('');
      setVerticalJump('');
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('Axios error:', err.response?.data);
        setError(err.response?.data?.error || `Server error: ${err.response?.status}`);
      } else {
        console.log('Unknown error:', err);
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 bg-red-100 p-3 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Player Name"
          className="w-full px-4 py-2 rounded-md bg-secondary text-white"
          required
          disabled={loading}
        />
        <input
          type="number"
          value={sprintSpeed}
          onChange={(e) => setSprintSpeed(e.target.value)}
          placeholder="Sprint Speed (m/s)"
          className="w-full px-4 py-2 rounded-md bg-secondary text-white"
          required
          step="0.1"
          min="0"
          disabled={loading}
        />
        <input
          type="number"
          value={verticalJump}
          onChange={(e) => setVerticalJump(e.target.value)}
          placeholder="Vertical Jump (cm)"
          className="w-full px-4 py-2 rounded-md bg-secondary text-white"
          required
          min="0"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding Player...' : 'Add Player'}
        </button>
      </form>
    </div>
  );
}