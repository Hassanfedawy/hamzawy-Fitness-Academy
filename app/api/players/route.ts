import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/player';

export async function GET() {
  try {
    await dbConnect();
    const players = await Player.find({}).sort({ createdAt: -1 });
    
    if (!players) {
      return NextResponse.json(
        { error: 'No players found' },
        { status: 404 }
      );
    }

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
