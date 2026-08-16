import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-arsenal-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Logo className="justify-center mb-6" />
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-arsenal-muted mt-2 text-sm">Sign in to FieldHub</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-arsenal-card border border-arsenal-border rounded-xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-arsenal-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-arsenal-dark border border-arsenal-border rounded-lg px-4 py-2.5 text-white placeholder:text-arsenal-muted focus:outline-none focus:border-arsenal-teal transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-arsenal-muted mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-arsenal-dark border border-arsenal-border rounded-lg px-4 py-2.5 text-white placeholder:text-arsenal-muted focus:outline-none focus:border-arsenal-teal transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-arsenal-teal hover:bg-arsenal-teal-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-arsenal-muted space-y-1">
          <p className="font-medium text-white/70">Demo accounts</p>
          <p>Manager: manager@huntarsenal.com / arsenal2026</p>
          <p>Staff: alex.hunter@email.com / staff123</p>
        </div>
      </div>
    </div>
  );
}
