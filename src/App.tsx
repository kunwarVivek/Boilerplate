import { AuthProvider } from '@/components/auth/AuthProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthPage } from '@/components/auth/AuthPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TenantProvider } from '@/lib/tenant/TenantContext';
import { TranslationProvider } from '@/lib/i18n/TranslationContext';
import { useAuth } from '@/components/auth/AuthProvider';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <TenantProvider organizationId={user.organization_id!}>
      <TranslationProvider 
        organizationId={user.organization_id!}
        defaultLanguage={user.preferred_language}
      >
        <AppLayout>
          <div>Welcome to Enterprise SaaS</div>
        </AppLayout>
      </TranslationProvider>
    </TenantProvider>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;