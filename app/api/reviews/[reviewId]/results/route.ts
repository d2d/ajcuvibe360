import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Answer {
  questionId: number;
  rating?: number;
  comment: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        reviewers: {
          include: {
            response: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Get all questions
    const questions = await prisma.question.findMany({
      orderBy: { order: 'asc' },
    });

    // Aggregate responses by category
    const aggregatedByCategory: Record<
      string,
      {
        count: number;
        questionAverages: Record<number, { sum: number; count: number; average: number }>;
        comments: Array<{ questionId: number; comment: string }>;
      }
    > = {};

    review.reviewers.forEach((reviewer) => {
      if (!reviewer.response) return;

      const category = reviewer.category;
      if (!aggregatedByCategory[category]) {
        aggregatedByCategory[category] = {
          count: 0,
          questionAverages: {},
          comments: [],
        };
      }

      const answers: Answer[] = JSON.parse(reviewer.response.answers);
      aggregatedByCategory[category].count++;

      answers.forEach((answer) => {
        if (answer.rating) {
          if (!aggregatedByCategory[category].questionAverages[answer.questionId]) {
            aggregatedByCategory[category].questionAverages[answer.questionId] = {
              sum: 0,
              count: 0,
              average: 0,
            };
          }
          aggregatedByCategory[category].questionAverages[answer.questionId].sum += answer.rating;
          aggregatedByCategory[category].questionAverages[answer.questionId].count++;
        }

        if (answer.comment) {
          aggregatedByCategory[category].comments.push({
            questionId: answer.questionId,
            comment: answer.comment,
          });
        }
      });
    });

    // Calculate averages
    Object.keys(aggregatedByCategory).forEach((category) => {
      Object.keys(aggregatedByCategory[category].questionAverages).forEach((qId) => {
        const questionId = parseInt(qId);
        const data = aggregatedByCategory[category].questionAverages[questionId];
        data.average = data.sum / data.count;
      });
    });

    // Overall aggregation (all categories combined)
    const overallAggregation: Record<number, { sum: number; count: number; average: number }> = {};
    const overallComments: Array<{ questionId: number; comment: string; category: string }> = [];

    review.reviewers.forEach((reviewer) => {
      if (!reviewer.response) return;

      const answers: Answer[] = JSON.parse(reviewer.response.answers);
      answers.forEach((answer) => {
        if (answer.rating) {
          if (!overallAggregation[answer.questionId]) {
            overallAggregation[answer.questionId] = { sum: 0, count: 0, average: 0 };
          }
          overallAggregation[answer.questionId].sum += answer.rating;
          overallAggregation[answer.questionId].count++;
        }

        if (answer.comment) {
          overallComments.push({
            questionId: answer.questionId,
            comment: answer.comment,
            category: reviewer.category,
          });
        }
      });
    });

    // Calculate overall averages
    Object.keys(overallAggregation).forEach((qId) => {
      const questionId = parseInt(qId);
      const data = overallAggregation[questionId];
      data.average = data.sum / data.count;
    });

    return NextResponse.json({
      review: {
        id: review.id,
        revieweeName: review.revieweeName,
        ownerName: review.ownerName,
        createdAt: review.createdAt,
      },
      questions,
      byCategory: aggregatedByCategory,
      overall: {
        questionAverages: overallAggregation,
        comments: overallComments,
        totalResponses: review.reviewers.filter((r) => r.response).length,
      },
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
