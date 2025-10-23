'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { apiClient, ChatQuery, ChatResponse } from '@/lib/api';
import { Navigation } from '@/components/dashboard/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn] = useState(true);
  const [userName] = useState('John Smith');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const query: ChatQuery = {
        question: inputMessage,
        context: messages.length > 0 ? messages[messages.length - 1].content : undefined
      };

      const response: ChatResponse = await apiClient.chatQuery(query);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the Azure Function App is running on localhost:7071.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation 
        isLoggedIn={isLoggedIn} 
        userName={userName} 
        onLogout={() => {}} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#F40009] mb-2">
              AI Insights Assistant
            </h1>
            <p className="text-xl text-gray-600">
              Ask questions about your global townhall data and get intelligent insights
            </p>
          </div>

          <Card className="shadow-xl">
            <div className="bg-[#F40009] text-white p-6 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded-full p-2">
                  <Bot className="w-6 h-6 text-[#F40009]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Coca-Cola Townhall AI</h2>
                  <p className="text-sm opacity-90">Powered by Azure OpenAI</p>
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              <div className="h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Bot className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Welcome to Coca-Cola Townhall Insights
                      </h3>
                      <p className="text-gray-500 mb-6 max-w-md">
                        Ask me about trends, speaker insights, sentiment analysis, or any data from your global townhall meetings.
                      </p>
                      <div className="grid grid-cols-1 gap-3 w-full max-w-2xl">
                        <div className="bg-gray-50 p-4 rounded-lg text-left border border-gray-200">
                          <p className="text-sm text-gray-600">💡 Try asking:</p>
                          <p className="text-sm text-gray-800 mt-1">"What are the top 5 topics discussed this quarter?"</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-left border border-gray-200">
                          <p className="text-sm text-gray-600">💡 Or:</p>
                          <p className="text-sm text-gray-800 mt-1">"Show me sentiment trends by region"</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-left border border-gray-200">
                          <p className="text-sm text-gray-600">💡 Or:</p>
                          <p className="text-sm text-gray-800 mt-1">"Which speakers are most engaged in sustainability discussions?"</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="max-w-[80%]">
                            <div className="flex items-center space-x-2 mb-1">
                              {message.role === 'user' ? (
                                <User className="w-4 h-4 text-[#F40009]" />
                              ) : (
                                <Bot className="w-4 h-4 text-[#F40009]" />
                              )}
                              <span className="text-xs text-gray-500">
                                {message.role === 'user' ? 'You' : 'AI Assistant'} • {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <div
                              className={`rounded-lg p-4 ${
                                message.role === 'user'
                                  ? 'bg-[#F40009] text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {message.role === 'user' ? (
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              ) : (
                                <div className="text-sm prose prose-sm max-w-none">
                                  <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                      strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                      em: ({ children }) => <em className="italic">{children}</em>,
                                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
                                      h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>,
                                      h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>,
                                      code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                                      pre: ({ children }) => <pre className="bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto">{children}</pre>,
                                    }}
                                  >
                                    {message.content}
                                  </ReactMarkdown>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%]">
                            <div className="flex items-center space-x-2 mb-1">
                              <Bot className="w-4 h-4 text-[#F40009]" />
                              <span className="text-xs text-gray-500">AI Assistant • Thinking...</span>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-4">
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="border-t border-gray-200 p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Ask about meeting insights..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-[#F40009] hover:bg-[#D00008] text-white"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
