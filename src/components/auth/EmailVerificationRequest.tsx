import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendVerificationEmail } from '@/lib/auth/emailVerification';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const verificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export function EmailVerificationRequest() {
  const [loading, setLoading] = useState(false);
  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  async function onSubmit(data: VerificationFormData) {
    try {
      setLoading(true);
      await sendVerificationEmail(data.email);
      toast.success('Verification email sent');
    } catch (error) {
      toast.error('Failed to send verification email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <CardTitle>Verify Your Email</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email address"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Verification Email'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}