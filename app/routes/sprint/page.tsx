import { Player } from '@/app/types'
import Table from '@/app/components/table'

async function getPlayers(): Promise<Player[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiUrl}/api/players`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch players');
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return [];
  }
}

export default async function SprintPage() {
  const players = await getPlayers();

  // Get unique months from all players' sprint stats
  const months = Array.from(new Set(
    players.flatMap(player => player.sprintSpeed.map(stat => stat.month))
  )).sort();

  const headers = ['Name', ...months, 'Actions'];
  const data = players.map(player => {
    const statsMap = new Map(
      player.sprintSpeed.map(stat => [stat.month, stat.value])
    );
    
    return [
      player.name,
      ...months.map(month => 
        statsMap.has(month) ? `${statsMap.get(month)} m/s` : 'N/A'
      ),
      player._id // This will be used for Edit/Delete buttons
    ];
  });

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-heading font-bold text-primary">Sprint Stats</h1>
      <p className="text-lg text-gray-300">Track sprint speed progress over the months</p>
      <Table headers={headers} data={data} />
    </div>
  )
}