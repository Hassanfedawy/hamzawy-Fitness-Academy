import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/player';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    await dbConnect();

    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }

    const players = await Player.find(query);
    return NextResponse.json(players);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    const currentMonth = startDate.toLocaleString('default', { month: 'long' });

    const player = new Player({
      name: body.name,
      sprintSpeed: body.sprintSpeed,
      verticalJump: body.verticalJump,
      startDate,
      endDate,
    });

    await player.save();
    return NextResponse.json(player);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  await dbConnect();
  const player = await Player.findByIdAndUpdate(params.id, body, { new: true });
  if (!player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }
  return NextResponse.json(player);
}