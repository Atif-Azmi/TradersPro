import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit2, Trash2, PackagePlus, AlertTriangle, Search, Filter, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Products() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      return data;
    }
  });

  // Calculate stats
  const stockValue = products?.reduce((acc, p) => acc + (p.stock * p.rate), 0) || 0;
  const lowStockCount = products?.filter(p => p.stock <= p.min_stock).length || 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display italic">Inventory Management</h1>
          <p className="text-sm opacity-50 font-medium">Track stock levels, rates, and material availability.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 shadow-lg">
          <Plus size={18} /> Add New Material
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6">
        <div className="card flex-1 bg-navy text-white relative overflow-hidden">
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">Total Inventory Value</p>
          <h3 className="text-4xl font-display italic mt-2">₹{stockValue.toLocaleString('en-IN')}</h3>
          <Package className="absolute right-[-10px] bottom-[-10px] opacity-10 text-white" size={100} />
        </div>
        <div className="card flex-1">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40">Unique Products</p>
          <h3 className="text-3xl font-display italic mt-1">{products?.length || 0}</h3>
          <p className="text-xs opacity-50 font-medium mt-2">Across 4 categories</p>
        </div>
        <div className="card flex-1" style={{ borderLeft: lowStockCount > 0 ? '4px solid var(--red)' : '' }}>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40">Low Stock Alerts</p>
          <h3 className="text-3xl font-display italic mt-1" style={{ color: lowStockCount > 0 ? 'var(--red)' : '' }}>
            {lowStockCount}
          </h3>
          <p className="text-xs opacity-50 font-medium mt-2">{lowStockCount > 0 ? 'Need urgent restock' : 'All stock levels healthy'}</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card" style={{ padding: 0 }}>
        <div className="p-6 border-bottom flex justify-between items-center bg-cream/30">
          <div className="flex gap-4 items-center flex-1">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name, category or unit..." 
                  className="input-field pl-12 py-3 text-sm"
                />
             </div>
             <Button variant="outline" className="px-4 py-3 border-border text-xs">
                <Filter size={16} /> Filters
             </Button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-widest opacity-40 bg-cream/20">
              <th className="p-6">Product Details</th>
              <th className="p-6">Category</th>
              <th className="p-6">Rate (₹)</th>
              <th className="p-6">Current Stock</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="p-12 text-center text-sm opacity-50">Loading your inventory...</td></tr>
            ) : products?.length === 0 ? (
              <tr><td colSpan="6" className="p-12 text-center text-sm opacity-50">No products found. Add your first material!</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-cream/30 transition-colors border-bottom">
                  <td className="p-6">
                    <p className="font-bold text-navy">{product.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">{product.unit}</p>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-medium px-3 py-1 bg-navy/5 rounded-full">{product.category}</span>
                  </td>
                  <td className="p-6 text-sm font-bold">₹{product.rate.toLocaleString('en-IN')}</td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold">{product.stock} {product.unit}</span>
                      <div className="w-24 h-1 bg-cream-dark rounded-full overflow-hidden">
                         <div 
                           className={`h-full ${product.stock <= product.min_stock ? 'bg-red' : 'bg-green'}`} 
                           style={{ width: `${Math.min((product.stock / (product.min_stock * 3)) * 100, 100)}%` }}
                         ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    {product.stock <= product.min_stock ? (
                      <Badge variant="danger">Low Stock</Badge>
                    ) : (
                      <Badge variant="success">Available</Badge>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2 justify-end">
                      <button className="p-2.5 hover:bg-navy hover:text-white rounded-xl transition-all text-navy/40" title="Adjust Stock">
                        <PackagePlus size={18} />
                      </button>
                      <button className="p-2.5 hover:bg-navy hover:text-white rounded-xl transition-all text-navy/40">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2.5 hover:bg-red/10 hover:text-red rounded-xl transition-all text-red/40">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className="p-6 flex justify-between items-center bg-cream/10">
           <p className="text-xs font-bold opacity-30 uppercase tracking-widest">Showing {products?.length || 0} products</p>
           <div className="flex gap-2">
              <Button variant="outline" className="text-[10px] px-3 py-1 opacity-50" disabled>Previous</Button>
              <Button variant="outline" className="text-[10px] px-3 py-1 opacity-50" disabled>Next</Button>
           </div>
        </div>
      </div>
    </div>
  );
}

