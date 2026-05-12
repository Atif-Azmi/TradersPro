import React from 'react';
import { Star } from 'lucide-react';
import Button from './Button';

const PremiumBanner = ({ daysLeft }) => {
  return (
    <div className="premium-banner flex justify-between items-center px-8 py-4 rounded-2xl mb-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-xl">
          <Star className="text-white fill-white" size={20} />
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold">Free Trial Active</h3>
          <p className="text-white/80 text-sm">You have {daysLeft} days left in your Pro trial. Upgrade now to keep premium features!</p>
        </div>
      </div>
      <Button variant="accent" className="bg-white text-accent hover:bg-cream border-none">
        Upgrade to Pro
      </Button>
    </div>
  );
};

export default PremiumBanner;
