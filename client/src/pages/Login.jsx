import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData);
      toast.success(`Welcome back, ${user.name}!`);
      switch (user.role) {
        case 'admin': navigate('/admin'); break;
        case 'organizer': navigate('/organizer'); break;
        default: navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[400px] h-[400px] bg-indigo-500 -top-20 -left-20" />
      <div className="orb w-[300px] h-[300px] bg-purple-500 -bottom-20 -right-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Sign in to your Eventrix account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[hsl(var(--muted-foreground))] mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-500 font-medium hover:underline">Sign up</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border)/0.5)]">
            <p className="text-xs font-semibold mb-2 text-center">Demo Accounts</p>
            <div className="space-y-1.5 text-xs text-[hsl(var(--muted-foreground))]">
              <div className="flex justify-between">
                <span>👑 Admin:</span>
                <span className="font-mono">admin@eventrix.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span>🧑‍💼 Organizer:</span>
                <span className="font-mono">sarah@eventrix.com / organizer123</span>
              </div>
              <div className="flex justify-between">
                <span>👤 Attendee:</span>
                <span className="font-mono">alex@eventrix.com / attendee123</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
