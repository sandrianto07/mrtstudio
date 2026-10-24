/* ==========================================================================
   MRT Studio — konfigurasi situs
   Semua data yang perlu Anda ganti ada di file ini. Tidak perlu mengubah
   index.html untuk kontak, WhatsApp, media sosial, formulir, atau portofolio.
   ========================================================================== */
window.MRT_CONFIG = {

  /* Logo final MRT Studio.
     Letakkan file logo di folder assets/img/ lalu sesuaikan nama file di bawah.
     Logo tidak diubah, diwarnai ulang, atau dibuat ulang oleh kode.
     Selama file logo belum ada, situs menampilkan teks "MRT Studio" sebagai
     pengganti sementara. */
  logo: {
    src: "assets/img/logo.png",
    alt: "MRT Studio"
  },

  /* Kontak resmi. Kosongkan bagian yang belum tersedia; bagian kosong
     tidak akan ditampilkan di footer. */
  contact: {
    // Nomor WhatsApp: boleh "081234567890", "+62 812-3456-7890", atau "6281234567890".
    whatsapp: "",
    email: "",
    address: ""
  },

  /* Media sosial. Hanya tautan yang diisi di sini yang akan tampil di footer.
     Contoh:
       { label: "Instagram", url: "https://instagram.com/akun-anda" },
       { label: "YouTube",   url: "https://youtube.com/@akun-anda" }  */
  social: [],

  /* Formulir konsultasi.
     - endpoint kosong  : formulir membuat pesan otomatis dan membukanya di
                          WhatsApp (jika nomor WhatsApp diisi di atas).
     - endpoint terisi  : formulir mengirim data (JSON, metode POST) ke URL
                          tersebut. Lihat README.md bagian "Menghubungkan formulir". */
  form: {
    endpoint: "",
    greeting: "Halo MRT Studio, saya ingin berkonsultasi."
  },

  /* Portofolio.
     Selama daftar ini kosong, situs menampilkan empat "Konsep Demo" yang diberi
     label jelas, bukan proyek klien. Setelah Anda mengisi minimal satu proyek,
     konsep demo otomatis diganti dengan proyek nyata Anda.

     Format satu proyek:
       {
         title: "Nama Proyek",
         category: "website-sekolah",   // website-sekolah | psb | sistem-informasi | website-umkm
         description: "Deskripsi singkat satu sampai dua kalimat.",
         image: "assets/img/portfolio/nama-proyek.jpg",   // opsional
         imageAlt: "Tampilan beranda website Nama Proyek", // wajib jika image diisi
         url: "https://alamat-proyek.example",             // opsional
         details: ["Fitur atau hasil 1", "Fitur atau hasil 2"] // opsional
       }  */
  portfolio: []
};
