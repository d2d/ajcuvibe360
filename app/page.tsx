import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              360° Performance Review
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Gather comprehensive feedback from all perspectives
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl">Get Started</CardTitle>
              <CardDescription className="text-lg">
                Create a new 360-degree performance review and invite reviewers from different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Feature Cards */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Multi-Perspective Feedback</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Collect feedback from subordinates, peers, supervisors, and others
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Anonymous Responses</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reviewers submit feedback anonymously for honest insights
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Easy Sharing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate unique links for each reviewer to submit their feedback
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Visual Dashboard</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View aggregated results with charts and insights by category
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/create">
                  <Button size="lg" className="w-full text-lg h-14">
                    Create New Review
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold mb-2">Create Review</h3>
                <p className="text-sm">Set up your review and add reviewers in different categories</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold mb-2">Share Links</h3>
                <p className="text-sm">Send unique links to each reviewer to complete the survey</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold mb-2">View Results</h3>
                <p className="text-sm">Access your dashboard with aggregated feedback by category</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
