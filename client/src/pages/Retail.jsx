import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ShoppingBag, CreditCard, Banknote, Plus, History, Search, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Retail() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    productId: '',
    qty: 1,
    rate: 0,
    paymentMode: 'Cash'
  });

  // Fetch Products for dropdown
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      return data;
    }
  });

  return (
    <div className="flex gap-8">
      {/* Entry Panel */}
      <div style={{ width: '450px' }}>
        <div className="card h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-accent/10 text-accent">
               <ShoppingBag size={24} />
            </div>
            <h2 className="text-2xl font-display italic">New Retail Sale</h2>
          </div>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold uppercase tracking-widest opacity-40">Select Material</label>
               <select 
                 className="input-field py-3 text-sm font-medium"
                 onChange={(e) => {
                   const p = products.find(x => x.id === e.target.value);
                   setFormData({ ...formData, productId: e.target.value, rate: p?.rate || 0 });
                 }}
               >
                 <option value="">Choose a product...</option>
                 {products?.map(p => (
                   <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock} {p.unit})</option>
                 ))}
               </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Input label="Quantity" type="number" min="1" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} />
              </div>
              <div className="flex-1">
                <Input label="Rate (₹)" type="number" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-cream-dark/50 border border-navy/5">
               <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Order Summary</p>
               <div className="flex justify-between items-end">
                  <span className="text-sm font-medium opacity-60">Total Payable</span>
                  <span className="text-4xl font-display italic text-navy">₹{(formData.qty * formData.rate).toLocaleString('en-IN')}</span>
               </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-40">Payment Mode</label>
              <div className="flex gap-3">
                 {['Cash', 'UPI/Online', 'Cheque'].map(mode => (
                   <button 
                     key={mode}
                     type="button"
                     onClick={() => setFormData({ ...formData, paymentMode: mode })}
                     className={`flex-1 py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                       formData.paymentMode === mode 
                       ? 'border-navy bg-navy text-white shadow-lg scale-105' 
                       : 'border-border text-navy/40 hover:border-navy/20'
                     }`}
                   >
                     {mode === 'Cash' && <Banknote size={18} />}
                     {mode === 'UPI/Online' && <CreditCard size={18} />}
                     {mode === 'Cheque' && <History size={18} />}
                     {mode}
                   </button>
                 ))}
              </div>
            </div>

            <Button variant="primary" className="w-full py-4 rounded-xl shadow-xl mt-4 font-bold flex items-center justify-center gap-2">
               Complete Sale <ArrowRight size={18} />
            </Button>
          </form>
        </div>
      </div>

      {/* Today's Summary & History */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex gap-6">
           <div className="card flex-1">
              <p className="text-xs font-bold uppercase opacity-40 mb-2">Today's Cash</p>
              <h3 className="text-3xl font-display italic text-green">₹12,400</h3>
           </div>
           <div className="card flex-1">
              <p className="text-xs font-bold uppercase opacity-40 mb-2">Today's Online</p>
              <h3 className="text-3xl font-display italic text-navy">₹8,120</h3>
           </div>
        </div>

        <div className="card flex-1" style={{ padding: 0 }}>
          <div className="p-6 border-bottom bg-cream/30 flex justify-between items-center">
             <h3 className="text-xl font-display italic">Recent Retail Sales</h3>
             <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-widest border-border px-4">
                View All
             </Button>
          </div>
          <div className="p-12 text-center opacity-30">
             <History size={64} className="m-auto mb-4" />
             <p className="font-medium">No retail sales recorded yet today.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
