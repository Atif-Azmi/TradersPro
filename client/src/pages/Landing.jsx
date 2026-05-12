import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  ChevronRight,
  ArrowRight,
  FileText,
  Star,
  Users,
  TrendingUp,
  Share2
} from 'lucide-react';
import Button from '../components/UI/Button';

export default function Landing() {
  const features = [
    { icon: BarChart3, title: 'Smart Dashboard', desc: 'Real-time sales, inventory, and outstanding tracking.', premium: false },
    { icon: MessageSquare, title: 'WhatsApp Billing', desc: 'Send professional bills & reminders directly to WhatsApp.', premium: true },
    { icon: ShieldCheck, title: 'Secure Backups', desc: 'Your data is safe with Supabase cloud storage & encryption.', premium: false },
    { icon: Zap, title: 'Quick Entry', desc: 'Log sales and deduct stock in seconds with our optimized UI.', premium: true },
    { icon: Smartphone, title: 'Mobile Ready', desc: 'Manage your business from anywhere, on any device.', premium: false },
    { icon: CheckCircle2, title: 'GST Ready', desc: 'Generate GST-compliant invoices and reports easily.', premium: true },
    { icon: FileText, title: 'Master Reports', desc: 'Generate multi-page PDF reports for your entire business.', premium: true },
    { icon: Star, title: 'AI Predictions', desc: 'Predict when you need to restock your materials.', premium: true },
    { icon: Users, title: 'Staff Accounts', desc: 'Invite employees with restricted access roles.', premium: true },
  ];

  return (
    <div className="landing-page font-body">
      {/* Navbar */}
      <nav className="landing-nav flex justify-between items-center p-8 m-auto sticky top-0 bg-white/80 backdrop-blur-md z-50" style={{ maxWidth: '1400px' }}>
        <h1 className="text-3xl font-display italic text-navy">TraderPro</h1>
        <div className="flex gap-12 items-center">
          <div className="flex gap-8">
            <a href="#features" className="text-sm font-medium hover:text-accent transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-accent transition-colors">Pricing</a>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-sm font-bold text-navy hover:text-accent">Login</Link>
            <Link to="/signup">
              <Button variant="primary" className="text-sm px-6">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero text-center flex flex-col items-center gap-8 p-12" style={{ marginTop: '4rem' }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 text-accent border border-accent/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">The #1 Choice for Hardware Traders 🏭</span>
        </div>

        <h2 className="text-7xl font-display italic" style={{ maxWidth: '900px', lineHeight: 1.05 }}>
          Manage your Hardware Store with <span className="text-accent">Precision.</span>
        </h2>
        
        <p className="text-xl opacity-70 font-medium" style={{ maxWidth: '700px' }}>
          Streamline your MS Pipe, Iron, and Sheet business with TraderPro. Automated billing, WhatsApp sharing, and real-time inventory.
        </p>

        <div className="flex gap-6 mt-4">
          <Link to="/signup">
            <Button variant="primary" className="btn-lg px-10 py-5 rounded-2xl shadow-xl hover:translate-y-[-2px]">
              Start Free Trial <ChevronRight size={20} />
            </Button>
          </Link>
          <Button variant="outline" className="btn-lg px-10 py-5 rounded-2xl border-2 hover:bg-cream">
            View Demo
          </Button>
        </div>
        
        {/* Dashboard Mockup */}
        <div className="hero-mockup mt-16 p-4 rounded-[32px] bg-navy/5 border border-navy/10 relative" style={{ maxWidth: '1100px', width: '100%' }}>
          <div className="rounded-[24px] overflow-hidden shadow-2xl border border-navy/20 bg-white">
            <div className="mockup-header p-4 bg-navy flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red/80"></div>
                <div className="w-3 h-3 rounded-full bg-gold/80"></div>
                <div className="w-3 h-3 rounded-full bg-green/80"></div>
              </div>
              <div className="text-[10px] text-white/30 font-mono">TRADERPRO-DASHBOARD-V1.0</div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80&w=2000" 
              alt="Dashboard Mockup" 
              className="w-full grayscale-[0.5] opacity-90"
              style={{ height: '550px', objectFit: 'cover' }}
            />
          </div>
          {/* Floating Card */}
          <div className="absolute bottom-[-40px] right-[-40px] card p-6 w-80 shadow-2xl animate-float">
             <div className="flex justify-between items-center mb-4">
               <span className="text-xs font-bold opacity-40">REVENUE GROWTH</span>
               <TrendingUp size={16} className="text-green" />
             </div>
             <div className="text-3xl font-display italic">₹1,24,500</div>
             <div className="text-xs text-green font-bold mt-1">+12.5% from last month</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar py-24 border-bottom">
        <div className="m-auto text-center" style={{ maxWidth: '1200px' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-12">Trusted by Traders from</p>
          <div className="flex justify-around items-center grayscale opacity-50">
             <span className="text-2xl font-display italic">Sehore</span>
             <span className="text-2xl font-display italic">Bhopal</span>
             <span className="text-2xl font-display italic">Indore</span>
             <span className="text-2xl font-display italic">Dewas</span>
             <span className="text-2xl font-display italic">Vidisha</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features py-32 m-auto" style={{ maxWidth: '1300px' }}>
        <div className="text-center mb-24">
          <span className="text-accent text-sm font-bold uppercase tracking-widest">Capabilities</span>
          <h3 className="text-5xl font-display italic mt-4 mb-6">Everything you need to grow</h3>
          <p className="text-lg opacity-50 max-w-2xl m-auto font-medium">Powerful features tailored for modern material traders, built to handle complex inventories and billing.</p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="card p-10 hover:border-accent hover:translate-y-[-4px] transition-all cursor-default group relative overflow-hidden">
              {f.premium && (
                <div className="absolute top-4 right-4 badge badge-amber text-[10px]">Premium</div>
              )}
              <div className="p-4 rounded-2xl bg-navy/5 text-navy mb-8 inline-block group-hover:bg-navy group-hover:text-white transition-colors">
                <f.icon size={28} />
              </div>
              <h4 className="text-2xl font-display italic mb-4">{f.title}</h4>
              <p className="text-sm opacity-60 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp Feature Focus */}
      <section className="wa-promo py-32 bg-navy relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white rounded-full"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full"></div>
        </div>
        <div className="m-auto flex gap-24 items-center relative z-10" style={{ maxWidth: '1200px' }}>
          <div className="flex-1">
             <span className="badge badge-amber mb-6 px-4 py-2">Premium Experience</span>
             <h3 className="text-6xl text-white font-display italic mb-8" style={{ lineHeight: 1.1 }}>WhatsApp Billing <br/> & Reminders</h3>
             <p className="text-xl text-white/60 mb-12 font-medium leading-relaxed">
               Send professional PDF bills and payment reminders directly to your customers' WhatsApp. No more manual messages or lost paper slips.
             </p>
             <div className="flex flex-col gap-6">
               <div className="flex items-center gap-4 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-accent transition-colors">
                   <FileText size={20} />
                 </div>
                 <span className="text-lg text-white font-medium">Automatic PDF generation on request</span>
               </div>
               <div className="flex items-center gap-4 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-accent transition-colors">
                   <Zap size={20} />
                 </div>
                 <span className="text-lg text-white font-medium">Short URL generation via TinyURL</span>
               </div>
               <div className="flex items-center gap-4 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-accent transition-colors">
                   <MessageSquare size={20} />
                 </div>
                 <span className="text-lg text-white font-medium">Pre-filled polite reminder templates</span>
               </div>
             </div>
          </div>
          <div className="flex-1 relative">
            <div className="card bg-white flex flex-col gap-4 p-8 m-auto shadow-2xl" style={{ maxWidth: '350px', borderRadius: '40px', border: '8px solid var(--navy-mid)' }}>
               <div className="flex gap-4 items-center border-bottom pb-6">
                 <div className="w-12 h-12 rounded-full bg-green text-white flex items-center justify-center font-bold text-xl">F</div>
                 <div>
                   <p className="text-sm font-bold text-navy">FKS Traders</p>
                   <p className="text-xs text-green font-bold">Online</p>
                 </div>
               </div>
               <div className="p-4 bg-[#e7fceb] rounded-2xl text-xs font-medium leading-relaxed" style={{ borderBottomLeftRadius: 0 }}>
                  Dear Rahul Construction, Greetings from *FKS Traders*! 🏭 Please find your bill for June 2026 linked below...
               </div>
               <div className="p-4 border-2 border-dashed border-navy/10 rounded-2xl bg-cream/30 flex gap-4 items-center">
                 <div className="p-3 bg-red/10 rounded-xl text-red">
                   <FileText size={28} />
                 </div>
                 <div className="flex-1">
                   <p className="text-xs font-bold text-navy">Bill_Rahul_1205.pdf</p>
                   <p className="text-[10px] opacity-40 font-bold uppercase">452 KB • PDF DOCUMENT</p>
                 </div>
               </div>
               <div className="p-3 bg-blue/5 rounded-xl text-[10px] text-blue-600 font-bold truncate">
                  https://tinyurl.com/fks-bill-921
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing py-32 m-auto" style={{ maxWidth: '1300px' }}>
        <div className="text-center mb-24">
          <h3 className="text-5xl font-display italic mb-6">Simple, Transparent Pricing</h3>
          <p className="text-lg opacity-50 font-medium">Choose the plan that fits your business size.</p>
        </div>
        <div className="flex gap-12 justify-center items-stretch">
          <div className="card p-12 flex-1 flex flex-col hover:border-navy transition-all" style={{ maxWidth: '400px' }}>
             <p className="font-bold text-navy/30 mb-2 uppercase text-xs tracking-widest">Essential</p>
             <h4 className="text-5xl font-display italic mb-8">Free</h4>
             <p className="text-sm opacity-60 mb-12 font-medium">Perfect for small startups and trial.</p>
             <ul className="text-sm flex flex-col gap-6 mb-12 flex-1">
               <li className="flex items-center gap-3 font-medium"><CheckCircle2 size={18} className="text-green" /> Up to 100 Products</li>
               <li className="flex items-center gap-3 font-medium"><CheckCircle2 size={18} className="text-green" /> Customer Directory</li>
               <li className="flex items-center gap-3 font-medium"><CheckCircle2 size={18} className="text-green" /> Daily Sales Log</li>
               <li className="flex items-center gap-3 font-medium opacity-30"><ShieldCheck size={18} /> WhatsApp Billing</li>
             </ul>
             <Button variant="outline" className="w-full py-4 rounded-xl border-2">Get Started</Button>
          </div>

          <div className="card p-12 flex-1 flex flex-col relative scale-110 shadow-2xl" style={{ maxWidth: '400px', border: '3px solid var(--navy)' }}>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-navy text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
             <p className="font-bold text-accent mb-2 uppercase text-xs tracking-widest">Professional</p>
             <h4 className="text-5xl font-display italic mb-8">₹499<span className="text-sm opacity-50 font-body not-italic font-bold"> / mo</span></h4>
             <p className="text-sm opacity-60 mb-12 font-medium">For growing hardware businesses.</p>
             <ul className="text-sm flex flex-col gap-6 mb-12 flex-1">
               <li className="flex items-center gap-3 font-bold"><Zap size={18} className="text-accent fill-accent" /> Unlimited Products</li>
               <li className="flex items-center gap-3 font-bold"><Zap size={18} className="text-accent fill-accent" /> WhatsApp Billing</li>
               <li className="flex items-center gap-3 font-bold"><Zap size={18} className="text-accent fill-accent" /> PDF Invoicing</li>
               <li className="flex items-center gap-3 font-bold"><Zap size={18} className="text-accent fill-accent" /> Master Reports</li>
               <li className="flex items-center gap-3 font-bold"><Zap size={18} className="text-accent fill-accent" /> Bulk WA Reminders</li>
             </ul>
             <Button variant="primary" className="w-full py-4 rounded-xl shadow-lg">Upgrade Now</Button>
          </div>

          <div className="card p-12 flex-1 flex flex-col hover:border-navy transition-all" style={{ maxWidth: '400px' }}>
             <p className="font-bold text-navy/30 mb-2 uppercase text-xs tracking-widest">Enterprise</p>
             <h4 className="text-5xl font-display italic mb-8">₹1499<span className="text-sm opacity-50 font-body not-italic font-bold"> / mo</span></h4>
             <p className="text-sm opacity-60 mb-12 font-medium">For large-scale operations.</p>
             <ul className="text-sm flex flex-col gap-6 mb-12 flex-1">
               <li className="flex items-center gap-3 font-medium"><CheckCircle2 size={18} className="text-green" /> Multi-User Access</li>
               <li className="flex items-center gap-3 font-medium"><CheckCircle2 size={18} className="text-green" /> AI Stock Predictions</li>
               <li className="flex items-center gap-3 font-medium"><CheckCircle2 size={18} className="text-green" /> Custom Branding</li>
               <li className="flex items-center gap-3 font-medium"><CheckCircle2 size={18} className="text-green" /> Priority Support</li>
             </ul>
             <Button variant="outline" className="w-full py-4 rounded-xl border-2">Contact Sales</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white pt-32 pb-12 overflow-hidden relative">
        <div className="m-auto flex justify-between items-start mb-24 relative z-10" style={{ maxWidth: '1300px' }}>
          <div>
            <h4 className="text-4xl font-display italic mb-8">TraderPro</h4>
            <p className="text-white/40 text-sm font-medium" style={{ maxWidth: '350px', lineHeight: 1.8 }}>
              The complete business management suite for modern hardware traders. Streamline your operations, automate your billing, and grow your revenue.
            </p>
          </div>
          <div className="flex gap-32">
            <div className="flex flex-col gap-6">
              <p className="font-bold text-xs uppercase tracking-widest text-accent">Product</p>
              <a className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Features</a>
              <a className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Pricing</a>
              <a className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Security</a>
              <a className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">API</a>
            </div>
            <div className="flex flex-col gap-6">
              <p className="font-bold text-xs uppercase tracking-widest text-accent">Company</p>
              <a className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">About Us</a>
              <a className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Contact</a>
              <a className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Privacy</a>
              <a className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Terms</a>
            </div>
          </div>
        </div>
        <div className="m-auto flex justify-between items-center border-t border-white/5 pt-12 relative z-10" style={{ maxWidth: '1300px' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">© 2026 TraderPro Systems. All rights reserved.</p>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors cursor-pointer"><Share2 size={14} /></div>
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors cursor-pointer"><MessageSquare size={14} /></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
