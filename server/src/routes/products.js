const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

// GET all products for the user
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', req.user.id)
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, unit, rate, stock, min_stock } = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert([{
        user_id: req.user.id,
        name,
        category,
        unit,
        rate,
        stock: stock || 0,
        min_stock: min_stock || 0
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, unit, rate, stock, min_stock } = req.body;
    const { data, error } = await supabase
      .from('products')
      .update({ name, category, unit, rate, stock, min_stock })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
router.delete('/:id', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST adjust stock
router.post('/:id/stock', auth, async (req, res) => {
  try {
    const { adjustment, reason } = req.body;
    // First get current stock
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) throw fetchError;

    const newStock = product.stock + adjustment;

    const { data, error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
