'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Calendar, Users, BarChart3 } from 'lucide-react';
import { apiClient, TrendData } from '@/lib/api';
import { Navigation } from '@/components/dashboard/navigation';

export default function TrendsPage() {
  const [trendsData, setTrendsData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn] = useState(true);
  const [userName] = useState('John Smith');

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        // Use the dedicated trends endpoint
        const trendsData = await apiClient.getTrends();
        setTrendsData(trendsData);
      } catch (error) {
        console.error('Failed to fetch trends:', error);
        setTrendsData({ window_start: '', window_end: '', trends: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMomentumColor = (momentum: string) => {
    switch (momentum) {
      case 'up':
        return 'bg-green-100 text-green-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.7) return 'text-green-600';
    if (sentiment > 0.3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation 
        isLoggedIn={isLoggedIn} 
        userName={userName} 
        onLogout={() => {}} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#F40009] mb-2">
              Trend Analysis
            </h1>
            <p className="text-xl text-gray-600">
              Discover emerging topics and sentiment patterns across your global townhalls
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F40009]"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Time Range Info */}
              {trendsData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Analysis Period</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {new Date(trendsData.window_start).toLocaleDateString()} - {new Date(trendsData.window_end).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Trends Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendsData?.trends.map((trend, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{trend.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {getMomentumIcon(trend.momentum)}
                          <Badge className={getMomentumColor(trend.momentum)}>
                            {trend.momentum}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{trend.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Meetings</span>
                          </div>
                          <span className="font-semibold">{trend.meetings_count}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Sentiment</span>
                          </div>
                          <span className={`font-semibold ${getSentimentColor(trend.avg_sentiment)}`}>
                            {(trend.avg_sentiment * 100).toFixed(1)}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Novelty Score</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#F40009] h-2 rounded-full" 
                                style={{ width: `${trend.novelty_score * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {(trend.novelty_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {trend.support.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-gray-500 mb-2">Supporting Meetings:</p>
                            <div className="space-y-1">
                              {trend.support.slice(0, 3).map((support, idx) => (
                                <div key={idx} className="text-xs text-gray-600">
                                  {support.meeting_id} at {support.ts}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {trendsData?.trends.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No trends data available
                    </h3>
                    <p className="text-gray-500">
                      Upload some meeting transcripts to start seeing trend analysis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
