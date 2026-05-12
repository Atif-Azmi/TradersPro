import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Save, Upload, User, Store, Shield, MapPin, Phone, Globe, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Settings() {
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    storeName: session?.user?.user_metadata?.store_name || '',
    tagline: 'M.S. Pipe, Cast Iron, GI Sheet, Angle Patti, Channel',
    address: '',
    phone: '',
    phone2: '',
    gstNumber: '',
    logoUrl: ''
  });

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display italic">Business Settings</h1>
          <p className="text-sm opacity-50 font-medium">Configure your store profile and billing details.</p>
        </div>
        <Button className="flex items-center gap-2 px-8 py-3 shadow-xl">
          <Save size={18} /> Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 flex flex-col gap-8">
          {/* General Profile */}
          <div className="card">
            <div className="flex items-center gap-3 mb-8 border-bottom pb-4">
              <Store size={20} className="text-navy" />
              <h3 className="text-xl font-display italic">Store Profile</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Input label="Business Name" value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Input label="Business Tagline / Catchphrase" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Input label="Full Business Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <Input label="Primary Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <Input label="Secondary Phone" value={formData.phone2} onChange={e => setFormData({...formData, phone2: e.target.value})} />
              <Input label="GST / Tax Number" placeholder="23ABCDE1234F1Z5" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} />
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <div className="flex items-center gap-3 mb-8 border-bottom pb-4">
              <Shield size={20} className="text-navy" />
              <h3 className="text-xl font-display italic">Security & Account</h3>
            </div>
            <div className="flex justify-between items-center p-4 bg-cream/30 rounded-2xl border border-navy/5">
              <div>
                <p className="text-sm font-bold">Change Password</p>
                <p className="text-xs opacity-50 font-medium">Update your account access credentials.</p>
              </div>
              <Button variant="outline" size="sm" className="bg-white px-6">Update</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
           {/* Logo Upload */}
           <div className="card text-center">
             <div className="flex items-center gap-3 mb-8 border-bottom pb-4 text-left">
               <ImageIcon size={20} className="text-navy" />
               <h3 className="text-xl font-display italic">Store Logo</h3>
             </div>
             <div className="w-32 h-32 rounded-[24px] bg-cream-dark/50 border-2 border-dashed border-navy/10 m-auto flex items-center justify-center text-navy/20 mb-6">
                <Upload size={32} />
             </div>
             <p className="text-xs font-bold opacity-40 uppercase tracking-widest mb-6">Upload PNG or JPG <br/> (Max 2MB)</p>
             <Button variant="outline" className="w-full py-3 bg-white border-border text-xs">
                Browse Files
             </Button>
           </div>

           {/* Current Plan */}
           <div className="card bg-navy text-white relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Current Plan</p>
                <h4 className="text-2xl font-display italic mb-4">Professional</h4>
                <div className="p-3 bg-white/10 rounded-xl text-xs font-medium mb-6">
                   Your trial expires in 12 days.
                </div>
                <Button variant="accent" className="w-full py-3 bg-white text-accent hover:bg-cream border-none font-bold text-xs uppercase tracking-widest">
                   Manage Plan
                </Button>
             </div>
             <Store size={80} className="absolute right-[-20px] bottom-[-20px] opacity-10" />
           </div>
        </div>
      </div>
    </div>
  );
}
