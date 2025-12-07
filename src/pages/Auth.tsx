import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/Context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Droplet, Mail, Lock, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup';
  
  const [isLogin, setIsLogin] = useState(!initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const mode = searchParams.get('mode');
    setIsLogin(mode !== 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        await signIn(email, password);
        navigate('/app');
      } else {
        await signUp(email, password);
        toast({
          title: "Welcome to Protocol",
          description: "Your account has been created. You're now logged in.",
        });
        navigate('/app');
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred";
      
      if (isLogin) {
        toast({
          title: "Login Failed",
          description: errorMessage.includes("invalid-credential") || errorMessage.includes("wrong-password")
            ? "Invalid email or password. Please try again."
            : errorMessage,
          variant: "destructive",
        });
      } else {
        if (errorMessage.includes("email-already-in-use")) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Try logging in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign Up Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Floating Gradient Orbs - ClinRef Style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            top: '-200px',
            right: '-200px',
            animation: 'float-orb 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle, #5de4ff 0%, transparent 70%)',
            bottom: '-150px',
            left: '-150px',
            animation: 'float-orb 20s ease-in-out infinite',
            animationDelay: '5s'
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.10]"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'float-orb-center 20s ease-in-out infinite',
            animationDelay: '10s'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4">
              <Droplet className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-amber-400">Pro</span>tocol
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-14 pl-12 pr-4 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20"
                required
                autoComplete="email"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-14 pl-12 pr-12 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password Link (Login only) */}
            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-zinc-500 hover:text-amber-400 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold text-lg rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting 
                ? (isLogin ? 'Signing in...' : 'Creating account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-3 text-zinc-600">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button 
              type="button"
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>

          {/* Toggle Login/Signup */}
          <p className="text-center mt-8 text-sm text-zinc-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Privacy Note */}
          <p className="text-center mt-8 text-xs text-zinc-600 leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="text-zinc-500 hover:text-white">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-zinc-500 hover:text-white">Privacy Policy</a>
          </p>
        </div>
      </main>

      {/* Pro Plan Badge */}
      {!isLogin && (
        <div className="relative z-10 text-center pb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Start with 14-day free Pro trial</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
