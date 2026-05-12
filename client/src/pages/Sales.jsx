import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Filter, RotateCcw, Trash2, Calendar, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Badge from '../components/UI/Badge';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Sales() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    customerId: ''
  });

  // Fetch Sales
  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales', filters],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/sales`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        params: filters
      });
      return data;
    }
  });

  // Delete Sale Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/sales/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
      toast.success('Sale deleted and stock restored');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to delete sale');
    }
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display italic">Daily Sales Log</h1>
          <p className="text-sm opacity-50 font-medium">Manage and track your account-based sales entries.</p>
        </div>
        <Button className="flex items-center gap-2 px-6 py-3">
          <Plus size={18} /> New Sales Entry
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="card flex gap-6 items-end bg-cream/30 border-dashed">
        <div className="flex-1">
          <Input 
            label="From Date" 
            type="date" 
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="bg-white"
          />
        </div>
        <div className="flex-1">
          <Input 
            label="To Date" 
            type="date" 
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="bg-white"
          />
        </div>
        <div className="flex gap-2 mb-1.25" style={{ marginBottom: '1.25rem' }}>
          <Button variant="outline" size="md" onClick={() => setFilters({ startDate: '', endDate: '', customerId: '' })} className="bg-white border-border">
            <RotateCcw size={16} /> Reset
          </Button>
          <Button variant="primary" size="md" className="px-8">
             <Filter size={16} /> Filter Results
          </Button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="card" style={{ padding: 0 }}>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-widest opacity-40 bg-cream/20">
              <th className="p-6">Date & Shift</th>
              <th className="p-6">Customer</th>
              <th className="p-6">Product Details</th>
              <th className="p-6">Quantity</th>
              <th className="p-6">Total Amount</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="p-12 text-center text-sm opacity-50">Loading sales records...</td></tr>
            ) : sales?.length === 0 ? (
              <tr><td colSpan="6" className="p-12 text-center text-sm opacity-50">No sales records found for this period.</td></tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-cream/30 transition-colors border-bottom">
                  <td className="p-6">
                    <p className="font-bold text-navy">{new Date(sale.sale_date).toLocaleDateString('en-IN')}</p>
                    <Badge variant="info" className="text-[8px] px-2 py-0.5 mt-1">{sale.shift}</Badge>
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-navy">{sale.customer_name}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-medium">{sale.product_name}</p>
                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">₹{sale.rate}/{sale.unit}</p>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-bold bg-navy/5 px-3 py-1 rounded-lg">{sale.qty} {sale.unit}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-lg font-display italic text-green">₹{sale.amount.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => {
                          if (confirm('Delete this entry? Stock will be restored.')) {
                            deleteMutation.mutate(sale.id);
                          }
                        }}
                        className="p-3 hover:bg-red/10 hover:text-red rounded-xl transition-all text-red/40"
                        title="Delete Entry"
                      >
                        <Trash2 size={18} />
                      </button>
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
