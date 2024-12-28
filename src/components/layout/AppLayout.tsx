import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTenant } from '@/lib/tenant/TenantContext';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';
import { signOut } from '@/lib/auth';
import {
  LogOut,
  Settings,
  Users,
  BarChart,
  CreditCard,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: <BarChart className="h-5 w-5" />, href: '/dashboard' },
  { label: 'Team', icon: <Users className="h-5 w-5" />, href: '/team' },
  { label: 'Billing', icon: <CreditCard className="h-5 w-5" />, href: '/billing' },
  { label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { theme } = useTenant();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <Logo size="sm" />
            </div>

            {user && (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background md:hidden"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <nav className="p-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 flex gap-6 py-6">
        {user && (
          <aside className="hidden md:block w-64 shrink-0">
            <nav className="space-y-2 sticky top-24">
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </nav>
          </aside>
        )}
        
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}