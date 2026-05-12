const supabase = require('../config/supabase');

module.exports = async (req, res, next) => {
  try {
    const { data: sub, error } = await supabase
      .from('subscriptions')
      .select('plan, trial_ends_at, is_active')
      .eq('user_id', req.user.id)
      .single();

    if (error || !sub) {
      return res.status(403).json({ 
        error: 'No subscription found',
        message: 'Please subscribe to a plan to access premium features.' 
      });
    }

    const isPremium =
      sub.plan !== 'free' &&
      sub.is_active &&
      (sub.trial_ends_at === null || new Date(sub.trial_ends_at) > new Date());

    if (!isPremium) {
      return res.status(403).json({
        error: 'Premium feature',
        message: 'Upgrade to Pro to access billing, PDF generation, and WhatsApp sharing.',
        upgradeUrl: '/dashboard/subscription',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify subscription' });
  }
};
