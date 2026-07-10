import { AnalysisResult } from './types';

export function getOfflineDemoFallback(demoType: 'id' | 'cn' | 'en'): AnalysisResult {
  if (demoType === 'cn') {
    return {
      contract_type: "Kontrak Jual Beli Barang Internasional",
      contract_type_en: "International Goods Sale and Purchase Agreement",
      party_a: "Guangzhou Dingsheng Electronic Technology Co., Ltd. (Penjual)",
      party_b: "PT Sinar Jaya Elektronik Indonesia (Pembeli)",
      duration: "12 Bulan, otomatis diperpanjang berkelanjutan kecuali ditinjau ulang",
      summary_mandarin: "Laporan audit hukum ekstrim atas Perjanjian Jual Beli Barang Internasional. Kontrak ini merupakan contoh klasik klausul sepihak (unilateral) yang sangat merugikan importir PT Sinar Jaya (Pembeli) demi keuntungan Guangzhou Dingsheng (Penjual). Kontrak ini melucuti hak Pembeli melalui berbagai ketentuan berbahaya: Penjual memegang kendali penyesuaian harga secara sepihak hanya dengan pemberitahuan 7 hari via email, pembebasan jaminan kualitas penuh secara 'AS-IS' yang mengecualikan tanggung jawab atas bahaya kebakaran atau cacat sirkuit, denda keterlambatan pembayaran yang sangat eksesif sebesar 5% per minggu secara berbunga (compounded) setiap minggu, penyitaan database pelanggan lokal milik Pembeli tanpa kompensasi saat pemutusan kontrak, waktu pemberitahuan pemutusan hubungan yang tidak seimbang (24 jam bagi Penjual vs 12 bulan bagi Pembeli), serta pembatasan penyelesaian sengketa eksklusif di Pengadilan Nanshan, Shenzhen, China. Sangat disarankan untuk menolak penandatanganan draf ini.",
      conclusion: "Struktur kontrak yang mengikat ini harus ditolak keras oleh PT Sinar Jaya. Ketentuan di dalamnya mengikat pembeli dalam komitmen komersial dan utang yang berat tanpa perlindungan timbal balik terkait stabilitas harga, jaminan cacat tersembunyi, maupun kepemilikan database pelanggan. Jika terjadi bahaya kebakaran akibat korsleting sirkuit di gudang Jakarta, seluruh tanggung jawab finansial dan hukum konsumen akan ditanggung oleh Pembeli sementara tuntutan balik terhalang proses hukum di luar negeri. Desak pemindahan yurisdiksi ke SIAC Singapura, ubah denda keterlambatan menjadi denda tunggal harian wajar, perpanjang waktu pemeriksaan fisik menjadi 15 hari kerja, dan tetapkan jaminan garansi kualitas produk (RMA) yang adil.",
      full_translation_mandarin: "",
      risk_score: 96,
      risk_level: "HIGH",
      risk_verdict: "Perjanjian sepihak yang sangat agresif dan tidak seimbang, mengalihkan seluruh risiko kegagalan manufaktur, tanggung jawab cacat produk, denda keterlambatan, dan sengketa hukum kepada Pembeli, sekaligus memberikan hak kepada Penjual untuk menyita database komersial lokal milik Pembeli.",
      red_flags: [
        {
          title_cn: "Hak Penyesuaian Harga Sepihak Tanpa Batas oleh Penjual (Pasal 1)",
          original_text: "Penjual mempertahankan hak mutlak tak terbatas untuk secara sepihak (unilaterally) mengubah dan menaikkan harga unit barang dalam lembaran pesanan (PO) kapan pun.",
          translation_cn: "Penjual memegang kendali penyesuaian harga secara sepihak hanya dengan pemberitahuan 7 hari via email.",
          explanation_cn: "Menghapus stabilitas harga memaksa Pembeli menerima kenaikan biaya sepihak secara mendadak saat pengapalan berlangsung. Karena tidak ada batas atas penyesuaian atau opsi keluar bagi Importir, Pembeli dipaksa membeli dengan harga bengkak.",
          suggested_fix_cn: "Ubah menjadi harga tetap 12 bulan. Penyesuaian harga karena kenaikan bahan baku harus disepakati tertulis secara timbal balik, dibatasi maksimal 5% per tahun, dan memberi waktu 30 hari bagi Pembeli untuk membatalkan pesanan tanpa biaya.",
          law_reference: "Prinsip Konsensualisme & Kepatutan (Pasal 1338 KUHPerdata)"
        },
        {
          title_cn: "Pembebasan Tanggung Jawab Kualitas Produk 'AS-IS' (Pasal 2)",
          original_text: "Penjual secara tegas menafikan jaminan kualitas produk, baik tersurat maupun tersirat mengenai kelaikan dagang atau keamanan penggunaan.",
          translation_cn: "Semua barang dikirim atas dasar 'AS-IS' (kondisi apa adanya), menolak semua garansi wajib.",
          explanation_cn: "Klausul ini mengalihkan 100% risiko cacat manufaktur kepada Pembeli. Jika produk elektronik mengalami kegagalan sirkuit atau terbakar di gudang Jakarta, PT Sinar Jaya harus menghadapi tuntutan konsumen sendiri tanpa hak menuntut Penjual.",
          suggested_fix_cn: "Ubah menjadi: 'Penjual menjamin produk bebas dari cacat desain dan manufaktur selama 12 bulan sejak tanggal kliring bea cukai, dan Penjual akan mengganti rugi Pembeli atas kerusakan akibat cacat produksi tersebut.'",
          law_reference: "Undang-Undang Perlindungan Konsumen No. 8 Tahun 1999"
        },
        {
          title_cn: "Batas Waktu Pemeriksaan Fisik yang Sangat Singkat 3 Hari (Pasal 2.3)",
          original_text: "Pembeli wajib melakukan pemeriksaan visual penuh atas kualitas fisik barang di pelabuhan Tanjung Priok maksimal dalam waktu 3 hari kalender setelah pembongkaran.",
          translation_cn: "Pemeriksaan visual penuh harus selesai dalam waktu 3 hari kalender setelah bongkar muat.",
          explanation_cn: "Kliring pabean dan pengiriman kontainer ke gudang biasanya membutuhkan setidaknya 10-14 hari. Batas waktu 3 hari ini adalah jebakan untuk menghapus hak komplain Pembeli atas cacat tersembunyi yang baru terdeteksi saat pemakaian.",
          suggested_fix_cn: "Ubah batas waktu pemeriksaan produk menjadi 15 hari kerja untuk cacat luar, dan 90 hari masa uji coba untuk cacat sirkuit/komponen internal tersembunyi.",
          law_reference: "Doktrin Cacat Tersembunyi (Hidden Defects) Hukum Dagang"
        },
        {
          title_cn: "Denda Keterlambatan Pembayaran 5% Komposit Mingguan (Pasal 3.3)",
          original_text: "will incur a penalty of 5% per week on the outstanding amount, compounded weekly... without any percentage cap.",
          translation_cn: "Jumlah tunggakan akan dikenakan denda sebesar 5% per minggu, berbunga majemuk tanpa batas atas.",
          explanation_cn: "Denda mingguan komposit sebesar 5% setara dengan bunga tahunan efektif lebih dari 1100%! Ini merupakan praktek lintah darat (usury). Hambatan transfer bank atau libur nasional akan membuat utang menumpuk menjadi sangat besar dalam sekejap.",
          suggested_fix_cn: "Ubah denda menjadi denda tunggal harian sebesar 0.05% per hari (sekitar 18% per tahun), dengan batas total maksimal denda tidak melebihi 5% dari nilai invoice.",
          law_reference: "Prinsip Itikad Baik & Kepatutan (Pasal 1338 KUHPerdata)"
        },
        {
          title_cn: "Penyitaan Database Pelanggan Lokal Tanpa Kompensasi (Pasal 4)",
          original_text: "relasi basis pelanggan (customer database) yang dibangun oleh Pembeli menggunakan asupan modal pribadi di Indonesia, akan secara otomatis beralih menjadi hak milik tunggal Penjual secara cuma-cuma",
          translation_cn: "Database pelanggan beralih otomatis ke kepemilikan eksklusif Penjual secara cuma-cuma saat pemutusan kontrak.",
          explanation_cn: "Database pelanggan adalah aset tidak berwujud paling berharga milik Pembeli lokal. Menyitanya secara cuma-cuma memungkinkan Supplier memutuskan kontrak sesuka hati lalu menyerahkan jaringan siap pakai Anda kepada pihak lain.",
          suggested_fix_cn: "Ubah menjadi: 'Semua database pelanggan lokal dan jaringan distributor yang dikembangkan Pembeli tetap menjadi hak milik eksklusif Pembeli. Penjual dilarang meminta, mengambil, atau menggunakan database tersebut.'",
          law_reference: "Undang-Undang Rahasia Dagang UU No. 30 Tahun 2000 & UU PDP No. 27 Tahun 2022"
        }
      ],
      risky_clauses: [
        {
          topic_cn: "Wewenang Pemutusan Sepihak 24 Jam Tanpa Ganti Rugi",
          risk_level: "HIGH",
          original_text: "Penjual memiliki wewenang penuh untuk memutuskan komitmen jual beli ini kapan saja dan secara seketika (instant termination) dalam waktu 24 jam...",
          translation_cn: "Penjual dapat memutuskan kontrak via email dalam 24 jam; Pembeli butuh pemberitahuan tertulis tertanggung 12 bulan.",
          explanation_cn: "Ketentuan pemberitahuan pemutusan sepihak yang tidak setara ini memungkinkan Supplier memutus pasokan menjelang musim penjualan panas, sementara mengikat Pembeli dalam jangka waktu 12 bulan meskipun penjualan anjlok."
        },
        {
          topic_cn: "Yurisdiksi Eksklusif Pengadilan Negeri Nanshan, Shenzhen",
          risk_level: "HIGH",
          original_text: "diselesaikan melalui Pengadilan Rakyat Distrik Nanshan, Kota Shenzhen, RRT.",
          translation_cn: "Sengketa secara eksklusif diajukan ke Pengadilan Distrik Nanshan, Shenzhen; Pembeli melepaskan hak menuntut di Indonesia.",
          explanation_cn: "Memaksa importir Indonesia melakukan lititgasi di luar negeri di Shenzhen membutuhkan biaya notaris internasional, legalisasi kedutaan, dan biaya pengacara China per jam yang luar biasa mahal, menghalangi Pembeli mencari keadilan secara ekonomis."
        },
        {
          topic_cn: "Pengesampingan Hukum Konsumen Indonesia dan Bahasa Indonesia",
          risk_level: "HIGH",
          original_text: "menafikan keberlakuan hukum perlindungan konsumen domestik Indonesia, termasuk persyaratan naskah bilingual dwibahasa di bawah UU No. 24/2009.",
          translation_cn: "Secara tegas mengecualikan semua aturan perlindungan konsumen Indonesia dan kewajiban kontrak bahasa ganda.",
          explanation_cn: "Undang-Undang No. 24 Tahun 2009 adalah kebijakan publik yang wajib di Indonesia. Kegagalan menyusun dan menandatangani kontrak dalam versi bahasa ganda Indonesia membuat draf kontrak berisiko dinyatakan batal demi hukum oleh pengadilan setempat."
        },
        {
          topic_cn: "Batas Akumulasi Kewajiban Ganti Rugi Hanya USD 500",
          risk_level: "HIGH",
          original_text: "Penjual atas cacat pengiriman, kebakaran... atau kerugian finansial reputasi Pembeli di bawah kontrak ini dibatasi maksimal sebesar USD 500.",
          translation_cn: "Akumulasi tanggung jawab Penjual atas cacat atau kebakaran sirkuit dibatasi maksimal USD 500 saja.",
          explanation_cn: "Jika kapasitor yang tidak stabil terbakar dan menghanguskan gudang penyimpanan utama Anda di Jakarta Utara, Anda menderita kerugian fisik ratusan ribu dolar namun terikat kontrak sehingga tidak bisa menuntut ganti rugi melebihi USD 500."
        }
      ],
      missing_clauses: [
        {
          name_cn: "Klausul Kebijakan RMA Komersial dan Pemotongan Invoice Cacat",
          name_id: "Klausul Mekanisme Retur dan Penukaran Barang Cacat (RMA)",
          importance_cn: "Tanpa mekanisme RMA yang jelas, Pembeli terpaksa menanggung seluruh biaya logistik ekspor untuk mengirim kembali komponen rusak ke pabrik asal di China atau menderita kerugian penyusutan barang secara penuh."
        },
        {
          name_cn: "Ketegasan Istilah Pengapalan Incoterms 2020",
          name_id: "Ketegasan Istilah Pengapalan Incoterms 2020 (CIF/FOB)",
          importance_cn: "Sangat penting untuk memperjelas apakah pengiriman bersifat CIF Tanjung Priok atau FOB Shenzhen guna menentukan pihak mana yang bertanggung jawab atas bea impor lokal, penanganan pelabuhan, asuransi laut, dan risiko kerusakan kontainer."
        },
        {
          name_cn: "Penyelesaian Sengketa Arbitrase SIAC Singapura",
          name_id: "Klausul Penyelesaian Sengketa di SIAC Singapura",
          importance_cn: "Forum arbitrase netral yang dihormati secara internasional. Menghindari kerugian di pengadilan pengirim maupun pengadilan penerima, memangkas biaya sengketa, dan keputusan dapat dieksekusi di China maupun Indonesia."
        }
      ],
      cultural_legal_notes: [
        "Pemasok di wilayah Tiongkok Selatan sangat terbiasa menggunakan template ekspor instan mereka. Mereka berusaha melepas tanggung jawab cacat manufaktur sepenuhnya. Importir lokal tidak boleh setuju pada janji lisan 'kami pasti ganti jika ada masalah' - semuanya harus dicatat secara tertulis.",
        "Undang-Undang No. 24 Tahun 2009 mewajibkan versi Bahasa Indonesia untuk setiap kontrak komersial yang melibatkan entitas Indonesia. Hakim di Pengadilan Negeri seringkali berpihak pada kepentingan pengusaha lokal seandainya draf kontrak tidak memiliki salinan bilingual.",
        "Denda keterlambatan 5% per minggu dikategorikan sebagai bunga lintah darat (Usury) dalam hukum Indonesia. Hakim memiliki wewenang diskresioner (Pasal 1338 KUHPerdata) untuk memotong denda yang sangat eksesif tersebut menjadi suku bunga tahunan wajar sekitar 6%-10%."
      ]
    };
  }

  // Fallback for English Contract Demo translated to Bahasa Indonesia
  return {
    contract_type: "Perjanjian Jual Beli Barang Internasional",
    contract_type_en: "International Goods Purchase and Sale Agreement",
    party_a: "Guangzhou Dingsheng Electronic Technology Co., Ltd. (Pemasok)",
    party_b: "PT Sinar Jaya Elektronik Indonesia (Importir)",
    duration: "1 Tahun, perpanjangan otomatis terus-menerus kecuali ditolak tertulis",
    summary_mandarin: "Laporan analisis hukum mendalam atas Perjanjian Jual Beli Barang Internasional. Kontrak ini menunjukkan tingkat paparan risiko yang sangat tinggi bagi importir Indonesia, PT Sinar Jaya (Pembeli). Klausul-klausul di dalamnya sangat condong menguntungkan Guangzhou Dingsheng (Penjual), termasuk: hak penyesuaian harga sepihak yang bebas hanya dengan pemberitahuan 7 hari via email, peniadaan garansi penuh atas bahaya korsleting di bawah klausul 'AS-IS', denda keterlambatan pembayaran berbunga komposit yang sangat ekstrim sebesar 5% per minggu, kewajiban penyerahan database pelanggan lokal Pembeli ke Penjual secara cuma-cuma jika kontrak berakhir, serta yurisdiksi eksklusif di Pengadilan Shenzhen Nanshan, China. Perubahan kontrak secara mendasar sangat disarankan sebelum penandatanganan.",
    conclusion: "Struktur kontrak yang mengikat ini harus ditolak keras oleh PT Sinar Jaya. Ketentuan di dalamnya mengikat pembeli dalam komitmen komersial dan utang yang berat tanpa perlindungan timbal balik terkait stabilitas harga, jaminan cacat tersembunyi, maupun kepemilikan database pelanggan. Jika terjadi bahaya kebakaran akibat korsleting sirkuit di gudang Jakarta, seluruh tanggung jawab finansial dan hukum konsumen akan ditanggung oleh Pembeli sementara tuntutan balik terhalang proses hukum di luar negeri. Desak pemindahan yurisdiksi ke SIAC Singapura, ubah denda keterlambatan menjadi denda tunggal harian wajar, perpanjang waktu pemeriksaan fisik menjadi 15 hari kerja, dan tetapkan jaminan garansi kualitas produk (RMA) yang adil.",
    full_translation_mandarin: "",
    risk_score: 95,
    risk_level: "HIGH",
    risk_verdict: "Kontrak penjualan internasional yang sangat agresif dan berat sebelah, mengalihkan seluruh beban biaya manufaktur, risiko pertanggungjawaban produk cacat, denda keterlambatan yang eksesif kepada Pembeli, sekaligus mempertahankan hak sepihak untuk merebut database komersial lokal milik Pembeli.",
    red_flags: [
      {
        title_cn: "Hak Penyesuaian Harga Sepihak oleh Penjual (Article 1)",
        original_text: "the Seller reserves the absolute, unilateral right (unilaterally) to adjust, increase, or modify the unit price of any product in outstanding or incoming commercial orders at any time.",
        translation_cn: "Penjual memegang wewenang sepihak mutlak untuk menyesuaikan, menaikkan, atau memodifikasi harga unit barang kapan saja.",
        explanation_cn: "Peniadaan stabilitas harga ini memaksa Pembeli menerima kejutan kenaikan biaya mendadak di tengah pengiriman. Tanpa batasan atau hak keluar bagi Importir, Pembeli terpaksa melunasi pembayaran dengan harga yang membengkak.",
        suggested_fix_cn: "Tetapkan harga tetap selama 12 bulan. Segala kenaikan harus didiskusikan secara bertulis terlebih dahulu, dibatasi maksimal 5% per tahun, dan memberi hak 30 hari kepada Pembeli untuk membatalkan pesanan tertunda tanpa dikenakan biaya denda.",
        law_reference: "Prinsip Itikad Baik & Kepatutan (Pasal 1338 KUHPerdata)"
      },
      {
        title_cn: "Peniadaan Kualitas Produk Garansi sirkuit 'AS-IS' (Article 2)",
        original_text: "All electronic components... are supplied on a strict 'AS-IS' basis at the port of departure... Seller explicitly disclaims all statutory and common-law warranties, express or implied",
        translation_cn: "Seluruh barang disuplai atas dasar 'AS-IS' (apa adanya) di pelabuhan keberangkatan, mengesampingkan garansi wajib.",
        explanation_cn: "Ketentuan ini membebankan seluruh risiko kegagalan manufaktur sirkuit hardware kepada Pembeli. Jika komponen atau baterai terbakar di gudang Jakarta, PT Sinar Jaya harus memikul tanggung jawab hukum gugatan konsumen, sementara Penjual bebas tuntutan.",
        suggested_fix_cn: "Ganti dengan: 'Pemasok menjamin seluruh produk bebas dari cacat manufaktur, perakitan, dan firmware selama 12 bulan sejak tanggal penerimaan bea cukai, dan wajib mengganti rugi kerusakan akibat cacat produksi.'",
        law_reference: "Undang-Undang Perlindungan Konsumen No. 8 Tahun 1999"
      },
      {
        title_cn: "Waktu Pemeriksaan Fisik yang Singkat 3 Hari (Article 2.3)",
        original_text: "complete visual and functional inspection... within 3 calendar days of offloading... Failure to raise written complaints within 3 days translates to full and absolute acceptance",
        translation_cn: "Pemeriksaan visual dan fungsi penuh wajib selesai dalam 3 hari setelah bongkar muat.",
        explanation_cn: "Pelunasan pabean kontainer dan mobilisasi ke gudang di Jakarta membutuhkan waktu minimal 10-14 hari. Batas waktu 3 hari ini ditujukan untuk menghapus hak klaim Pembeli atas cacat komponen sirkuit tersembunyi yang baru tampak kala beroperasi.",
        suggested_fix_cn: "Ubah batas waktu pemeriksaan visual menjadi 15 hari kerja untuk penampilan luar, dan 90 hari uji coba fungsi mendalam atas sirkuit internal dan komponen chip tersembunyi.",
        law_reference: "Doktrin Cacat Tersembunyi (Hidden Defects) Hukum Dagang"
      },
      {
        title_cn: "Denda Overdue Pembayaran 5% Komposit Mingguan (Article 3.3)",
        original_text: "overdue principal amounts shall accumulate a weekly late penalty of five percent (5%), compounded weekly. This penalty will accrue compounding interest recursively without any percentage cap",
        translation_cn: "Tunggakan pokok dikenakan denda sebesar 5% per minggu secara berbunga majemuk tanpa batas atas.",
        explanation_cn: "Denda keterlambatan 5% per minggu berbunga majemuk setara dengan beban bunga tahunan gila-gilaan melebih 1100%! Ini adalah denda riba (usury). Halangan kliring kawat valas bank lokal atau libur nasional akan menumpuk utang secara ekstrem.",
        suggested_fix_cn: "Ubah denda menjadi bunga tunggal sebesar 0.05% per hari (sekitar 18% per tahun), dengan batas total akumulasi denda maksimal 5% dari nilai invoice tertunda.",
        law_reference: "Kepatutan Hukum & Ketentuan Batas Atas Bunga Denda"
      }
    ],
    risky_clauses: [
      {
        topic_cn: "Yurisdiksi Pengadilan Distrik Nanshan, Shenzhen, China",
        risk_level: "HIGH",
        original_text: "resolved exclusively by the People's Court of Nanshan District, Shenzhen City, PRC.",
        translation_cn: "Sengketa secara eksklusif diselesaikan di Pengadilan Distrik Nanshan, Shenzhen, China.",
        explanation_cn: "Memaksa pembeli mengurus persidangan di Shenzhen membutuhkan sertifikasi kedutaan besar, notaris internasional, dokumen terjemahan resmi, dan biaya pengacara China per jam yang fantastis, mematikan hak komplain Pembeli secara finansial."
      },
      {
        topic_cn: "Penyitaan Database Pelanggan Indonesia Tanpa Biaya",
        risk_level: "HIGH",
        original_text: "customer databases... developed by the Buyer... shall automatically transfer, at zero cost... to the sole and exclusive ownership of the Seller upon termination.",
        translation_cn: "Database pelanggan beralih otomatis ke kepemilikan eksklusif Penjual secara cuma-cuma saat pemutusan kontrak.",
        explanation_cn: "Database pelanggan di Indonesia adalah kekayaan intelektual sangat berharga. Menyitanya secara gratis memudahkan supplier menyetop kontrak secara tiba-tiba demi memindahkan sistem penjualan ke sub-distributor baru yang murah."
      },
      {
        topic_cn: "Pemutusan Sepihak Kilat 24 Jam Tanpa Kompensasi",
        risk_level: "HIGH",
        original_text: "Seller may terminate in 24 hours without cause... Buyer must provide 12 months prior written notice.",
        translation_cn: "Penjual dapat memutuskan kontrak via email dalam 24 jam; Pembeli butuh penundaan 12 bulan.",
        explanation_cn: "Ketentuan pembatalan sepihak sekejap yang tidak seimbang ini melumpuhkan stabilitas rantai pasokan Pembeli tepat sebelum musim penjualan ramai, sedangkan mengikat Pembeli dalam kuota impor wajib selama 12 bulan meskipun pasar lokal jatuh."
      }
    ],
    missing_clauses: [
      {
        name_cn: "Pertanggungjawaban Pengiriman Incoterms 2020",
        name_id: "Ketegasan Istilah Pengapalan Incoterms 2020 (CIF/FOB)",
        importance_cn: "Tanpa Incoterm yang jelas (seperti DDP Jakarta atau FOB Shenzhen), tidak ada kepastian siapa yang menanggung asuransi laut, pengurusan bea cukai impor, atau denda demurrage dari keterlambatan kontainer di pelabuhan pelabuhan."
      },
      {
        name_cn: "SIAC Arbitrase Singapura Sebagai Forum Sengketa Netral",
        name_id: "Klausul Penyelesaian Sengketa di SIAC Singapura",
        importance_cn: "Sangat disarankan. Beralih ke Singapura menjamin persidangan hukum didasari prinsip keadilan trilingual yang dihormati secara internasional, memangkas beban litigasi, dan keputusan dapat langsung dieksekusi di China maupun Indonesia."
      }
    ],
    cultural_legal_notes: [
      "Mitra pabrik Tiongkok Selatan sangat menyukai template ekspor instan mereka. Mereka melepas klausul keamanan hardware. Pembeli dilarang menerima kesepakatan lisan 'Gampang, masalah ganti rugi nanti kita atur lewat Whatsapp' - semuanya wajib tertulis.",
      "Ketiadaan bahasa kembaran (Indonesia) melanggar kewajiban bilingual UU No. 24 Tahun 2009. Hakim setempat sering menolak keabsahan kontrak asing penuh seandainya timbul sengketa di tanah air.",
      "Denda 5% berbunga majemuk mingguan dapat dipangkas oleh institusi pengadilan Indonesia karena dikategorikan sebagai lintah darat (Usury) yang melanggar nilai kepantasan sosial usaha."
    ]
  };
}
