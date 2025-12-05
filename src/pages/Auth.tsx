import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      toast({
        title: "Validation Error",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message === "Invalid login credentials" 
              ? "Invalid email or password. Please try again."
              : error.message,
            variant: "destructive",
          });
        } else {
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Try logging in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign Up Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome to Protocol",
            description: "Your account has been created. You're now logged in.",
          });
          navigate('/');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Ambient glow */}
      <div 
        className="fixed top-[30%] left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: 'hsl(42, 35%, 55%)' }}
      />

      {/* Header */}
      <header className="py-8 sm:py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-[0.2em] uppercase">
            <span className="text-[hsl(42_35%_55%)]">Pro</span>tocol
          </h1>
          <p className="text-xs text-muted-foreground/60 mt-1 tracking-[0.3em] uppercase">
            Track · Log · Optimize
          </p>
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-start justify-center px-4 pb-8">
        <div className="w-full max-w-sm">
          <div className="section-panel p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6 text-center tracking-wide">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-muted-foreground uppercase tracking-wider">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isLogin ? 'Signing in...' : 'Creating account...') 
                  : (isLogin ? 'Sign In' : 'Create Account')
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>

          {/* Privacy note */}
          <p className="text-[10px] text-muted-foreground/40 text-center mt-4 px-4 leading-relaxed">
            Your health data stays on your device. We only store your login credentials securely.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center">
        <p className="text-[9px] text-muted-foreground/30 tracking-[0.25em] uppercase">
          Stay consistent
        </p>
      </footer>
    </div>
  );
};

export default Auth;
