import React from 'react';
import { CheckCircle2, Zap, Star, ShieldCheck, ArrowRight, Shield } from 'lucide-react';
import Button from '../components/UI/Button';

export default function Subscription() {
  const plans = [
    {
      name: 'Essential',
      price: 'Free',
      desc: 'Perfect for small shops starting their digital journey.',
      features: ['Up to 100 Products', 'Customer Directory', 'Daily Sales Log', 'Basic Analytics'],
      button: 'Current Plan',
      current: true,
      popular: false
    },
    {
      name: 'Professional',
      price: '₹499',
      period: '/mo',
      desc: 'For growing businesses that need automation.',
      features: ['Everything in Free', 'WhatsApp Billing', 'PDF Invoices', 'Master Reports', 'Bulk Reminders'],
      button: 'Upgrade to Pro',
      current: false,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '₹1499',
      period: '/mo',
      desc: 'For large-scale operations and multiple branches.',
      features: ['Everything in Pro', 'AI Stock Predictions', 'Staff Accounts', 'Custom Branding', 'Priority Support'],
      button: 'Contact Sales',
      current: false,
      popular: false
    }
  ];

  return (
    <div className="flex flex-col gap-12 max-w-6xl m-auto py-12">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-5xl font-display italic text-navy">Simple, Scaleable Plans</h1>
        <p className="text-lg opacity-50 font-medium max-w-2xl m-auto">
          Start for free and upgrade as you grow. No hidden fees, no long-term contracts.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-10 items-stretch">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`card p-10 flex flex-col relative transition-all duration-500 ${plan.popular ? 'scale-110 shadow-3xl border-2 border-navy z-10' : 'hover:translate-y-[-8px]'}`}
            style={{ minHeight: '600px' }}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-navy text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Recommended
              </div>
            )}
            
            <div className="mb-10">
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${plan.popular ? 'text-accent' : 'opacity-40'}`}>
                {plan.name}
              </p>
              <h2 className="text-5xl font-display italic text-navy mb-4">
                {plan.price}
                {plan.period && <span className="text-sm font-body not-italic font-bold opacity-30"> {plan.period}</span>}
              </h2>
              <p className="text-sm font-medium opacity-50 leading-relaxed">
                {plan.desc}
              </p>
            </div>

            <ul className="flex-1 flex flex-col gap-6 mb-12">
               {plan.features.map((feature, j) => (
                 <li key={j} className="flex items-center gap-4">
                    <div className={`p-1 rounded-full ${plan.popular ? 'bg-accent/10 text-accent' : 'bg-green/10 text-green'}`}>
                       <CheckCircle2 size={16} />
                    </div>
                    <span className="text-sm font-bold opacity-70">{feature}</span>
                 </li>
               ))}
            </ul>

            <Button 
              variant={plan.popular ? 'primary' : 'outline'} 
              className={`w-full py-4 font-bold rounded-2xl ${plan.current ? 'opacity-50 cursor-default' : 'shadow-xl'}`}
              disabled={plan.current}
            >
              {plan.button}
            </Button>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="flex justify-center gap-16 py-12 border-t border-border mt-12 grayscale opacity-40">
         <div className="flex items-center gap-3">
            <ShieldCheck size={24} />
            <span className="text-xs font-bold uppercase tracking-widest">Secure Payments</span>
         </div>
         <div className="flex items-center gap-3">
            <Shield size={24} />
            <span className="text-xs font-bold uppercase tracking-widest">256-bit Encryption</span>
         </div>
         <div className="flex items-center gap-3">
            <Star size={24} />
            <span className="text-xs font-bold uppercase tracking-widest">Cancel Anytime</span>
         </div>
      </div>
    </div>
  );
}
