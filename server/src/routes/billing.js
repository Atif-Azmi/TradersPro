const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const { generateBillPDF } = require('../services/pdfService');
const { uploadBillPDF } = require('../services/storageService');
const { shortenUrl } = require('../services/tinyurlService');
const premiumGuard = require('../middleware/premiumGuard');

// POST generate bill
router.post('/generate', auth, premiumGuard, async (req, res) => {
  try {
    const { customerId, startDate, endDate } = req.body;

    // 1. Fetch all data
    const [customerRes, salesRes, paymentsRes, settingsRes] = await Promise.all([
      supabase.from('customers').select('*').eq('id', customerId).single(),
      supabase.from('sales').select('*').eq('customer_id', customerId).gte('sale_date', startDate).lte('sale_date', endDate),
      supabase.from('payments').select('*').eq('customer_id', customerId).gte('payment_date', startDate).lte('payment_date', endDate),
      supabase.from('store_settings').select('*').eq('user_id', req.user.id).single()
    ]);

    const customer = customerRes.data;
    const sales = salesRes.data || [];
    const payments = paymentsRes.data || [];
    const settings = settingsRes.data || {};

    const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);
    const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
    const netPayable = totalSales - totalPaid;

    // 2. Build HTML
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'DM Sans', sans-serif; padding: 40px; color: #0f1f3d; }
            .header { text-align: center; border-bottom: 2px solid #0f1f3d; padding-bottom: 20px; }
            .store-name { font-size: 28px; font-weight: bold; margin: 0; }
            .bill-info { display: flex; justify-content: space-between; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { background: #0f1f3d; color: white; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            .summary { margin-top: 30px; text-align: right; }
            .net-payable { font-size: 20px; font-weight: bold; color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="store-name">${settings.store_name || 'TraderPro'}</p>
            <p>${settings.tagline || ''}</p>
            <p>${settings.address || ''} | ${settings.phone || ''}</p>
          </div>
          <div class="bill-info">
            <div>
              <p><strong>Bill To:</strong></p>
              <p>${customer.name}</p>
              <p>${customer.phone}</p>
            </div>
            <div>
              <p><strong>Period:</strong> ${startDate} to ${endDate}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${sales.map(s => `
                <tr>
                  <td>${s.sale_date}</td>
                  <td>${s.product_name}</td>
                  <td>${s.qty} ${s.unit}</td>
                  <td>₹${s.rate}</td>
                  <td>₹${s.amount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary">
            <p>Total Sales: ₹${totalSales.toLocaleString('en-IN')}</p>
            <p>Total Paid: ₹${totalPaid.toLocaleString('en-IN')}</p>
            <p class="net-payable">Net Payable: ₹${netPayable.toLocaleString('en-IN')}</p>
          </div>
        </body>
      </html>
    `;

    // 3. Generate PDF
    const pdfBuffer = await generateBillPDF(htmlContent);

    // 4. Upload to Storage
    const fileName = `bill_${customerId}_${Date.now()}.pdf`;
    const pdfUrl = await uploadBillPDF(pdfBuffer, fileName);

    // 5. Shorten URL
    const shortUrl = await shortenUrl(pdfUrl);

    // 6. Save Bill Record
    const { data: billRecord, error: billError } = await supabase
      .from('bills')
      .insert([{
        user_id: req.user.id,
        customer_id,
        customer_name: customer.name,
        period_start: startDate,
        period_end: endDate,
        total_sales: totalSales,
        total_paid: totalPaid,
        net_payable: netPayable,
        pdf_url: pdfUrl,
        short_url: shortUrl
      }])
      .select()
      .single();

    if (billError) throw billError;

    res.json(billRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
