'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  FileText,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Trends', href: '/trends', icon: TrendingUp },
  { name: 'Speakers', href: '/speakers', icon: Users },
  { name: 'Utterances', href: '/utterances', icon: MessageSquare },
  { name: 'Chat', href: '/chat', icon: FileText },
];

interface NavigationProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
}

export function Navigation({ isLoggedIn, userName, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-[#F40009] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2">
              <div className="w-10 h-10 bg-[#F40009] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">Coca-Cola</h1>
              <p className="text-sm opacity-90">Townhall Insights</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white text-[#F40009]'
                      : 'text-white hover:bg-white/10'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium hidden sm:block">
                  Welcome, {userName}
                </span>
                <Button
                  onClick={onLogout}
                  className="bg-white text-[#F40009] hover:bg-gray-100"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {/* Handle login */}}
                className="bg-white text-[#F40009] hover:bg-gray-100"
                size="sm"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors',
                      isActive
                        ? 'bg-white text-[#F40009]'
                        : 'text-white hover:bg-white/10'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}






