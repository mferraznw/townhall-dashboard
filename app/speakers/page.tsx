'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  MapPin, 
  Building, 
  MessageSquare, 
  TrendingUp,
  Quote
} from 'lucide-react';
import { apiClient, SpeakerData } from '@/lib/api';
import { Navigation } from '@/components/dashboard/navigation';

export default function SpeakersPage() {
  const [speakersData, setSpeakersData] = useState<SpeakerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [isLoggedIn] = useState(true);
  const [userName] = useState('John Smith');

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        // Use the dedicated speakers endpoint
        const speakersData = await apiClient.getSpeakers();
        setSpeakersData(speakersData);
      } catch (error) {
        console.error('Failed to fetch speakers:', error);
        setSpeakersData({ results: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.7) return 'text-green-600 bg-green-100';
    if (sentiment > 0.3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.7) return 'Very Positive';
    if (sentiment > 0.3) return 'Positive';
    if (sentiment > -0.3) return 'Neutral';
    if (sentiment > -0.7) return 'Negative';
    return 'Very Negative';
  };

  const filteredSpeakers = speakersData?.results?.filter(speaker => {
    const matchesSearch = speaker.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         speaker.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || departmentFilter === 'all' || speaker.department === departmentFilter;
    const matchesRegion = !regionFilter || regionFilter === 'all' || speaker.region === regionFilter;
    
    return matchesSearch && matchesDepartment && matchesRegion;
  }) || [];

  const departments = [...new Set(speakersData?.results?.map(s => s.department) || [])];
  const regions = [...new Set(speakersData?.results?.map(s => s.region) || [])];

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
              Speaker Analysis
            </h1>
            <p className="text-xl text-gray-600">
              Insights into speaker engagement and sentiment across your townhalls
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search speakers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setDepartmentFilter('all');
                    setRegionFilter('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F40009]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpeakers.map((speaker) => (
                <Card key={speaker.speaker_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{speaker.display_name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>{speaker.department}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{speaker.region}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getSentimentColor(speaker.avg_sentiment)}>
                        {getSentimentLabel(speaker.avg_sentiment)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Mentions</span>
                        </div>
                        <span className="font-semibold">{speaker.mentions}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Avg Sentiment</span>
                        </div>
                        <span className={`font-semibold ${getSentimentColor(speaker.avg_sentiment).split(' ')[0]}`}>
                          {(speaker.avg_sentiment * 100).toFixed(1)}%
                        </span>
                      </div>

                      {speaker.exemplar_quotes.length > 0 && (
                        <div className="pt-4 border-t">
                          <div className="flex items-center space-x-2 mb-2">
                            <Quote className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Key Quotes</span>
                          </div>
                          <div className="space-y-2">
                            {speaker.exemplar_quotes.slice(0, 2).map((quote, idx) => (
                              <div key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                "{quote.quote}"
                                <div className="text-xs text-gray-500 mt-1">
                                  {quote.meeting_id} at {quote.ts}
                                </div>
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
          )}

          {filteredSpeakers.length === 0 && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No speakers found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || departmentFilter || regionFilter 
                    ? 'Try adjusting your filters to see more results.'
                    : 'Upload some meeting transcripts to start seeing speaker analysis.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
