import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const reviewer = await prisma.reviewer.findUnique({
      where: { token },
      include: {
        review: true,
        response: true,
      },
    });

    if (!reviewer) {
      return NextResponse.json({ error: 'Reviewer not found' }, { status: 404 });
    }

    // Get all questions
    const questions = await prisma.question.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      reviewer: {
        id: reviewer.id,
        category: reviewer.category,
        hasSubmitted: !!reviewer.response,
      },
      review: {
        revieweeName: reviewer.review.revieweeName,
      },
      questions,
    });
  } catch (error) {
    console.error('Error fetching reviewer:', error);
    return NextResponse.json({ error: 'Failed to fetch reviewer' }, { status: 500 });
  }
}
