export function openWhatsApp(phone, message) {
  const clean = String(phone).replace(/\D/g, '');
  const number = clean.startsWith('91') ? clean : `91${clean}`;
  // Use 91 prefix as default for India
  const finalNumber = number.length >= 10 ? (number.length === 10 ? `91${number}` : number) : '';
  
  const url = `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function billMessage({ storeName, customerName, startDate, endDate, netPayable, shortUrl }) {
  return `Dear ${customerName},\nGreetings from *${storeName}*! 🏭\n\nPlease find your bill for the period ${startDate} → ${endDate} linked below.\nYour net payable amount is: *₹${Number(netPayable).toLocaleString('en-IN')}*\n\n📄 *Download your bill here:*\n${shortUrl}\n\nThank you for choosing us! 🙏`;
}

export function reminderMessage({ storeName, customerName, dueAmount }) {
  return `Dear ${customerName},\nGreetings from *${storeName}*! 🏭\n\nWe hope you are doing well! This is a friendly reminder regarding your pending payment of *₹${Number(dueAmount).toLocaleString('en-IN')}*.\n\nPlease clear the dues at your earliest convenience. Thank you! 🙏`;
}

export function summaryMessage({ storeName, startDate, endDate, totalSales, topProduct, efficiency }) {
  return `*${storeName} Sales Summary* 📊\n\n📅 Period: ${startDate} to ${endDate}\n💰 Total Sales: ₹${Number(totalSales).toLocaleString('en-IN')}\n🏆 Top Product: ${topProduct}\n📈 Efficiency: ${efficiency}%\n\n_Login to dashboard to download full detailed PDF report._`;
}
