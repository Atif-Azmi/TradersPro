import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Welcome back to TraderPro!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-display italic text-navy mb-4 inline-block">TraderPro</Link>
          <h2 className="text-2xl font-bold text-navy">Login to your store</h2>
          <p className="text-sm opacity-50 mt-2 font-medium">Enter your credentials to manage your inventory</p>
        </div>

        <div className="card p-10 shadow-2xl bg-white/70 backdrop-blur-xl border border-white">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="relative">
              <Mail className="absolute left-4 top-[42px] opacity-30" size={18} />
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="faiyaz@traders.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-[42px] opacity-30" size={18} />
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-12"
              />
            </div>

            <div className="flex justify-between items-center text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-navy" />
                <span className="opacity-60">Remember Me</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-accent hover:underline">Forgot Password?</Link>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 mt-4 text-sm font-bold shadow-lg"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin m-auto" size={20} /> : (
                <div className="flex items-center justify-center gap-2">
                   Sign In <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-border text-center">
            <p className="text-sm font-medium opacity-60">
              Don't have an account? 
              <Link to="/signup" className="text-navy font-bold hover:text-accent ml-2">Sign Up Free</Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-12 text-[10px] font-bold uppercase tracking-widest opacity-20">
          Securely powered by Supabase Auth
        </p>
      </div>
    </div>
  );
}
