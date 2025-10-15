'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: number;
  text: string;
  category: string;
  order: number;
}

interface Answer {
  questionId: number;
  rating?: number;
  comment: string;
}

const categoryColors = {
  SUBORDINATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  PEER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  SUPERVISOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  OTHER: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export default function SubmitReview() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [revieweeName, setRevieweeName] = useState('');
  const [category, setCategory] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [reviewerName, setReviewerName] = useState('');

  useEffect(() => {
    fetchReviewData();
  }, [token]);

  const fetchReviewData = async () => {
    try {
      const response = await fetch(`/api/reviewers/${token}`);
      if (!response.ok) {
        alert('Invalid or expired review link');
        return;
      }

      const data = await response.json();
      setRevieweeName(data.review.revieweeName);
      setCategory(data.reviewer.category);
      setHasSubmitted(data.reviewer.hasSubmitted);
      setQuestions(data.questions);

      // Initialize answers
      const initialAnswers: Record<number, Answer> = {};
      data.questions.forEach((q: Question) => {
        initialAnswers[q.id] = { questionId: q.id, rating: undefined, comment: '' };
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching review:', error);
      alert('Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (questionId: number, rating: number) => {
    setAnswers({
      ...answers,
      [questionId]: { ...answers[questionId], rating },
    });
  };

  const handleCommentChange = (questionId: number, comment: string) => {
    setAnswers({
      ...answers,
      [questionId]: { ...answers[questionId], comment },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName.trim()) {
      alert('Please enter your name');
      return;
    }

    // Validate that questions 1-17 have ratings
    const missingRatings = questions
      .filter((q) => q.order < 18)
      .filter((q) => !answers[q.id]?.rating);

    if (missingRatings.length > 0) {
      alert('Please rate all questions (1-17)');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          reviewerName,
          answers: Object.values(answers),
        }),
      });

      if (response.ok) {
        alert('Thank you! Your feedback has been submitted successfully.');
        setHasSubmitted(true);
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl mb-3">Already Submitted</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              You have already submitted your feedback for this review. Thank you for your participation!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl">360° Performance Review</CardTitle>
                <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                  {category}
                </Badge>
              </div>
              <CardDescription className="text-lg">
                Providing feedback for <strong>{revieweeName}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="reviewerName">Your Name (optional but recommended)</Label>
                <input
                  id="reviewerName"
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your identity will be kept confidential in the aggregated results
                </p>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(groupedQuestions).map(([categoryName, categoryQuestions]) => (
              <Card key={categoryName}>
                <CardHeader>
                  <CardTitle className="text-xl">{categoryName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categoryQuestions.map((question) => {
                    const isLastQuestion = question.order === 18;
                    return (
                      <div key={question.id} className="space-y-3">
                        <Label className="text-base font-medium">
                          {question.order}. {question.text}
                        </Label>

                        {!isLastQuestion && (
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => handleRatingChange(question.id, rating)}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                                  answers[question.id]?.rating === rating
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="text-lg font-bold">{rating}</div>
                                <div className="text-xs text-gray-500">
                                  {rating === 1 && 'Strongly Disagree'}
                                  {rating === 2 && 'Disagree'}
                                  {rating === 3 && 'Neutral'}
                                  {rating === 4 && 'Agree'}
                                  {rating === 5 && 'Strongly Agree'}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        <Textarea
                          placeholder={isLastQuestion ? "Please provide specific examples and suggestions..." : "Additional comments (optional)"}
                          value={answers[question.id]?.comment || ''}
                          onChange={(e) => handleCommentChange(question.id, e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
