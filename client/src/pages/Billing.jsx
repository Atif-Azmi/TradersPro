import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FileText, Send, Download, MessageSquare, Printer, Loader2, Calendar, User, Search, Share2, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useAuth } from '../context/AuthContext';
import { openWhatsApp, billMessage } from '../utils/whatsapp';

const API_URL = import.meta.env.VITE_API_URL;

export default function Billing() {
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    customerId: '',
    startDate: '',
    endDate: ''
  });
  const [generatedBill, setGeneratedBill] = useState(null);

  // Generate Bill Mutation
  const generateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${API_URL}/billing/generate`, data, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      return res.data;
    },
    onSuccess: (data) => {
      setGeneratedBill(data);
      toast.success('Bill generated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to generate bill');
    }
  });

  const handleWhatsAppShare = () => {
    if (!generatedBill) return;
    const message = billMessage({
      storeName: session.user.user_metadata.store_name || 'TraderPro',
      customerName: generatedBill.customer_name,
      startDate: generatedBill.period_start,
      endDate: generatedBill.period_end,
      netPayable: generatedBill.net_payable,
      shortUrl: generatedBill.short_url
    });
    openWhatsApp('', message);
  };

  return (
    <div className="flex gap-8">
      {/* Criteria Panel */}
      <div style={{ width: '400px' }}>
        <div className="card sticky top-8">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-3 rounded-2xl bg-navy text-white">
                <FileText size={24} />
             </div>
             <h3 className="text-2xl font-display italic">Invoice Generator</h3>
          </div>
          
          <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); generateMutation.mutate(formData); }}>
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold uppercase tracking-widest opacity-40">Search Customer</label>
               <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                  <input placeholder="Select a customer..." className="input-field pl-12 py-3" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Period Start" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              <Input label="Period End" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
            </div>

            <div className="p-4 rounded-xl bg-navy/5 border border-navy/10 text-xs font-medium opacity-60 leading-relaxed">
              Generating a bill will compile all sales and payments for the selected period into a professional PDF.
            </div>

            <Button 
              type="submit"
              disabled={generateMutation.isPending}
              className="w-full mt-2 py-4 shadow-xl"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Generate Invoice
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Bill Preview */}
      <div className="flex-1">
        {generatedBill ? (
          <div className="card shadow-2xl p-0 overflow-hidden border-2 border-navy">
            <div className="p-6 bg-navy text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-display italic">Invoice Preview</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Ready to share</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-navy">
                  <Printer size={16} />
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-navy" onClick={() => window.open(generatedBill.pdf_url, '_blank')}>
                  <Download size={16} />
                </Button>
                <Button variant="whatsapp" size="sm" onClick={handleWhatsAppShare} className="px-6">
                  <Share2 size={16} />
                  Share on WhatsApp
                </Button>
              </div>
            </div>

            <div className="p-12 bg-white flex flex-col gap-12" style={{ minHeight: '600px' }}>
              {/* PDF Mockup Header */}
              <div className="flex justify-between items-start">
                 <div className="flex flex-col gap-1">
                    <h2 className="text-4xl font-display italic text-navy">{session.user.user_metadata.store_name || 'TraderPro'}</h2>
                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Hardware & Materials Dealer</p>
                 </div>
                 <div className="text-right text-xs font-medium opacity-60">
                    <p>Main Road, Sehore, MP</p>
                    <p>Phone: +91 98765 43210</p>
                    <p>GSTIN: 23ABCDE1234F1Z5</p>
                 </div>
              </div>

              <div className="flex justify-between items-end border-b-2 border-navy pb-8">
                 <div>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-2">Invoice To</p>
                    <h4 className="text-xl font-bold text-navy">{generatedBill.customer_name}</h4>
                    <p className="text-xs opacity-60">Regular Account Customer</p>
                 </div>
                 <div className="text-right">
                    <div className="flex gap-4 text-sm font-bold">
                       <span className="opacity-40 uppercase tracking-widest text-[10px]">Invoice Period</span>
                       <span>{generatedBill.period_start} → {generatedBill.period_end}</span>
                    </div>
                 </div>
              </div>

              <div className="flex-1">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                          <th className="pb-4">Date</th>
                          <th className="pb-4">Description</th>
                          <th className="pb-4 text-right">Debit</th>
                          <th className="pb-4 text-right">Credit</th>
                       </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                       <tr className="border-bottom">
                          <td className="py-4 opacity-40 italic">Previous Balance</td>
                          <td className="py-4 italic">B/F Outstanding</td>
                          <td className="py-4 text-right">₹5,400</td>
                          <td className="py-4 text-right">—</td>
                       </tr>
                       <tr className="border-bottom">
                          <td className="py-4">12 Jun 2026</td>
                          <td className="py-4">Sale: MS Pipe 2" (10 Qty)</td>
                          <td className="py-4 text-right">₹12,400</td>
                          <td className="py-4 text-right">—</td>
                       </tr>
                       <tr className="border-bottom">
                          <td className="py-4">14 Jun 2026</td>
                          <td className="py-4">Payment Recv: Cash</td>
                          <td className="py-4 text-right">—</td>
                          <td className="py-4 text-right text-green">₹10,000</td>
                       </tr>
                    </tbody>
                 </table>
              </div>

              <div className="flex justify-end">
                 <div className="w-64 flex flex-col gap-4">
                    <div className="flex justify-between text-xs font-bold opacity-40 uppercase">
                       <span>Total Debit</span>
                       <span>₹{generatedBill.total_sales.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold opacity-40 uppercase pb-4 border-bottom">
                       <span>Total Credit</span>
                       <span>₹{generatedBill.total_paid.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-navy text-white rounded-xl">
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Net Payable</span>
                       <span className="text-2xl font-display italic">₹{generatedBill.net_payable.toLocaleString('en-IN')}</span>
                    </div>
                 </div>
              </div>

              <div className="mt-12 p-6 bg-cream-dark/50 rounded-2xl flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-bold uppercase opacity-40 tracking-widest mb-1">Short Link (TinyURL)</p>
                    <p className="text-sm font-bold text-navy">{generatedBill.short_url}</p>
                 </div>
                 <Button variant="outline" size="sm" className="bg-white" onClick={() => { navigator.clipboard.writeText(generatedBill.short_url); toast.success('Link copied!'); }}>
                    Copy Link
                 </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center p-24 bg-cream/20 border-dashed">
            <div className="w-24 h-24 rounded-full bg-navy/5 flex items-center justify-center text-navy/20 mb-6">
              <FileText size={48} />
            </div>
            <h3 className="text-2xl font-display italic opacity-40">Ready to Invoice</h3>
            <p className="text-sm opacity-30 font-medium mt-2">Select a customer and period to generate a professional PDF bill.</p>
          </div>
        )}
      </div>
    </div>
  );
}
