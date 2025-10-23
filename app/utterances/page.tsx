'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Search, 
  Filter,
  Play,
  Clock,
  User,
  Building,
  MapPin,
  Loader2
} from 'lucide-react';
import { apiClient, UtteranceData } from '@/lib/api';
import { Navigation } from '@/components/dashboard/navigation';

const ITEMS_PER_PAGE = 20;

interface UtteranceItem {
  utterance_id: string;
  meeting_id: string;
  speaker: string;
  department: string;
  region: string;
  country: string;
  start_ts: string;
  end_ts: string;
  sentiment_score: number;
  content: string;
  topics: string[];
  link_to_clip: string;
}

export default function UtterancesPage() {
  const [utterances, setUtterances] = useState<UtteranceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  
  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Refs for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUtterances = async (page: number, reset: boolean = false) => {
    const params: Record<string, string> = {
      top: ITEMS_PER_PAGE.toString(),
      skip: ((page - 1) * ITEMS_PER_PAGE).toString()
    };
    
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (speakerFilter !== 'all') params.speaker = speakerFilter;
    if (departmentFilter !== 'all') params.department = departmentFilter;
    if (regionFilter !== 'all') params.region = regionFilter;
    if (sentimentFilter !== 'all') {
      if (sentimentFilter === 'positive') {
        params.sentiment_min = '0.3';
      } else if (sentimentFilter === 'negative') {
        params.sentiment_max = '-0.3';
      } else if (sentimentFilter === 'neutral') {
        params.sentiment_min = '-0.3';
        params.sentiment_max = '0.3';
      }
    }
    
    return await apiClient.getUtterances(params);
  };

  const resetAndFetch = useCallback(async () => {
    setLoading(true);
    setUtterances([]);
    setCurrentPage(1);
    setHasMore(true);
    
    try {
      const data = await fetchUtterances(1, true);
      setUtterances(data.items || []);
      setTotalCount(data.total_count || 0);
      setHasMore((data.items?.length || 0) === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to fetch utterances:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, speakerFilter, departmentFilter, regionFilter, sentimentFilter]);

  const loadMore = useCallback(async () => {
    console.log('loadMore called', { loadingMore, hasMore, currentPage }); // Debug log
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      console.log('Fetching page:', nextPage); // Debug log
      const data = await fetchUtterances(nextPage, false);
      
      console.log('Loaded data:', { itemsCount: data.items?.length, totalCount: data.total_count }); // Debug log
      setUtterances(prev => [...prev, ...(data.items || [])]);
      setCurrentPage(nextPage);
      setHasMore((data.items?.length || 0) === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to load more utterances:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, loadingMore, debouncedSearchTerm, speakerFilter, departmentFilter, regionFilter, sentimentFilter]);

  // Reset and fetch when filters change
  useEffect(() => {
    resetAndFetch();
  }, [resetAndFetch]);

  // Infinite scroll observer
  useEffect(() => {
    if (loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          console.log('Loading more utterances...'); // Debug log
          loadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before reaching the element
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loadMore, loadingMore, hasMore]);

  // Get unique values for filters from current data
  const uniqueSpeakers = useMemo(() => {
    return Array.from(new Set(utterances.map(u => u.speaker))).sort();
  }, [utterances]);

  const uniqueDepartments = useMemo(() => {
    return Array.from(new Set(utterances.map(u => u.department))).sort();
  }, [utterances]);

  const uniqueRegions = useMemo(() => {
    return Array.from(new Set(utterances.map(u => u.region))).sort();
  }, [utterances]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-600 bg-green-100';
    if (sentiment < -0.3) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.3) return 'Positive';
    if (sentiment < -0.3) return 'Negative';
    return 'Neutral';
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation 
        isLoggedIn={true} 
        userName="John Smith" 
        onLogout={() => {}} 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#F40009] mb-2">Search Utterances</h1>
            <p className="text-gray-600">Find and analyze meeting content with AI-powered insights</p>
            {totalCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {utterances.length} of {totalCount} utterances
              </p>
            )}
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-[#F40009]" />
                <span>Search & Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="Search utterances..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Select value={speakerFilter} onValueChange={setSpeakerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Speaker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Speakers</SelectItem>
                    {uniqueSpeakers.map(speaker => (
                      <SelectItem key={speaker} value={speaker}>{speaker}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepartments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {uniqueRegions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
                
                {(searchTerm || speakerFilter !== 'all' || departmentFilter !== 'all' || 
                  regionFilter !== 'all' || sentimentFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSpeakerFilter('all');
                      setDepartmentFilter('all');
                      setRegionFilter('all');
                      setSentimentFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#F40009]" />
                <span>Utterances</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F40009]"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {utterances.map((utterance, index) => (
                      <div key={`${utterance.utterance_id}_${index}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{utterance.speaker}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Building className="w-4 h-4" />
                              <span>{utterance.department}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{utterance.region}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getSentimentColor(utterance.sentiment_score)}>
                              {getSentimentLabel(utterance.sentiment_score)}
                            </Badge>
                            {utterance.link_to_clip && utterance.link_to_clip !== '#' && (
                              <Button size="sm" variant="outline">
                                <Play className="w-4 h-4 mr-1" />
                                Play Clip
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-800 mb-3">{utterance.content}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimestamp(utterance.start_ts)}</span>
                            </div>
                            <span>Meeting: {utterance.meeting_id}</span>
                          </div>
                          {utterance.topics && utterance.topics.length > 0 && (
                            <div className="flex space-x-1">
                              {utterance.topics.slice(0, 3).map((topic, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {utterance.topics.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{utterance.topics.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {utterances.length === 0 && !loading && (
                      <div className="text-center py-8 text-gray-500">
                        No utterances found matching your criteria.
                      </div>
                    )}
                  </div>

                  {/* Infinite Scroll Load More */}
                  {hasMore && (
                    <div ref={loadMoreRef} className="flex flex-col items-center py-4 space-y-2">
                      {loadingMore ? (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading more utterances...</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-gray-400 text-sm">
                            Scroll down to load more
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={loadMore}
                            className="text-xs"
                          >
                            Or click to load more
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  
                  {!hasMore && utterances.length > 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      You've reached the end of the results
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}