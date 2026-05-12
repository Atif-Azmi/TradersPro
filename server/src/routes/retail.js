const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

// GET today's retail summary
router.get('/summary', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('retail_sales')
      .select('amount, payment_mode')
      .eq('user_id', req.user.id)
      .eq('sale_date', today);

    if (error) throw error;

    const summary = data.reduce((acc, sale) => {
      if (sale.payment_mode === 'Cash') acc.cash += sale.amount;
      else acc.online += sale.amount;
      acc.total += sale.amount;
      return acc;
    }, { cash: 0, online: 0, total: 0 });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create retail sale
router.post('/', auth, async (req, res) => {
  try {
    const { product_id, product_name, qty, unit, rate, payment_mode } = req.body;
    
    const { data, error } = await supabase
      .from('retail_sales')
      .insert([{
        user_id: req.user.id,
        product_id,
        product_name,
        qty,
        unit,
        rate,
        payment_mode: payment_mode || 'Cash',
        sale_date: new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (error) throw error;

    // Deduct stock
    if (product_id) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', product_id)
        .single();

      if (product) {
        await supabase
          .from('products')
          .update({ stock: product.stock - qty })
          .eq('id', product_id);
      }
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
