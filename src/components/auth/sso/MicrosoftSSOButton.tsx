import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signInWithMicrosoft } from '@/lib/auth/sso/microsoft';
import { toast } from 'sonner';

export function MicrosoftSSOButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    try {
      setLoading(true);
      await signInWithMicrosoft();
    } catch (error) {
      toast.error('Failed to sign in with Microsoft');
      console.error('Microsoft SSO error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleSignIn}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          Signing in...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 23 23">
            <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
            <path fill="#f35325" d="M1 1h10v10H1z"/>
            <path fill="#81bc06" d="M12 1h10v10H12z"/>
            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
            <path fill="#ffba08" d="M12 12h10v10H12z"/>
          </svg>
          Continue with Microsoft
        </div>
      )}
    </Button>
  );
}