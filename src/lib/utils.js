// Mengubah angka menjadi format mata uang Rupiah
export const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};

// Mengenerate URL WhatsApp untuk pesan checkout
export const generateWhatsAppLink = (nomorWa, pesan) => {
  // Membersihkan nomor WA (misal dari 0812 ke 62812)
  let formattedNumber = nomorWa;
  if (formattedNumber.startsWith('0')) {
    formattedNumber = '62' + formattedNumber.substring(1);
  }
  
  const encodedText = encodeURIComponent(pesan);
  return `https://wa.me/${formattedNumber}?text=${encodedText}`;
};