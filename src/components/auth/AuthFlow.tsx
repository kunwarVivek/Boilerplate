import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { PasswordResetRequest } from './PasswordResetRequest';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';

type AuthStep = 'login' | 'register' | 'reset-password';

export function AuthFlow() {
  const [step, setStep] = useState<AuthStep>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">
            {step === 'login' ? 'Welcome back' : 
             step === 'register' ? 'Create your account' : 
             'Reset your password'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {step === 'login' ? 'Sign in to your account to continue' :
             step === 'register' ? 'Start your 30-day free trial' :
             'We'll send you instructions to reset your password'}
          </p>
        </div>

        <Card className="p-6">
          <AnimatePresence mode="wait">
            {step === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <LoginForm />
                <div className="mt-4 text-center space-y-2">
                  <button
                    onClick={() => setStep('reset-password')}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot your password?
                  </button>
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setStep('register')}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <RegisterForm />
                <div className="mt-4 text-center">
                  <div className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button
                      onClick={() => setStep('login')}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'reset-password' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <PasswordResetRequest />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setStep('login')}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Back to login
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}