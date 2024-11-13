import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/player';

type Props = {
  params: {
    id: string
  }
}

export async function GET(
  _request: NextRequest,
  { params }: Props
) {
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

export async function PUT(
  request: NextRequest,
  { params }: Props
) {
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

    const updatedPlayer = await Player.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        sprintSpeed: body.sprintSpeed,
        verticalJump: body.verticalJump,
        startDate: body.startDate,
        endDate: body.endDate,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPlayer);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: Props
) {
  try {
    await dbConnect();
    const player = await Player.findByIdAndDelete(params.id);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}