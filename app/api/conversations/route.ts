import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, return empty conversations array
    // In production, fetch from backend/database
    return NextResponse.json([]);
  } catch (error) {
    console.error('[API] Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Create new conversation
    const conversation = {
      id: Date.now().toString(),
      title: body.title || 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
