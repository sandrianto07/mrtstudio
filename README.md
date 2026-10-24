# MRT Studio — Landing Page

Landing page statis untuk MRT Studio (Madrasah Raya Teknologi). HTML semantik, CSS terstruktur, dan JavaScript tanpa framework atau dependensi. Satu-satunya sumber eksternal adalah font Plus Jakarta Sans dari Google Fonts.

## Struktur file

```
mrt-studio/
├── index.html              Seluruh konten dan struktur halaman
├── README.md
└── assets/
    ├── css/style.css       Gaya (token warna & tipografi ada di bagian 1)
    ├── js/
    │   ├── config.js       SEMUA data yang perlu Anda ubah
    │   └── main.js         Interaksi (menu, FAQ, form, portofolio, dsb.)
    └── img/
        ├── logo.png        <- letakkan logo final di sini (belum disertakan)
        ├── og-image.png    <- gambar pratinjau media sosial 1200x630 (belum disertakan)
        └── portfolio/      <- gambar proyek nyata (opsional)
```

## Menjalankan

Tidak perlu build. Pilih salah satu:

- Buka `index.html` langsung di browser, atau
- Jalankan server lokal dari folder proyek: `python3 -m http.server 8080`, lalu buka `http://localhost:8080`.

Untuk dipublikasikan, unggah seluruh folder ke hosting statis apa pun (Netlify, Vercel, Cloudflare Pages, GitHub Pages, atau cPanel/hosting biasa).

## Yang perlu Anda isi

Semua ada di `assets/js/config.js`, kecuali logo dan OG image yang berupa file.

| Data | Lokasi | Catatan |
|---|---|---|
| Logo final | `assets/img/logo.png`, nama file bisa diubah di `config.js` (`logo.src`) | Logo tidak dimodifikasi oleh kode. Selama file belum ada, tampil teks "MRT Studio" sebagai pengganti sementara. Header dan footer berlatar terang, jadi gunakan versi logo untuk latar terang. |
| Nomor WhatsApp | `contact.whatsapp` | Format bebas (`081234567890`, `+62 812-...`, `6281234567890`). Setelah diisi, semua tombol WhatsApp aktif dan tombol WhatsApp melayang muncul. |
| Email dan alamat | `contact.email`, `contact.address` | Yang kosong tidak ditampilkan di footer. |
| Media sosial | `social` | Hanya tautan yang diisi yang tampil. |
| Portofolio | `portfolio` | Selama kosong, tampil 4 "Konsep Demo" berlabel jelas. Isi minimal satu proyek nyata dan konsep demo otomatis diganti. Format ada di komentar `config.js`. |
| Pesan awal WhatsApp | `form.greeting` | Kalimat pembuka pesan otomatis. |
| OG image | `assets/img/og-image.png` | Setelah domain tersedia, ubah `og:image` dan `twitter:image` di `index.html` menjadi URL absolut. |
| Canonical dan `og:url` | `index.html` (lihat komentar di `<head>`) | Tambahkan setelah domain final ditentukan. |
| Favicon | belum ada | Buat dari logo final, lalu tambahkan `<link rel="icon" href="...">` di `<head>`. |

## Cara kerja formulir konsultasi

Formulir memvalidasi semua kolom (nama, lembaga, layanan, nomor WhatsApp, kebutuhan) dan tidak pernah menampilkan "berhasil" jika data tidak benar-benar dikirim.

1. **Nomor WhatsApp terisi, endpoint kosong:** pesan terformat dibuka di WhatsApp. Pengunjung tetap harus menekan kirim di WhatsApp.
2. **Endpoint terisi:** data dikirim ke server Anda, dan pesan sukses hanya muncul jika server membalas sukses.
3. **Keduanya kosong:** formulir menampilkan pesan yang bisa disalin dan menjelaskan bahwa belum ada yang terkirim.

### Menghubungkan formulir ke backend

Isi `form.endpoint` di `config.js` dengan URL penerima. Formulir mengirim `POST` JSON:

```json
{
  "nama": "...", "lembaga": "...", "layanan": "...",
  "whatsapp": "...", "kebutuhan": "...", "pesan": "teks lengkap siap kirim"
}
```

Penerima yang cocok: layanan form seperti Formspree atau Getform (gunakan URL endpoint dari akun Anda), Google Apps Script yang menulis ke Google Sheets (deploy sebagai web app dengan CORS terbuka), atau API Anda sendiri (PHP/Node/Laravel). Server harus membalas status 2xx dan mengizinkan CORS dari domain situs ini. Kolom jebakan bot (`website`) sudah ada; abaikan permintaan yang kolom itu terisi.

## Kustomisasi desain

- Warna dan font: ubah token di bagian `:root` pada `assets/css/style.css` (`--maroon`, `--maroon-dark`, `--ink`, `--warm`, dll.).
- Teks, layanan, FAQ: edit langsung di `index.html`.
- Mockup di hero dan portofolio dibuat dari HTML/CSS (bukan gambar), jadi ringan dan tajam di semua layar. Seluruh teks di dalamnya adalah contoh generik, tanpa data pribadi.
- Font dimuat dari Google Fonts. Untuk mandiri tanpa pihak ketiga, unduh Plus Jakarta Sans, simpan di `assets/fonts/`, dan ganti `<link>` font dengan `@font-face`.

## Aksesibilitas dan SEO yang sudah diterapkan

Skip link, hierarki heading berurutan, fokus keyboard yang terlihat, menu mobile dan accordion dengan `aria-expanded`, label pada semua kolom formulir, pesan galat per kolom, dan dukungan `prefers-reduced-motion`. SEO: meta title dan description, Open Graph, Twitter card, serta data terstruktur `ProfessionalService` tanpa kontak atau klaim yang belum ada. Setelah domain aktif, tambahkan `sitemap.xml` dan `robots.txt`.

## Catatan konten

Halaman sengaja tidak memuat angka statistik, testimoni, logo klien, penghargaan, atau klaim pengalaman. Tambahkan hanya jika datanya nyata dan dapat dibuktikan.
