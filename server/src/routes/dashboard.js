const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get Core Stats
    const { data: sales } = await supabase.from('sales').select('amount').eq('user_id', userId);
    const { data: payments } = await supabase.from('payments').select('amount').eq('user_id', userId);
    const { data: products } = await supabase.from('products').select('stock, rate, min_stock, name, unit').eq('user_id', userId);

    const totalSales = sales?.reduce((acc, s) => acc + s.amount, 0) || 0;
    const totalPayments = payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
    const stockValue = products?.reduce((acc, p) => acc + (p.stock * p.rate), 0) || 0;
    const outstanding = totalSales - totalPayments;

    // 2. AI Restock Predictions (Velocity Analysis)
    // Fetch last 30 days of sales
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentSales } = await supabase
      .from('sales')
      .select('qty, product_id')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    const predictions = products?.map(p => {
      const soldLast30 = recentSales?.filter(s => s.product_id === p.id).reduce((acc, s) => acc + s.qty, 0) || 0;
      const dailyVelocity = soldLast30 / 30;
      const daysLeft = dailyVelocity > 0 ? Math.floor(p.stock / dailyVelocity) : 999;
      
      return {
        id: p.id,
        name: p.name,
        stock: p.stock,
        unit: p.unit,
        daysLeft,
        isCritical: daysLeft <= 7,
        suggestion: daysLeft <= 7 ? `Order ${Math.ceil(dailyVelocity * 30)} ${p.unit} for next 30 days` : null
      };
    }).filter(p => p.daysLeft < 30).sort((a, b) => a.daysLeft - b.daysLeft);

    // 3. Collection Efficiency
    const efficiency = totalSales > 0 ? Math.round((totalPayments / totalSales) * 100) : 0;

    res.json({
      stats: {
        totalSales,
        totalPayments,
        stockValue,
        outstanding,
        efficiency
      },
      predictions: predictions?.slice(0, 5) || [],
      lowStock: products?.filter(p => p.stock <= p.min_stock) || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
