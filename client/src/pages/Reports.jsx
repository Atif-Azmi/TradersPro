import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BarChart3, FileText, Download, Share2, Calendar, Filter, Star, Loader2, Search } from 'lucide-react';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Reports() {
  const { session } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display italic text-navy">Business Intelligence & Reports</h1>
          <p className="text-sm opacity-50 font-medium">Analyze your store's growth and generate master tax reports.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="bg-white border-border">
              <Calendar size={18} /> Last 30 Days
           </Button>
           <Button variant="primary" className="shadow-xl">
              <FileText size={18} /> Generate Master PDF
           </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column: Report Controls */}
        <div className="col-span-1 flex flex-col gap-8">
          <div className="card h-full">
            <h3 className="text-xl font-display italic mb-8 border-bottom pb-4">Report Builder</h3>
            <form className="flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold uppercase tracking-widest opacity-40">Report Type</label>
                 <select className="input-field py-3 text-sm font-bold">
                    <option>Sales & Tax Summary</option>
                    <option>Customer Aging Report</option>
                    <option>Inventory Valuation</option>
                    <option>Collection Efficiency</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40">Start Date</label>
                    <input type="date" className="input-field py-3 text-xs" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40">End Date</label>
                    <input type="date" className="input-field py-3 text-xs" />
                  </div>
               </div>
               <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10">
                  <div className="flex gap-3 items-center mb-2">
                     <Star size={16} className="text-accent fill-accent" />
                     <span className="text-xs font-bold uppercase tracking-widest text-accent">Pro Tip</span>
                  </div>
                  <p className="text-[10px] font-medium leading-relaxed opacity-60">
                    Master reports include a full breakdown of all GST categories and HSN summaries.
                  </p>
               </div>
               <Button variant="primary" className="w-full py-4 mt-4 shadow-xl">
                  Run Analytical Report
               </Button>
            </form>
          </div>
        </div>

        {/* Right Column: History & Templates */}
        <div className="col-span-2 flex flex-col gap-8">
          <div className="card" style={{ padding: 0 }}>
             <div className="p-6 border-bottom bg-cream/30 flex justify-between items-center">
                <h3 className="text-xl font-display italic">Report History</h3>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20" size={14} />
                      <input placeholder="Search past reports..." className="bg-white border border-border text-[10px] pl-8 py-2 rounded-xl outline-none" />
                   </div>
                </div>
             </div>
             <table className="w-full text-left">
                <thead>
                   <tr className="text-[10px] font-bold uppercase tracking-widest opacity-40 bg-cream/20">
                      <th className="p-6">Report Name</th>
                      <th className="p-6">Period</th>
                      <th className="p-6">Status</th>
                      <th className="p-6 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody>
                   <tr className="hover:bg-cream/30 border-bottom">
                      <td className="p-6">
                         <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-navy/5 text-navy">
                               <BarChart3 size={18} />
                            </div>
                            <span className="text-sm font-bold">Sales_Summary_June.pdf</span>
                         </div>
                      </td>
                      <td className="p-6 text-xs font-medium opacity-50">01 Jun → 30 Jun 2026</td>
                      <td className="p-6">
                         <Badge variant="success">READY</Badge>
                      </td>
                      <td className="p-6">
                         <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" className="bg-white border-border">
                               <Download size={14} />
                            </Button>
                            <Button variant="whatsapp" size="sm">
                               <Share2 size={14} />
                            </Button>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table>
             <div className="p-12 text-center opacity-30">
                <FileText size={48} className="m-auto mb-4" />
                <p className="text-sm font-medium">No other reports generated yet.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
