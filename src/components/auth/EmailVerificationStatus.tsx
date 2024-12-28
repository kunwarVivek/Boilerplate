import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyEmail } from '@/lib/auth/emailVerification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export function EmailVerificationStatus() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }

    verify();
  }, [token]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'success' ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Email Verified
            </>
          ) : status === 'error' ? (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              Verification Failed
            </>
          ) : (
            'Verifying Email...'
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'success' ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your email has been successfully verified.
            </p>
            <Button asChild>
              <a href="/login">Continue to Login</a>
            </Button>
          </div>
        ) : status === 'error' ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              The verification link is invalid or has expired.
            </p>
            <Button asChild variant="outline">
              <a href="/verify-email">Request New Link</a>
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}