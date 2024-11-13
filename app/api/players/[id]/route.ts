import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/player';
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const player = await Player.findById(params.id);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
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
  try {
    const body = await request.json();
    await dbConnect();

    // Validate required fields
    if (!body.name || !body.sprintSpeed || !body.verticalJump) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure arrays are properly formatted
    if (!Array.isArray(body.sprintSpeed) || !Array.isArray(body.verticalJump)) {
      return NextResponse.json(
        { error: 'Sprint speed and vertical jump must be arrays' },
        { status: 400 }
      );
    }

    // Validate each stat entry
    const validateStats = (stats: any[]) => {
      return stats.every(stat => 
        typeof stat.month === 'string' && 
        typeof stat.value === 'number' &&
        stat.value >= 0
      );
    };

    if (!validateStats(body.sprintSpeed) || !validateStats(body.verticalJump)) {
      return NextResponse.json(
        { error: 'Invalid stat format' },
        { status: 400 }
      );
    }

    const player = await Player.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        sprintSpeed: body.sprintSpeed,
        verticalJump: body.verticalJump,
        endDate: body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      { new: true, runValidators: true }
    );

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const player = await Player.findByIdAndDelete(params.id);
  if (!player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Player deleted successfully' });
}