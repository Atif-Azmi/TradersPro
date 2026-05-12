const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const premiumGuard = require('../middleware/premiumGuard');
const { generateBillPDF } = require('../services/pdfService');

// POST generate master report
router.post('/master', auth, premiumGuard, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // 1. Fetch all sales for this user in range
    const { data: sales, error } = await supabase
      .from('sales')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('sale_date', startDate)
      .lte('sale_date', endDate);

    if (error) throw error;

    // 2. Simple HTML for report
    const html = `
      <h1>Master Sales Report</h1>
      <p>Period: ${startDate} to ${endDate}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${sales.map(s => `<tr><td>${s.sale_date}</td><td>${s.customer_name}</td><td>${s.product_name}</td><td>₹${s.amount}</td></tr>`).join('')}
        </tbody>
      </table>
    `;

    const pdfBuffer = await generateBillPDF(html);
    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
