'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface Question {
  id: number;
  text: string;
  category: string;
  order: number;
}

interface QuestionAverage {
  sum: number;
  count: number;
  average: number;
}

interface CategoryData {
  count: number;
  questionAverages: Record<number, QuestionAverage>;
  comments: Array<{ questionId: number; comment: string }>;
}

interface ResultsData {
  review: {
    id: string;
    revieweeName: string;
    ownerName: string;
    createdAt: string;
  };
  questions: Question[];
  byCategory: Record<string, CategoryData>;
  overall: {
    questionAverages: Record<number, QuestionAverage>;
    comments: Array<{ questionId: number; comment: string; category: string }>;
    totalResponses: number;
  };
}

const categoryColors = {
  SUBORDINATE: '#3b82f6',
  PEER: '#10b981',
  SUPERVISOR: '#8b5cf6',
  OTHER: '#f97316',
};

const categoryBadgeColors = {
  SUBORDINATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  PEER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  SUPERVISOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  OTHER: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export default function ResultsPage() {
  const params = useParams();
  const reviewId = params.reviewId as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResultsData | null>(null);

  useEffect(() => {
    fetchResults();
  }, [reviewId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/results`);
      if (response.ok) {
        const resultsData = await response.json();
        setData(resultsData);
      } else {
        alert('Failed to load results');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No results found</p>
      </div>
    );
  }

  // Prepare chart data for overall scores by category
  const categoryComparisonData = Object.entries(data.byCategory).map(([category, categoryData]) => {
    const avgScore =
      Object.values(categoryData.questionAverages)
        .filter((q) => q.average > 0)
        .reduce((sum, q) => sum + q.average, 0) /
      Object.values(categoryData.questionAverages).filter((q) => q.average > 0).length;

    return {
      category,
      averageScore: parseFloat(avgScore.toFixed(2)),
      responses: categoryData.count,
    };
  });

  // Prepare radar chart data
  const questionCategories = [...new Set(data.questions.map((q) => q.category))];
  const radarData = questionCategories.map((cat) => {
    const questionsInCategory = data.questions.filter((q) => q.category === cat && q.order < 18);
    const avgScore =
      questionsInCategory.reduce((sum, q) => {
        const avg = data.overall.questionAverages[q.id]?.average || 0;
        return sum + avg;
      }, 0) / questionsInCategory.length;

    return {
      category: cat,
      score: parseFloat(avgScore.toFixed(2)),
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-3xl">360° Review Results</CardTitle>
              <CardDescription className="text-lg">
                Performance review for <strong>{data.review.revieweeName}</strong>
                <br />
                Total Responses: {data.overall.totalResponses}
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="by-category">By Category</TabsTrigger>
              <TabsTrigger value="questions">Detailed Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Category Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Scores by Category</CardTitle>
                  <CardDescription>Overall performance ratings from different reviewer groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="averageScore" fill="#3b82f6" name="Average Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Radar</CardTitle>
                  <CardDescription>Overall scores across different skill categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis domain={[0, 5]} />
                      <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Overall Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Development Areas (Question 18)</CardTitle>
                  <CardDescription>Feedback on areas for development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.overall.comments
                      .filter((c) => {
                        const question = data.questions.find((q) => q.id === c.questionId);
                        return question?.order === 18;
                      })
                      .map((comment, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm flex-1">{comment.comment}</p>
                            <Badge className={categoryBadgeColors[comment.category as keyof typeof categoryBadgeColors]}>
                              {comment.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="by-category" className="space-y-6">
              {Object.entries(data.byCategory).map(([category, categoryData]) => (
                <Card key={category}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        <Badge className={categoryBadgeColors[category as keyof typeof categoryBadgeColors]}>
                          {category}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600">{categoryData.count} responses</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.questions
                      .filter((q) => q.order < 18)
                      .map((question) => {
                        const avg = categoryData.questionAverages[question.id];
                        if (!avg) return null;

                        return (
                          <div key={question.id} className="space-y-2">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium flex-1">{question.text}</p>
                              <Badge variant="outline">{avg.average.toFixed(2)}</Badge>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${(avg.average / 5) * 100}%`,
                                  backgroundColor: categoryColors[category as keyof typeof categoryColors],
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}

                    {/* Comments for this category */}
                    {categoryData.comments.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Comments</h4>
                        <div className="space-y-2">
                          {categoryData.comments
                            .filter((c) => c.comment.trim())
                            .map((comment, idx) => {
                              const question = data.questions.find((q) => q.id === comment.questionId);
                              return (
                                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                                  <p className="text-xs text-gray-500 mb-1">{question?.text}</p>
                                  <p>{comment.comment}</p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="questions" className="space-y-6">
              {[...new Set(data.questions.map((q) => q.category))].map((cat) => (
                <Card key={cat}>
                  <CardHeader>
                    <CardTitle>{cat}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {data.questions
                      .filter((q) => q.category === cat && q.order < 18)
                      .map((question) => {
                        const overall = data.overall.questionAverages[question.id];
                        if (!overall) return null;

                        const categoryScores = Object.entries(data.byCategory)
                          .map(([category, categoryData]) => ({
                            category,
                            score: categoryData.questionAverages[question.id]?.average || 0,
                          }))
                          .filter((item) => item.score > 0);

                        return (
                          <div key={question.id} className="space-y-3">
                            <div>
                              <h4 className="font-semibold mb-2">
                                {question.order}. {question.text}
                              </h4>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Overall Average:</span>
                                <Badge variant="outline" className="text-lg">
                                  {overall.average.toFixed(2)}
                                </Badge>
                              </div>
                            </div>

                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={categoryScores}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Bar dataKey="score" fill="#3b82f6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      })}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
