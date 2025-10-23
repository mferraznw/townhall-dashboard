'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, TrendingUp, Users, FileText } from 'lucide-react';

interface StatsCardsProps {
  totalTopics: number;
  activeSpeakers: number;
  avgSentiment: number;
  meetingsHeld: number;
  uniqueRegions: number;
  uniqueDepartments: number;
  totalUtterances: number;
}

export function StatsCards({ 
  totalTopics, 
  activeSpeakers, 
  avgSentiment, 
  meetingsHeld,
  uniqueRegions,
  uniqueDepartments,
  totalUtterances
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-l-4 border-l-[#F40009]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Topics</p>
              <p className="text-3xl font-bold text-[#F40009] mt-2">{totalTopics}</p>
              <p className="text-xs text-gray-500 mt-1">Across {uniqueDepartments} departments</p>
            </div>
            <MessageSquare className="w-10 h-10 text-[#F40009] opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Speakers</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{activeSpeakers}</p>
              <p className="text-xs text-gray-500 mt-1">Across {uniqueRegions} regions</p>
            </div>
            <Users className="w-10 h-10 text-blue-600 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Sentiment</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{avgSentiment}%</p>
              <p className="text-xs text-gray-500 mt-1">Positive engagement</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Meetings Held</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{meetingsHeld}</p>
              <p className="text-xs text-gray-500 mt-1">{totalUtterances} total utterances</p>
            </div>
            <FileText className="w-10 h-10 text-orange-600 opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
