const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

// GET all sales with filters
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, customerId } = req.query;
    let query = supabase
      .from('sales')
      .select('*')
      .eq('user_id', req.user.id)
      .order('sale_date', { ascending: false });

    if (startDate) query = query.gte('sale_date', startDate);
    if (endDate) query = query.lte('sale_date', endDate);
    if (customerId) query = query.eq('customer_id', customerId);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create sale entry + deduct stock
router.post('/', auth, async (req, res) => {
  try {
    const { 
      customer_id, 
      product_id, 
      customer_name, 
      product_name, 
      qty, 
      unit, 
      rate, 
      shift, 
      sale_date, 
      note 
    } = req.body;

    // 1. Create sale record
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{
        user_id: req.user.id,
        customer_id,
        product_id,
        customer_name,
        product_name,
        qty,
        unit,
        rate,
        shift: shift || 'Morning',
        sale_date: sale_date || new Date().toISOString().split('T')[0],
        note
      }])
      .select()
      .single();

    if (saleError) throw saleError;

    // 2. Deduct stock from product
    if (product_id) {
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', product_id)
        .single();

      if (!fetchError && product) {
        await supabase
          .from('products')
          .update({ stock: product.stock - qty })
          .eq('id', product_id);
      }
    }

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE sale + restore stock
router.delete('/:id', auth, async (req, res) => {
  try {
    // 1. Get sale details first
    const { data: sale, error: fetchError } = await supabase
      .from('sales')
      .select('product_id, qty')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Restore stock
    if (sale.product_id) {
      const { data: product, error: pError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', sale.product_id)
        .single();

      if (!pError && product) {
        await supabase
          .from('products')
          .update({ stock: product.stock + sale.qty })
          .eq('id', sale.product_id);
      }
    }

    // 3. Delete sale record
    const { error: deleteError } = await supabase
      .from('sales')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Sale deleted and stock restored' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
