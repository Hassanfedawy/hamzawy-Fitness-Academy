import Table from './components/table'
import PlayerForm from './components/playerForm'
import { Player } from '@/app/types'

async function getPlayers(): Promise<Player[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiUrl}/api/players`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch players');
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return [];
  }
}

export default async function Home() {
  const players = await getPlayers();

  const headers = ['Name', 'Latest Sprint Speed', 'Latest Vertical Jump', 'End Date', 'Actions'];
  const data = players.map(player => [
    player.name,
    player.sprintSpeed?.length 
      ? `${player.sprintSpeed[player.sprintSpeed.length - 1].value} m/s` 
      : 'N/A',
    player.verticalJump?.length 
      ? `${player.verticalJump[player.verticalJump.length - 1].value} cm` 
      : 'N/A',
    new Date(player.endDate).toLocaleDateString(),
    player._id
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-heading font-bold text-primary">Hamzawy Basketball Academy Stats</h1>
      <p className="text-lg text-gray-300">Track the performance of our top athletes</p>
      <PlayerForm />
      <Table headers={headers} data={data} />
    </div>
  )
}