'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  FileText, 
  Send, 
  Bot,
  BarChart3,
  Activity,
  Globe,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/dashboard/navigation';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { apiClient, TrendData, SpeakerData, UtteranceData } from '@/lib/api';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName] = useState('John Smith');
  const [trendsData, setTrendsData] = useState<TrendData | null>(null);
  const [speakersData, setSpeakersData] = useState<SpeakerData | null>(null);
  const [utterancesData, setUtterancesData] = useState<UtteranceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data from dedicated endpoints
        const [utterances, speakers, trends] = await Promise.all([
          apiClient.getUtterances({ top: '10000' }), // Request all utterances for complete metrics
          apiClient.getSpeakers(),
          apiClient.getTrends()
        ]);
        
        setUtterancesData(utterances);
        setSpeakersData(speakers);
        setTrendsData(trends);
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setTrendsData({ window_start: '', window_end: '', trends: [] });
        setSpeakersData({ results: [] });
        setUtterancesData({ 
          items: [], 
          total_count: 0, 
          pagination: { top: 10, skip: 0, has_more: false },
          search_text: '',
          filters_applied: {}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalTopics = trendsData?.trends.length || 0;
  const activeSpeakers = speakersData?.results?.length || 0;
  const avgSentiment = speakersData?.results?.length 
    ? Math.round((speakersData.results.reduce((sum, s) => sum + s.avg_sentiment, 0) / speakersData.results.length) * 100)
    : 0;

  // Calculate real metrics from utterances data
  const uniqueMeetings = utterancesData?.items 
    ? new Set(utterancesData.items.map(u => u.meeting_id)).size 
    : 0;
  
  const meetingsHeld = uniqueMeetings;
  
  const uniqueRegions = utterancesData?.items 
    ? new Set(utterancesData.items.map(u => u.region).filter(r => r && r !== 'Unknown')).size 
    : 0;

  // Calculate quarterly meetings (last 3 months)
  const quarterlyMeetings = utterancesData?.items 
    ? (() => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        const recentMeetings = new Set(
          utterancesData.items
            .filter(u => {
              if (!u.meeting_id) return false;
              // Extract date from meeting_id if it contains a date
              const dateMatch = u.meeting_id.match(/(\d{4}-\d{2}-\d{2})/);
              if (dateMatch) {
                const meetingDate = new Date(dateMatch[1]);
                return meetingDate >= threeMonthsAgo;
              }
              return true; // Include if no date found (assume recent)
            })
            .map(u => u.meeting_id)
        );
        return recentMeetings.size;
      })()
    : 0;

  // Calculate additional metrics
  const totalUtterances = utterancesData?.total_count || 0;
  const uniqueDepartments = utterancesData?.items 
    ? new Set(utterancesData.items.map(u => u.department).filter(d => d && d !== 'Unknown')).size 
    : 0;
  
  // Calculate average sentiment from utterances (if available)
  const avgUtteranceSentiment = utterancesData?.items 
    ? (() => {
        const sentiments = utterancesData.items
          .map(u => u.sentiment_score)
          .filter(s => s !== null && s !== undefined && s !== 0);
        return sentiments.length > 0 
          ? Math.round((sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length) * 100)
          : 0;
      })()
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation 
        isLoggedIn={isLoggedIn} 
        userName={userName} 
        onLogout={() => setIsLoggedIn(false)} 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#F40009] mb-2">
              Global Townhall Insights
            </h1>
            <p className="text-xl text-gray-600">
              AI-Powered Executive Analytics Dashboard
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards 
            totalTopics={totalTopics}
            activeSpeakers={activeSpeakers}
            avgSentiment={avgSentiment}
            meetingsHeld={meetingsHeld}
            uniqueRegions={uniqueRegions}
            uniqueDepartments={uniqueDepartments}
            totalUtterances={totalUtterances}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/trends">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#F40009] rounded-full p-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Trend Analysis</h3>
                      <p className="text-sm text-gray-600">Explore emerging topics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/speakers">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 rounded-full p-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Speaker Insights</h3>
                      <p className="text-sm text-gray-600">Analyze engagement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/utterances">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-600 rounded-full p-3">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Search Utterances</h3>
                      <p className="text-sm text-gray-600">Find specific content</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/chat">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-600 rounded-full p-3">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                      <p className="text-sm text-gray-600">Ask questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-[#F40009]" />
                  <span>Top Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F40009]"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trendsData?.trends.slice(0, 5).map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{trend.name}</p>
                          <p className="text-sm text-gray-600">{trend.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{trend.meetings_count} utterances</p>
                          <p className="text-xs text-gray-500">
                            {(trend.avg_sentiment * 100).toFixed(1)}% sentiment
                          </p>
                        </div>
                      </div>
                    ))}
                    {trendsData?.trends.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No trends data available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Speakers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-[#F40009]" />
                  <span>Most Active Speakers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F40009]"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {speakersData?.results?.filter(speaker => !speaker.display_name.toLowerCase().includes('moderator')).slice(0, 5).map((speaker, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{speaker.display_name}</p>
                          <p className="text-sm text-gray-600">{speaker.department} • {speaker.region}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{speaker.mentions} utterances</p>
                          <p className="text-xs text-gray-500">
                            {(speaker.avg_sentiment * 100).toFixed(1)}% sentiment
                          </p>
                        </div>
                      </div>
                    ))}
                    {speakersData?.results?.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No speakers data available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Global Overview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-[#F40009]" />
                <span>Global Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-[#F40009] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Meeting Frequency</h3>
                  <p className="text-sm text-gray-600">{quarterlyMeetings} meetings this quarter</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Global Reach</h3>
                  <p className="text-sm text-gray-600">{uniqueRegions} regions worldwide</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Engagement</h3>
                  <p className="text-sm text-gray-600">{avgSentiment}% positive sentiment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
