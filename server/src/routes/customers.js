const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

// GET all customers with computed balances
router.get('/', auth, async (req, res) => {
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', req.user.id)
      .order('name', { ascending: true });

    if (error) throw error;
    
    // In a real app, we might compute balances via a view or separate query
    // For now, return basic info
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create customer
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        user_id: req.user.id,
        name,
        phone,
        address
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
