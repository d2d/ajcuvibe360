import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CopyLinkButton } from './CopyLinkButton';
import { AutoRefresh } from './AutoRefresh';

const categoryColors = {
  SUBORDINATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  PEER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  SUPERVISOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  OTHER: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export default async function ManageReview({ params }: { params: Promise<{ reviewId: string }> }) {
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
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const completedCount = review.reviewers.filter((r) => r.response).length;
  const totalCount = review.reviewers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <AutoRefresh intervalSeconds={30} />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-3xl">Review Created Successfully!</CardTitle>
              <CardDescription>
                Performance review for <strong>{review.revieweeName}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm">
                  <strong>Responses received:</strong> {completedCount} of {totalCount}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>

              {completedCount >= 1 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold mb-2">
                    {completedCount === totalCount
                      ? 'All reviews completed! 🎉'
                      : `${completedCount} ${completedCount === 1 ? 'response' : 'responses'} received`}
                  </p>
                  <Button asChild>
                    <Link href={`/review/${reviewId}/results`}>View Results Dashboard</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviewer Links</CardTitle>
              <CardDescription>
                Share these unique links with your reviewers. Each link can only be used once.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {review.reviewers.map((reviewer) => {
                  const reviewUrl = `${baseUrl}/submit/${reviewer.token}`;
                  return (
                    <div
                      key={reviewer.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Badge className={categoryColors[reviewer.category as keyof typeof categoryColors]}>
                          {reviewer.category}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{reviewer.email}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {reviewUrl}
                          </p>
                        </div>
                      </div>
                      <CopyLinkButton url={reviewUrl} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/">Create Another Review</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
