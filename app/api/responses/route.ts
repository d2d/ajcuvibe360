import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, reviewerName, answers } = body;

    // Find the reviewer by token
    const reviewer = await prisma.reviewer.findUnique({
      where: { token },
      include: { response: true },
    });

    if (!reviewer) {
      return NextResponse.json({ error: 'Reviewer not found' }, { status: 404 });
    }

    if (reviewer.response) {
      return NextResponse.json({ error: 'Response already submitted' }, { status: 400 });
    }

    // Update reviewer name and create response
    await prisma.reviewer.update({
      where: { id: reviewer.id },
      data: {
        name: reviewerName || null,
        response: {
          create: {
            answers: JSON.stringify(answers),
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting response:', error);
    return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 });
  }
}
