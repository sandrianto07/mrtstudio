/* ==========================================================================
   MRT Studio — interaksi landing page
   Data yang bisa diubah (kontak, WhatsApp, portofolio) ada di config.js.
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.MRT_CONFIG || {};
  var contact = cfg.contact || {};
  var formCfg = cfg.form || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- WhatsApp ---------- */
  function waNumber() {
    var digits = String(contact.whatsapp || '').replace(/\D/g, '');
    if (digits.indexOf('0') === 0) digits = '62' + digits.slice(1);
    else if (digits.indexOf('8') === 0) digits = '62' + digits;
    return digits.length >= 10 ? digits : '';
  }
  var WA = waNumber();
  function waLink(text) {
    return 'https://wa.me/' + WA + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  function initWhatsApp() {
    var greeting = formCfg.greeting || 'Halo MRT Studio, saya ingin berkonsultasi.';
    $$('[data-wa]').forEach(function (el) {
      if (WA) {
        el.setAttribute('href', waLink(greeting));
        el.hidden = false;
      } else if (el.classList.contains('fab')) {
        el.hidden = true; // tombol melayang disembunyikan sampai nomor diisi
      } else {
        el.removeAttribute('target'); // tanpa nomor, tombol hanya menuju formulir di halaman ini
        el.removeAttribute('rel');
      }
    });
    if (!WA && window.console) {
      console.warn('[MRT Studio] Nomor WhatsApp belum diisi di assets/js/config.js (contact.whatsapp).');
    }
  }

  /* ---------- Logo ---------- */
  function initLogo() {
    var src = cfg.logo && cfg.logo.src;
    var alt = (cfg.logo && cfg.logo.alt) || 'MRT Studio';
    $$('img[data-logo]').forEach(function (img) {
      function fallback() {
        var span = document.createElement('span');
        span.className = 'wordmark';
        span.textContent = 'MRT Studio';
        if (img.parentNode) img.parentNode.replaceChild(span, img);
      }
      img.alt = alt;
      img.addEventListener('error', fallback, { once: true });
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }

  /* ---------- Navigasi ---------- */
  function initNav() {
    var header = $('.site-header');
    var nav = $('#site-nav');
    var toggle = $('.nav-toggle');
    if (!header || !nav || !toggle) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    }
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) { if (e.matches) setOpen(false); });

    var topBtn = $('#back-to-top');
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      if (topBtn) topBtn.hidden = window.scrollY < 700;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (topBtn) topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    // Tandai menu yang sedang aktif
    var links = $$('[data-nav]');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          var link = map[entry.target.id];
          if (link) link.setAttribute('aria-current', 'location');
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* ---------- Tautan khusus: fokus ke kolom & pra-pilih layanan ---------- */
  function initLinks() {
    var select = $('#f-layanan');
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      if (a.dataset.service && select) select.value = a.dataset.service;
      if (a.dataset.focus) {
        var target = $(a.dataset.focus);
        if (target) {
          e.preventDefault();
          var section = $('#konsultasi');
          if (section) section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          window.setTimeout(function () { target.focus({ preventScroll: true }); }, reduceMotion ? 0 : 450);
          if (history.replaceState) history.replaceState(null, '', '#konsultasi');
        }
      }
    });
  }

  /* ---------- Animasi saat scroll (ringan) ---------- */
  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    $$('[data-reveal-group]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.setAttribute('data-reveal', '');
        child.style.setProperty('--i', i);
      });
    });
    root.classList.add('reveal-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });

    var wrap = $('#process-wrap');
    if (wrap) {
      var io2 = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { wrap.classList.add('is-in'); io2.disconnect(); }
      }, { threshold: 0.3 });
      io2.observe(wrap);
    }
  }

  /* ---------- FAQ ---------- */
  function initFaq() {
    var items = $$('.faq-item');
    items.forEach(function (item) {
      var btn = $('.faq-q', item);
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        items.forEach(function (other) {
          var b = $('.faq-q', other);
          b.setAttribute('aria-expanded', 'false');
          other.classList.remove('is-open');
        });
        if (!open) { btn.setAttribute('aria-expanded', 'true'); item.classList.add('is-open'); }
      });
    });
  }

  /* ---------- Footer: kontak & media sosial dari config ---------- */
  function initFooter() {
    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    var box = $('#footer-contact');
    var rows = [];
    if (WA) rows.push('<a href="' + esc(waLink(formCfg.greeting)) + '" target="_blank" rel="noopener">WhatsApp: ' + esc(contact.whatsapp) + '</a>');
    if (contact.email) rows.push('<a href="mailto:' + esc(contact.email) + '">' + esc(contact.email) + '</a>');
    if (contact.address) rows.push('<span class="footer-desc">' + esc(contact.address) + '</span>');
    if (box && rows.length) box.innerHTML = rows.join('');

    var socials = (cfg.social || []).filter(function (s) { return s && s.url && s.label; });
    var list = $('#footer-social');
    if (list && socials.length) {
      list.innerHTML = socials.map(function (s) {
        return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a></li>';
      }).join('');
      list.hidden = false;
    }
  }

  /* ---------- Portofolio ---------- */
  var CATEGORIES = {
    'website-sekolah': 'Website Sekolah & Pesantren',
    'psb': 'Sistem PSB/PPDB',
    'sistem-informasi': 'Sistem Informasi',
    'website-umkm': 'Website UMKM'
  };

  // Kategori portofolio -> pilihan layanan pada formulir
  var SERVICE_FOR = {
    'website-sekolah': 'Website Sekolah & Pesantren',
    'psb': 'Sistem PSB/PPDB',
    'sistem-informasi': 'Sistem Informasi Akademik',
    'website-umkm': 'Website Profil Yayasan & UMKM'
  };

  var DEMO_ITEMS = [
    {
      title: 'Konsep Website Sekolah & Pesantren', category: 'website-sekolah', demo: true,
      description: 'Konsep website profil lembaga dengan halaman program, berita, fasilitas, dan informasi penerimaan.',
      details: ['Profil lembaga, visi, dan program unggulan', 'Berita dan pengumuman', 'Halaman fasilitas dan galeri', 'Informasi serta tautan pendaftaran siswa atau santri', 'Tampilan responsif di ponsel dan komputer']
    },
    {
      title: 'Prototype Sistem PSB/PPDB', category: 'psb', demo: true,
      description: 'Prototype alur pendaftaran online sampai dashboard admin untuk memverifikasi pendaftar.',
      details: ['Formulir pendaftaran online', 'Pengelolaan data pendaftar', 'Status pendaftaran', 'Dashboard admin untuk verifikasi', 'Fitur mengikuti alur seleksi lembaga']
    },
    {
      title: 'Prototype Sistem Informasi Akademik', category: 'sistem-informasi', demo: true,
      description: 'Prototype dashboard untuk mengelola data siswa, kelas, dan administrasi akademik dasar.',
      details: ['Pengelolaan data siswa dan kelas', 'Administrasi akademik dasar', 'Laporan sesuai kebutuhan', 'Hak akses berdasarkan peran pengguna']
    },
    {
      title: 'Konsep Website UMKM', category: 'website-umkm', demo: true,
      description: 'Konsep website bisnis lokal dengan daftar layanan, informasi kontak, dan tombol pesan lewat WhatsApp.',
      details: ['Profil usaha dan daftar layanan atau produk', 'Informasi kontak dan lokasi', 'Tombol pesan lewat WhatsApp', 'Tampilan cepat dan responsif di ponsel']
    }
  ];

  function siteMock(o) {
    var cards = '<div><b></b><u></u><u></u></div>'.repeat(3);
    return '<div class="mock mock-desktop" aria-hidden="true">' +
      '<div class="mock-bar"><i></i><i></i><i></i><span class="mock-url">' + esc(o.url) + '</span></div>' +
      '<div class="ms-head"><b class="ms-logo"></b><span class="ms-brand">' + esc(o.brand) + '</span><span class="ms-nav"><i></i><i></i><i></i><i></i></span></div>' +
      '<div class="ms-hero"><div class="ms-copy"><strong>' + esc(o.title) + '</strong><span>' + esc(o.text) + '</span><b class="ms-cta">' + esc(o.cta) + '</b></div>' +
      '<div class="ms-art"><i style="--h:38%"></i><i style="--h:62%"></i><i style="--h:48%"></i><i style="--h:82%"></i></div></div>' +
      '<div class="ms-cards">' + cards + '</div></div>';
  }

  function dashMock(o) {
    var menu = o.menu.map(function (m, i) { return '<li' + (i === 0 ? ' class="is-active"' : '') + '>' + esc(m) + '</li>'; }).join('');
    var widths = ['72%', '46%', '24%'];
    var tiles = o.tiles.map(function (t, i) { return '<div><span>' + esc(t) + '</span><i style="--w:' + widths[i] + '"></i></div>'; }).join('');
    var rows = o.chips.map(function (c) {
      return '<div class="md-row"><span class="md-name"><b></b><u></u></span><span><u></u></span><span><em class="chip chip-' + c[1] + '">' + esc(c[0]) + '</em></span></div>';
    }).join('');
    return '<div class="mock mock-dash" aria-hidden="true">' +
      '<div class="md-side"><div class="md-brand"><b></b>' + esc(o.brand) + '</div><ul>' + menu + '</ul></div>' +
      '<div class="md-main"><div class="md-head"><strong>' + esc(o.title) + '</strong><span class="md-tag">Contoh tampilan</span></div>' +
      '<div class="md-tiles">' + tiles + '</div>' +
      '<div class="md-table"><div class="md-row md-th"><span>' + esc(o.th[0]) + '</span><span>' + esc(o.th[1]) + '</span><span>' + esc(o.th[2]) + '</span></div>' + rows + '</div></div></div>';
  }

  function previewFor(category) {
    switch (category) {
      case 'psb':
        return dashMock({
          brand: 'Panel PSB', menu: ['Dashboard', 'Pendaftar', 'Verifikasi', 'Pengumuman', 'Pengaturan'],
          title: 'Pendaftar Baru', tiles: ['Pendaftar', 'Terverifikasi', 'Perlu dilengkapi'],
          th: ['Nama pendaftar', 'Jenjang', 'Status'],
          chips: [['Baru', 'new'], ['Terverifikasi', 'ok'], ['Perlu dilengkapi', 'wait'], ['Baru', 'new']]
        });
      case 'sistem-informasi':
        return dashMock({
          brand: 'Panel Akademik', menu: ['Dashboard', 'Data Siswa', 'Kelas', 'Jadwal', 'Laporan'],
          title: 'Data Akademik', tiles: ['Siswa', 'Kelas', 'Kehadiran'],
          th: ['Nama siswa', 'Kelas', 'Data'],
          chips: [['Lengkap', 'ok'], ['Lengkap', 'ok'], ['Perlu diperbarui', 'wait'], ['Lengkap', 'ok']]
        });
      case 'website-umkm':
        return siteMock({ url: 'namausaha.id', brand: 'Nama Usaha', title: 'Nama Usaha Anda', text: 'Layanan dan kontak mudah ditemukan pelanggan.', cta: 'Pesan lewat WhatsApp' });
      default:
        return siteMock({ url: 'namalembaga.sch.id', brand: 'Nama Lembaga', title: 'Nama Lembaga Anda', text: 'Profil, program, dan informasi penerimaan dalam satu website.', cta: 'Informasi Pendaftaran' });
    }
  }

  function initPortfolio() {
    var grid = $('#portfolio-grid');
    var filtersBox = $('#portfolio-filters');
    if (!grid || !filtersBox) return;

    var real = (cfg.portfolio || []).filter(function (p) { return p && p.title; });
    var isDemo = real.length === 0;
    var items = (isDemo ? DEMO_ITEMS : real).map(function (item, i) {
      var copy = {}; for (var k in item) copy[k] = item[k];
      copy.id = 'work-' + i;
      if (!CATEGORIES[copy.category]) copy.category = 'website-sekolah';
      return copy;
    });

    var intro = $('#portfolio-intro');
    var note = $('#portfolio-note');
    if (isDemo) {
      if (intro) intro.textContent = 'Bayangan hasil kerja untuk setiap kategori layanan. Proyek klien akan ditampilkan di sini setelah ditambahkan.';
      if (note) note.hidden = false;
    }

    grid.innerHTML = items.map(function (it) {
      var preview = it.image
        ? '<img src="' + esc(it.image) + '" alt="' + esc(it.imageAlt || it.title) + '" loading="lazy" decoding="async">'
        : previewFor(it.category);
      return '<article class="work" data-category="' + esc(it.category) + '">' +
        '<div class="work-preview">' + preview + '</div>' +
        '<div class="work-body">' +
          '<div class="work-meta">' + (it.demo ? '<span class="badge">Konsep Demo</span>' : '') + '<span class="work-cat">' + esc(CATEGORIES[it.category]) + '</span></div>' +
          '<h3>' + esc(it.title) + '</h3>' +
          '<p>' + esc(it.description || '') + '</p>' +
          '<button class="text-link" type="button" data-work="' + esc(it.id) + '" aria-label="Lihat detail: ' + esc(it.title) + '">Lihat Detail</button>' +
        '</div></article>';
    }).join('');

    // Filter hanya untuk kategori yang tersedia
    var present = Object.keys(CATEGORIES).filter(function (key) {
      return items.some(function (it) { return it.category === key; });
    });
    var filterList = [['all', 'Semua']].concat(present.map(function (key) { return [key, CATEGORIES[key]]; }));
    filtersBox.innerHTML = filterList.map(function (f, i) {
      return '<button class="filter" type="button" data-filter="' + esc(f[0]) + '" aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' + esc(f[1]) + '</button>';
    }).join('');
    if (present.length < 2) filtersBox.hidden = true;

    var cards = $$('.work', grid);
    function apply(filter) {
      var visible = 0, firstVisible = null;
      cards.forEach(function (card) {
        var show = filter === 'all' || card.dataset.category === filter;
        card.hidden = !show;
        card.classList.remove('is-featured');
        if (show) { visible++; if (!firstVisible) firstVisible = card; }
      });
      if (filter === 'all' && visible % 2 === 1 && firstVisible) firstVisible.classList.add('is-featured');
    }
    apply('all');

    filtersBox.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      $$('.filter', filtersBox).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      apply(btn.dataset.filter);
    });

    // Dialog detail
    var dialog = $('#work-dialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-work]');
      if (!btn) return;
      var it = items.filter(function (x) { return x.id === btn.dataset.work; })[0];
      if (!it) return;
      $('#work-dialog-meta').innerHTML = (it.demo ? '<span class="badge">Konsep Demo</span>' : '') + '<span class="work-cat">' + esc(CATEGORIES[it.category]) + '</span>';
      $('#work-dialog-title').textContent = it.title;
      $('#work-dialog-desc').textContent = it.description || '';
      $('#work-dialog-list').innerHTML = (it.details || []).map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('');
      $('#work-dialog-note').textContent = it.demo ? 'Ini konsep demo MRT Studio untuk menggambarkan hasil yang bisa dibangun. Ini bukan proyek klien.' : '';
      var actions = $('#work-dialog-actions');
      actions.innerHTML = '';
      if (it.url) {
        actions.innerHTML = '<a class="btn btn-primary" href="' + esc(it.url) + '" target="_blank" rel="noopener">Buka proyek</a>';
      } else if (it.demo) {
        actions.innerHTML = '<a class="btn btn-primary" href="#konsultasi" data-service="' + esc(SERVICE_FOR[it.category]) + '" data-close>Diskusikan proyek serupa</a>';
      }
      dialog.showModal();
    });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target.closest('#work-dialog-close') || e.target.closest('[data-close]')) dialog.close();
    });
  }

  /* ---------- Formulir konsultasi ---------- */
  function initForm() {
    var form = $('#consult-form');
    if (!form) return;
    var status = $('#form-status');
    var submit = $('#form-submit');
    var hasEndpoint = !!formCfg.endpoint;

    submit.textContent = hasEndpoint ? 'Kirim Konsultasi' : (WA ? 'Lanjut ke WhatsApp' : 'Siapkan Pesan Konsultasi');

    var rules = {
      nama: function (v) { return v.length >= 2 ? '' : 'Isi nama Anda.'; },
      lembaga: function (v) { return v.length >= 2 ? '' : 'Isi nama lembaga atau bisnis Anda.'; },
      layanan: function (v) { return v ? '' : 'Pilih jenis layanan.'; },
      whatsapp: function (v) {
        var n = v.replace(/[\s().-]/g, '');
        return /^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(n) ? '' : 'Isi nomor WhatsApp yang valid, misalnya 081234567890.';
      },
      kebutuhan: function (v) { return v.length >= 10 ? '' : 'Ceritakan kebutuhan Anda minimal 10 karakter.'; }
    };
    var errorIds = { nama: 'e-nama', lembaga: 'e-lembaga', layanan: 'e-layanan', whatsapp: 'e-wa', kebutuhan: 'e-kebutuhan' };

    function value(name) { return (form.elements[name].value || '').trim(); }
    function check(name) {
      var field = form.elements[name];
      var msg = rules[name](value(name));
      var out = document.getElementById(errorIds[name]);
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      out.textContent = msg;
      out.hidden = !msg;
      return !msg;
    }
    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      field.addEventListener('blur', function () { if (field.value) check(name); });
      field.addEventListener('input', function () { if (field.getAttribute('aria-invalid') === 'true') check(name); });
      field.addEventListener('change', function () { if (field.getAttribute('aria-invalid') === 'true') check(name); });
    });

    function buildMessage() {
      return (formCfg.greeting || 'Halo MRT Studio, saya ingin berkonsultasi.') + '\n\n' +
        'Nama: ' + value('nama') + '\n' +
        'Lembaga/Bisnis: ' + value('lembaga') + '\n' +
        'Layanan: ' + value('layanan') + '\n' +
        'Nomor WhatsApp: ' + value('whatsapp') + '\n\n' +
        'Kebutuhan:\n' + value('kebutuhan');
    }

    function show(nodes) {
      status.innerHTML = '';
      var box = document.createElement('div');
      box.className = 'status-box';
      nodes.forEach(function (n) { box.appendChild(n); });
      status.appendChild(box);
      status.focus();
    }
    function el(tag, text, cls) {
      var node = document.createElement(tag);
      if (text) node.textContent = text;
      if (cls) node.className = cls;
      return node;
    }
    function waAnchor(message, label) {
      var a = el('a', label, 'btn btn-primary');
      a.href = waLink(message); a.target = '_blank'; a.rel = 'noopener';
      return a;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        if (!check(name) && !firstInvalid) firstInvalid = form.elements[name];
      });
      if (firstInvalid) {
        var count = $$('[aria-invalid="true"]', form).length;
        show([el('p', 'Ada ' + count + ' kolom yang perlu diperbaiki. Periksa kolom yang ditandai, lalu kirim ulang.')]);
        firstInvalid.focus();
        return;
      }

      // Kolom jebakan untuk bot: jika terisi, berpura-pura berhasil tanpa mengirim apa pun.
      if (form.elements.website.value) { form.reset(); status.innerHTML = ''; return; }

      var message = buildMessage();

      if (hasEndpoint) {
        submit.disabled = true;
        submit.textContent = 'Mengirim...';
        fetch(formCfg.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            nama: value('nama'), lembaga: value('lembaga'), layanan: value('layanan'),
            whatsapp: value('whatsapp'), kebutuhan: value('kebutuhan'), pesan: message
          })
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          show([el('strong', 'Permintaan konsultasi terkirim.'), el('p', 'Terima kasih, ' + value('nama') + '. Kami akan menghubungi Anda lewat WhatsApp di nomor yang Anda isi.')]);
          form.reset();
        }).catch(function () {
          var nodes = [el('strong', 'Pesan belum terkirim.'), el('p', 'Terjadi gangguan saat mengirim formulir. Coba lagi beberapa saat lagi' + (WA ? ' atau kirim langsung lewat WhatsApp.' : '.'))];
          if (WA) nodes.push(waAnchor(message, 'Kirim lewat WhatsApp'));
          show(nodes);
        }).then(function () {
          submit.disabled = false;
          submit.textContent = 'Kirim Konsultasi';
        });
        return;
      }

      if (WA) {
        window.open(waLink(message), '_blank', 'noopener');
        var fallback = waAnchor(message, 'Buka WhatsApp');
        show([
          el('strong', 'Pesan sudah disiapkan di WhatsApp.'),
          el('p', 'Tekan tombol kirim di WhatsApp untuk menyelesaikan permintaan konsultasi. Jika WhatsApp tidak terbuka otomatis, gunakan tombol di bawah.'),
          fallback
        ]);
        return;
      }

      // Belum ada backend maupun nomor WhatsApp: jangan berpura-pura terkirim.
      var pre = el('pre', message, 'copy-box');
      var copy = el('button', 'Salin pesan', 'btn btn-ghost');
      copy.type = 'button';
      copy.addEventListener('click', function () {
        function done(ok) { copy.textContent = ok ? 'Pesan disalin' : 'Salin manual dari kotak di atas'; }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(message).then(function () { done(true); }, function () { done(false); });
        else done(false);
      });
      show([
        el('strong', 'Pesan belum terkirim.'),
        el('p', 'Formulir ini belum terhubung ke WhatsApp atau server. Salin pesan di bawah, lalu kirim lewat kontak resmi MRT Studio.'),
        pre, copy
      ]);
    });
  }

  /* ---------- Mulai ---------- */
  initLogo();
  initWhatsApp();
  initNav();
  initLinks();
  initFaq();
  initFooter();
  initPortfolio();
  initForm();
  initReveal();
})();
