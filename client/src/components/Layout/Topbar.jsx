import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, User, Zap } from 'lucide-react';

const Topbar = ({ title }) => {
  const { session } = useAuth();
  const storeName = session?.user?.user_metadata?.store_name || 'My Store';

  return (
    <header className="topbar h-20 flex items-center justify-between px-10 bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-bottom">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-display italic text-navy">{title}</h2>
        <div className="hidden md:flex items-center gap-4 px-5 py-2.5 rounded-2xl border border-border bg-cream/30 w-80">
          <Search size={18} className="opacity-30" />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="text-sm bg-transparent border-none outline-none font-medium w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        {/* Trial Days Counter */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
           <Zap size={14} className="text-accent fill-accent" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-accent">12 Days Left in Trial</span>
        </div>

        <div className="flex items-center gap-6">
          <button className="p-3 rounded-2xl hover:bg-cream-dark transition-all relative group bg-white border border-border">
            <Bell size={20} className="text-navy opacity-60 group-hover:opacity-100" />
            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red rounded-full border-2 border-white animate-pulse"></span>
          </button>
          
          <div className="flex items-center gap-4 pl-6 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-bold text-navy">{storeName}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Pro Plan</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center text-white shadow-lg shadow-navy/20">
              <User size={24} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
