import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Search, MessageSquare, IndianRupee, FileText, UserPlus, Phone } from 'lucide-react';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { useAuth } from '../context/AuthContext';
import { openWhatsApp, reminderMessage } from '../utils/whatsapp';

const API_URL = import.meta.env.VITE_API_URL;

export default function Customers() {
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Customers
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      return data;
    }
  });

  const handleRemind = (customer) => {
    const message = reminderMessage({
      storeName: session.user.user_metadata.store_name || 'TraderPro',
      customerName: customer.name,
      dueAmount: customer.balance || 0
    });
    openWhatsApp(customer.phone, message);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display italic">Customer Directory</h1>
          <p className="text-sm opacity-50 font-medium">Manage your relationships and track outstanding dues.</p>
        </div>
        <Button className="flex items-center gap-2 px-6 py-3">
          <UserPlus size={18} /> Add New Customer
        </Button>
      </div>

      {/* Main Content */}
      <div className="card" style={{ padding: 0 }}>
        <div className="p-6 border-bottom bg-cream/30 flex justify-between items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone or address..." 
              className="input-field pl-12 py-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
             <div className="text-right">
               <p className="text-[10px] font-bold uppercase opacity-40">Total Receivables</p>
               <p className="text-xl font-display italic text-red">₹26,300</p>
             </div>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-widest opacity-40 bg-cream/20">
              <th className="p-6">Customer Details</th>
              <th className="p-6">Total Sales</th>
              <th className="p-6">Total Paid</th>
              <th className="p-6">Current Balance</th>
              <th className="p-6 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="p-12 text-center text-sm opacity-50">Fetching your customers...</td></tr>
            ) : (
              customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-cream/30 transition-colors border-bottom">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-navy">{customer.name}</p>
                        <div className="flex items-center gap-2 opacity-50">
                          <Phone size={10} />
                          <span className="text-xs font-medium">{customer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-medium">₹{(customer.total_sales || 0).toLocaleString('en-IN')}</td>
                  <td className="p-6 text-sm font-medium text-green">₹{(customer.total_paid || 0).toLocaleString('en-IN')}</td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm font-bold ${customer.balance > 0 ? 'text-red' : 'text-green'}`}>
                        ₹{(customer.balance || 0).toLocaleString('en-IN')}
                      </span>
                      {customer.balance > 0 ? (
                        <Badge variant="danger" className="text-[8px] px-2 py-0.5">DUE</Badge>
                      ) : (
                        <Badge variant="success" className="text-[8px] px-2 py-0.5">CLEAR</Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="whatsapp" 
                        size="sm" 
                        onClick={() => handleRemind(customer)}
                        className="p-2.5 rounded-xl"
                      >
                        <MessageSquare size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="p-2.5 rounded-xl border-border hover:bg-navy hover:text-white transition-all"
                        title="Add Payment"
                      >
                        <IndianRupee size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="p-2.5 rounded-xl border-border hover:bg-navy hover:text-white transition-all"
                        title="Generate Bill"
                      >
                        <FileText size={16} />
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
