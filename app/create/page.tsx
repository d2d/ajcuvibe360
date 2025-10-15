'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type ReviewerCategory = 'SUBORDINATE' | 'PEER' | 'SUPERVISOR' | 'OTHER';

interface Reviewer {
  email: string;
  category: ReviewerCategory;
  tempId: string;
}

const categoryColors = {
  SUBORDINATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  PEER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  SUPERVISOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  OTHER: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export default function CreateReview() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [revieweeName, setRevieweeName] = useState('');
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [newReviewerEmail, setNewReviewerEmail] = useState('');
  const [newReviewerCategory, setNewReviewerCategory] = useState<ReviewerCategory>('PEER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addReviewer = () => {
    if (newReviewerEmail && newReviewerCategory) {
      setReviewers([
        ...reviewers,
        {
          email: newReviewerEmail,
          category: newReviewerCategory,
          tempId: Math.random().toString(36).substr(2, 9),
        },
      ]);
      setNewReviewerEmail('');
      setNewReviewerCategory('PEER');
    }
  };

  const removeReviewer = (tempId: string) => {
    setReviewers(reviewers.filter((r) => r.tempId !== tempId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName,
          ownerEmail,
          revieweeName,
          reviewers: reviewers.map((r) => ({ email: r.email, category: r.category })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/review/${data.reviewId}/manage`);
      } else {
        alert('Failed to create review');
      }
    } catch (error) {
      console.error('Error creating review:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = ownerName && ownerEmail && revieweeName && reviewers.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Create 360° Review</CardTitle>
              <CardDescription>
                Set up a new performance review and add reviewers from different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Your Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Your Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerName">Your Name</Label>
                      <Input
                        id="ownerName"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerEmail">Your Email</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Reviewee Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Who is being reviewed?</h3>
                  <div>
                    <Label htmlFor="revieweeName">Reviewee Name</Label>
                    <Input
                      id="revieweeName"
                      value={revieweeName}
                      onChange={(e) => setRevieweeName(e.target.value)}
                      placeholder="Jane Smith"
                      required
                    />
                  </div>
                </div>

                {/* Add Reviewers */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Add Reviewers</h3>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="email"
                        value={newReviewerEmail}
                        onChange={(e) => setNewReviewerEmail(e.target.value)}
                        placeholder="reviewer@example.com"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addReviewer();
                          }
                        }}
                      />
                    </div>
                    <Select
                      value={newReviewerCategory}
                      onValueChange={(value) => setNewReviewerCategory(value as ReviewerCategory)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUBORDINATE">Subordinate</SelectItem>
                        <SelectItem value="PEER">Peer</SelectItem>
                        <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addReviewer}>
                      Add
                    </Button>
                  </div>

                  {/* Reviewer List */}
                  {reviewers.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {reviewers.length} reviewer{reviewers.length !== 1 ? 's' : ''} added
                      </p>
                      <div className="space-y-2">
                        {reviewers.map((reviewer) => (
                          <div
                            key={reviewer.tempId}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Badge className={categoryColors[reviewer.category]}>
                                {reviewer.category}
                              </Badge>
                              <span className="text-sm">{reviewer.email}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeReviewer(reviewer.tempId)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Review & Generate Links'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
