import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ownerName, ownerEmail, revieweeName, reviewers } = body;

    // Validate input
    if (!ownerName || !ownerEmail || !revieweeName || !reviewers || reviewers.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create review with reviewers
    const review = await prisma.review.create({
      data: {
        ownerName,
        ownerEmail,
        revieweeName,
        reviewers: {
          create: reviewers.map((reviewer: { email: string; category: string }) => ({
            email: reviewer.email,
            category: reviewer.category,
            token: uuidv4(),
          })),
        },
      },
      include: {
        reviewers: true,
      },
    });

    return NextResponse.json({ reviewId: review.id, reviewers: review.reviewers });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
