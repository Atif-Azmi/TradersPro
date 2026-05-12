import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IndianRupee, History, Plus, MessageSquare, Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Advances() {
  const { session } = useAuth();

  // Fetch Customers with balances
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      return data;
    }
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display italic">Advances & Dues</h1>
          <p className="text-sm opacity-50 font-medium">Track customer payments and manage outstanding balances.</p>
        </div>
        <Button className="flex items-center gap-2 px-6 py-3">
          <Plus size={18} /> Record New Payment
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-6">
        <div className="card flex-1">
           <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-40">Total Dues</span>
              <div className="p-2 bg-red/10 text-red rounded-lg"><ArrowUpRight size={16} /></div>
           </div>
           <h3 className="text-3xl font-display italic text-red">₹26,300</h3>
           <p className="text-xs font-medium opacity-50 mt-1">From 14 customers</p>
        </div>
        <div className="card flex-1">
           <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-40">Total Advances</span>
              <div className="p-2 bg-green/10 text-green rounded-lg"><ArrowDownLeft size={16} /></div>
           </div>
           <h3 className="text-3xl font-display italic text-green">₹5,200</h3>
           <p className="text-xs font-medium opacity-50 mt-1">From 3 customers</p>
        </div>
        <div className="card flex-1 border-navy/20 bg-cream/30">
           <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-40">Net Outstanding</span>
           </div>
           <h3 className="text-3xl font-display italic text-navy">₹21,100</h3>
           <p className="text-xs font-medium opacity-50 mt-1">Estimated collection time: 14 days</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="p-6 border-bottom bg-cream/30 flex justify-between items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input 
              type="text" 
              placeholder="Filter by customer name..." 
              className="input-field pl-12 py-3"
            />
          </div>
          <Button variant="outline" size="sm" className="bg-white border-border px-4 py-2 text-[10px] uppercase font-bold tracking-widest">
             <Filter size={14} /> Filter Dues
          </Button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-widest opacity-40 bg-cream/20">
              <th className="p-6">Customer</th>
              <th className="p-6">Total Billing</th>
              <th className="p-6">Amount Received</th>
              <th className="p-6">Status</th>
              <th className="p-6">Net Balance</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="p-12 text-center text-sm opacity-50">Calculating balances...</td></tr>
            ) : (
              customers?.filter(c => c.balance !== 0).map((customer) => (
                <tr key={customer.id} className="hover:bg-cream/30 transition-colors border-bottom">
                  <td className="p-6">
                    <p className="font-bold text-navy">{customer.name}</p>
                    <p className="text-xs opacity-40 font-medium">{customer.phone}</p>
                  </td>
                  <td className="p-6 text-sm font-medium">₹{customer.total_sales.toLocaleString('en-IN')}</td>
                  <td className="p-6 text-sm font-medium">₹{customer.total_paid.toLocaleString('en-IN')}</td>
                  <td className="p-6">
                    {customer.balance > 0 ? (
                      <Badge variant="danger">OUTSTANDING</Badge>
                    ) : (
                      <Badge variant="success">ADVANCE</Badge>
                    )}
                  </td>
                  <td className="p-6">
                    <span className={`text-lg font-display italic ${customer.balance > 0 ? 'text-red' : 'text-green'}`}>
                       ₹{Math.abs(customer.balance).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2 justify-end">
                      <Button variant="whatsapp" size="sm" className="p-2.5 rounded-xl">
                        <MessageSquare size={16} />
                      </Button>
                      <Button variant="outline" size="sm" className="p-2.5 rounded-xl bg-white border-border text-navy hover:bg-navy hover:text-white transition-all">
                        <IndianRupee size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
