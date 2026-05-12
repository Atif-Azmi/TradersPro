const supabase = require('../config/supabase');

async function uploadBillPDF(pdfBuffer, fileName) {
  try {
    const { data, error } = await supabase.storage
      .from('bills')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) throw error;

    // Generate a signed URL for temporary access (e.g., 7 days)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('bills')
      .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 days

    if (signedError) throw signedError;

    return signedData.signedUrl;
  } catch (error) {
    console.error('Storage upload failed:', error.message);
    throw error;
  }
}

module.exports = { uploadBillPDF };
