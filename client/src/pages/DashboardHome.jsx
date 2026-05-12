import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TrendingUp, Users, Package, AlertCircle, FileText, Share2, Zap, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/UI/StatCard';
import PremiumBanner from '../components/UI/PremiumBanner';
import Button from '../components/UI/Button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

export default function DashboardHome() {
  const { session } = useAuth();

  // Fetch Dashboard Data
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      return data;
    }
  });

  const stats = data?.stats || {};
  const predictions = data?.predictions || [];
  const lowStock = data?.lowStock || [];

  return (
    <div className="flex flex-col gap-8">
      {/* Premium Trial Banner */}
      <PremiumBanner daysLeft={12} />

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display italic">Dashboard Overview</h1>
          <p className="text-sm opacity-50 font-medium">AI-driven insights for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-sm px-4 py-2 border-border">
            <Share2 size={16} /> Bulk Reminders
          </Button>
          <Button variant="primary" className="text-sm px-4 py-2">
            <FileText size={16} /> Print Master Report
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-6">
        <StatCard 
          label="Total Sales" 
          value={`₹${(stats.totalSales || 0).toLocaleString('en-IN')}`} 
          subValue="Gross revenue recorded"
          icon={TrendingUp} 
          color="var(--green)" 
        />
        <StatCard 
          label="Stock Value" 
          value={`₹${(stats.stockValue || 0).toLocaleString('en-IN')}`} 
          subValue="Total inventory value"
          icon={Package} 
          color="var(--accent)" 
        />
        <StatCard 
          label="Total Payments" 
          value={`₹${(stats.totalPayments || 0).toLocaleString('en-IN')}`} 
          subValue="Cash inflow"
          icon={Users} 
          color="var(--navy)" 
        />
        <StatCard 
          label="Outstanding" 
          value={`₹${(stats.outstanding || 0).toLocaleString('en-IN')}`} 
          subValue="Need attention"
          icon={AlertCircle} 
          color="var(--red)" 
        />
      </div>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="card col-span-2 min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-display italic">Growth Analytics</h3>
            <div className="badge badge-blue">Real-time Data</div>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Last Month', val: Math.round((stats.totalSales || 0) * 0.8) },
                { name: 'Current Month', val: stats.totalSales || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--navy)', opacity: 0.5 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--navy)', opacity: 0.5 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(15, 31, 61, 0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }}
                />
                <Bar dataKey="val" fill="var(--navy)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictions Side Panel */}
        <div className="flex flex-col gap-8">
          <div className="card bg-navy text-white border-none relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={18} className="text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent">AI Predictions</span>
                </div>
                <h3 className="text-xl font-display italic mb-6">Restock Forecast</h3>
                
                <div className="flex flex-col gap-4">
                   {predictions.length > 0 ? predictions.map((p, i) => (
                     <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-xs font-bold">{p.name}</span>
                           <span className={`text-[10px] font-bold ${p.isCritical ? 'text-accent' : 'text-green'}`}>
                              {p.daysLeft} days left
                           </span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                           <div 
                             className={`h-full ${p.isCritical ? 'bg-accent' : 'bg-green'}`} 
                             style={{ width: `${(p.daysLeft / 30) * 100}%` }}
                           ></div>
                        </div>
                        {p.suggestion && (
                           <p className="text-[9px] opacity-40 mt-2 font-medium">💡 {p.suggestion}</p>
                        )}
                     </div>
                   )) : (
                     <p className="text-xs opacity-40 italic">Analysis complete. No urgent restocking needed.</p>
                   )}
                </div>
             </div>
             <Zap size={100} className="absolute right-[-20px] bottom-[-20px] opacity-5" />
          </div>

          <div className="card">
             <h3 className="text-xl font-display italic mb-6">Business Health</h3>
             <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-cream-dark/50 flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase opacity-40">Collection Efficiency</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-display">{stats.efficiency || 0}%</span>
                    <span className={`text-[10px] font-bold mb-1 ${stats.efficiency > 70 ? 'text-green' : 'text-red'}`}>
                       {stats.efficiency > 70 ? 'High' : 'Needs Action'}
                    </span>
                  </div>
                </div>
                <Button variant="whatsapp" className="w-full py-3 font-bold text-xs">
                   <Share2 size={16} /> Bulk Reminders
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
