const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

// GET all payments
router.get('/', auth, async (req, res) => {
  try {
    const { customerId } = req.query;
    let query = supabase
      .from('payments')
      .select('*')
      .eq('user_id', req.user.id)
      .order('payment_date', { ascending: false });

    if (customerId) query = query.eq('customer_id', customerId);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create payment
router.post('/', auth, async (req, res) => {
  try {
    const { customer_id, customer_name, amount, mode, payment_date, note } = req.body;
    
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        user_id: req.user.id,
        customer_id,
        customer_name,
        amount,
        mode: mode || 'Cash',
        payment_date: payment_date || new Date().toISOString().split('T')[0],
        note
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
