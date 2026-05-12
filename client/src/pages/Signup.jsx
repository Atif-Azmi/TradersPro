import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Store, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            store_name: `${formData.name}'s Store`
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('Registration successful! Please check your email.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-display italic text-navy mb-4 inline-block">TraderPro</Link>
          <h2 className="text-2xl font-bold text-navy">Create your business account</h2>
          <p className="text-sm opacity-50 mt-2 font-medium">Start your 14-day free trial today. No credit card required.</p>
        </div>

        <div className="card p-10 shadow-2xl bg-white/70 backdrop-blur-xl border border-white">
          <form onSubmit={handleSignup} className="grid grid-cols-2 gap-6">
            <div className="col-span-2 relative">
              <User className="absolute left-4 top-[42px] opacity-30" size={18} />
              <Input 
                label="Full Name" 
                placeholder="Faiyaz Khan" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="pl-12"
              />
            </div>

            <div className="col-span-2 relative">
              <Mail className="absolute left-4 top-[42px] opacity-30" size={18} />
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="faiyaz@traders.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="pl-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-[42px] opacity-30" size={18} />
              <Input 
                label="Confirm Password" 
                type="password" 
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="pl-12"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="col-span-2 py-4 mt-4 text-sm font-bold shadow-lg"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin m-auto" size={20} /> : (
                <div className="flex items-center justify-center gap-2">
                   Create My Account <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-border text-center">
            <p className="text-sm font-medium opacity-60">
              Already have an account? 
              <Link to="/login" className="text-navy font-bold hover:text-accent ml-2">Login Here</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-8 grayscale opacity-30 pointer-events-none">
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><Store size={14}/> Secure Data</div>
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><Lock size={14}/> 256-bit SSL</div>
        </div>
      </div>
    </div>
  );
}
