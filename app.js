
const produkAwal = [
    {id: 1, nama: "Nasi Goreng", kategori: "Makanan", harga: 15000, stok: 20, gambar: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500"},
    {id: 2, nama: "Mie Goreng", kategori: "Makanan", harga: 12000, stok: 15, gambar: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500"},
    {id: 3, nama: "Ayam Geprek", kategori: "Makanan", harga: 18000, stok: 12, gambar: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"},
    {id: 4, nama: "Burger", kategori: "Makanan", harga: 20000, stok: 10, gambar: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"},
    {id: 5, nama: "Pizza", kategori: "Makanan", harga: 25000, stok: 8, gambar: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"},
    {id: 6, nama: "Kentang Goreng", kategori: "Makanan", harga: 10000, stok: 20, gambar: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"},
    {id: 7, nama: "Sate Ayam", kategori: "Makanan", harga: 18000, stok: 14, gambar: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=500"},
    {id: 8, nama: "Roti Bakar", kategori: "Makanan", harga: 12000, stok: 16, gambar: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"},
    {id: 9, nama: "Es Teh", kategori: "Minuman", harga: 5000, stok: 30, gambar: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"},
    {id: 10, nama: "Jus Jeruk", kategori: "Minuman", harga: 8000, stok: 18, gambar: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500"},
    {id: 11, nama: "Kopi Susu", kategori: "Minuman", harga: 12000, stok: 15, gambar: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500"},
    {id: 12, nama: "Air Mineral", kategori: "Minuman", harga: 4000, stok: 40, gambar: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"}
];

let produk = JSON.parse(localStorage.getItem("produkPOS")) || produkAwal;
let riwayat = JSON.parse(localStorage.getItem("riwayatPOS")) || [];
let keranjang = [];

function simpanData() {
    localStorage.setItem("produkPOS", JSON.stringify(produk));
    localStorage.setItem("riwayatPOS", JSON.stringify(riwayat));
}

function rupiah(angka) {
    return "Rp" + Number(angka).toLocaleString("id-ID");
}

function aman(teks) {
    return String(teks).replace(/[&<>"']/g, karakter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[karakter]);
}

function tanggalSekarang() {
    return new Date().toLocaleDateString("id-ID");
}

function tanggalWaktu() {
    return new Date().toLocaleString("id-ID");
}

function perbaruiTampilan() {
    document.getElementById("tanggal").textContent = tanggalSekarang();

    let transaksiHariIni = riwayat.filter(item =>
        new Date(item.waktu).toDateString() === new Date().toDateString()
    );

    let omzet = transaksiHariIni.reduce((total, item) => total + item.total, 0);
    let stok = produk.reduce((total, item) => total + Number(item.stok), 0);

    document.getElementById("omzet").textContent = rupiah(omzet);
    document.getElementById("totalStok").textContent = stok;
    document.getElementById("jumlahTransaksi").textContent = transaksiHariIni.length;

    tampilkanProduk();
    tampilkanKeranjang();
    tampilkanRiwayat();
}

function tampilkanProduk() {
    const tempat = document.getElementById("daftarProduk");
    const cari = document.getElementById("searchProduk").value.toLowerCase();
    const kategori = document.getElementById("filterKategori").value;

    const hasil = produk.filter(item =>
        item.nama.toLowerCase().includes(cari) &&
        (kategori === "Semua" || item.kategori === kategori)
    );

    tempat.innerHTML = "";

    if (hasil.length === 0) {
        tempat.innerHTML = `<p class="text-center text-secondary">Produk tidak ditemukan.</p>`;
        return;
    }

    hasil.forEach(item => {
        let badge = item.stok === 0
            ? `<span class="badge badge-habis">Stok Habis</span>`
            : item.stok < 5
                ? `<span class="badge badge-menipis">Stok Menipis</span>`
                : `<span class="badge badge-aman">Stok Aman</span>`;

        tempat.innerHTML += `
            <div class="col-md-6 col-xl-4">
                <div class="card produk-card">
                    <img src="${aman(item.gambar)}" alt="${aman(item.nama)}"
                         onerror="this.src='https://placehold.co/500x300?text=Produk'">

                    <div class="p-3">
                        <h6 class="fw-bold">${aman(item.nama)}</h6>
                        <small class="text-secondary">${aman(item.kategori)}</small>
                        <h6 class="mt-2" style="color:#8060c1">${rupiah(item.harga)}</h6>

                        <div class="mb-2">
                            ${badge}
                            <small class="ms-1">Stok: ${item.stok}</small>
                        </div>

                        <button class="btn btn-ungu btn-sm w-100 mb-2"
                            onclick="tambahKeranjang(${item.id})"
                            ${item.stok === 0 ? "disabled" : ""}>
                            <i class="bi bi-cart-plus"></i> Beli
                        </button>

                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-secondary btn-sm w-50"
                                onclick="editProduk(${item.id})">Edit</button>
                            <button class="btn btn-outline-danger btn-sm w-50"
                                onclick="hapusProduk(${item.id})">Hapus</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function tambahProduk() {
    let nama = prompt("Nama produk:");
    if (!nama || !nama.trim()) return;

    let kategori = prompt("Kategori (Makanan/Minuman):", "Makanan");
    if (!kategori) return;

    kategori = kategori.trim();
    kategori = kategori.charAt(0).toUpperCase() + kategori.slice(1).toLowerCase();

    if (!["Makanan", "Minuman"].includes(kategori)) {
        alert("Kategori harus Makanan atau Minuman.");
        return;
    }

    let harga = Number(prompt("Harga produk:"));
    if (!Number.isFinite(harga) || harga <= 0) {
        alert("Harga tidak valid.");
        return;
    }

    let stok = Number(prompt("Jumlah stok:"));
    if (!Number.isInteger(stok) || stok < 0) {
        alert("Stok tidak valid.");
        return;
    }

    let gambar = prompt("Link gambar produk:") || "https://placehold.co/500x300?text=Produk";

    produk.push({
        id: Date.now(),
        nama: nama.trim(),
        kategori,
        harga,
        stok,
        gambar: gambar.trim()
    });

    simpanData();
    perbaruiTampilan();
}

function editProduk(id) {
    let item = produk.find(p => p.id === id);
    if (!item) return;

    let nama = prompt("Nama produk:", item.nama);
    if (!nama || !nama.trim()) return;

    let harga = Number(prompt("Harga:", item.harga));
    let stok = Number(prompt("Stok:", item.stok));

    if (!Number.isFinite(harga) || harga <= 0 ||
        !Number.isInteger(stok) || stok < 0) {
        alert("Harga atau stok tidak valid.");
        return;
    }

    let gambar = prompt("Link gambar:", item.gambar);
    if (gambar === null) return;

    item.nama = nama.trim();
    item.harga = harga;
    item.stok = stok;
    item.gambar = gambar.trim();

    simpanData();
    perbaruiTampilan();
}

function hapusProduk(id) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    produk = produk.filter(item => item.id !== id);
    keranjang = keranjang.filter(item => item.id !== id);

    simpanData();
    perbaruiTampilan();
}

function tambahKeranjang(id) {
    let item = produk.find(p => p.id === id);
    if (!item || item.stok <= 0) return;

    let ada = keranjang.find(p => p.id === id);

    if (ada) {
        if (ada.jumlah >= item.stok) {
            alert("Jumlah melebihi stok tersedia.");
            return;
        }
        ada.jumlah++;
    } else {
        keranjang.push({...item, jumlah: 1});
    }

    tampilkanKeranjang();
}

function ubahJumlah(id, perubahan) {
    let item = keranjang.find(p => p.id === id);
    let dataProduk = produk.find(p => p.id === id);

    if (!item || !dataProduk) return;

    item.jumlah += perubahan;

    if (item.jumlah <= 0) {
        keranjang = keranjang.filter(p => p.id !== id);
    } else if (item.jumlah > dataProduk.stok) {
        item.jumlah = dataProduk.stok;
        alert("Jumlah sudah mencapai stok tersedia.");
    }

    tampilkanKeranjang();
}

function totalKeranjang() {
    return keranjang.reduce((total, item) =>
        total + item.harga * item.jumlah, 0
    );
}

function tampilkanKeranjang() {
    const tempat = document.getElementById("keranjang");
    tempat.innerHTML = "";

    if (keranjang.length === 0) {
        tempat.innerHTML = `<p class="text-secondary text-center">Belum ada produk dipilih.</p>`;
    }

    keranjang.forEach(item => {
        tempat.innerHTML += `
            <div class="keranjang-item">
                <div class="d-flex justify-content-between">
                    <strong>${aman(item.nama)}</strong>
                    <span>${rupiah(item.harga * item.jumlah)}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <small>${rupiah(item.harga)} / item</small>
                    <div>
                        <button class="btn btn-sm btn-light"
                            onclick="ubahJumlah(${item.id}, -1)">−</button>
                        <span class="mx-2">${item.jumlah}</span>
                        <button class="btn btn-sm btn-light"
                            onclick="ubahJumlah(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById("totalBelanja").textContent = rupiah(totalKeranjang());
    hitungKembalian();
}

function ubahMetode() {
    let metode = document.getElementById("metode").value;
    document.getElementById("bagianTunai").style.display =
        metode === "Tunai" ? "block" : "none";
}

function hitungKembalian() {
    let total = totalKeranjang();
    let uang = Number(document.getElementById("uangBayar").value) || 0;

    let kembalian = Math.max(0, uang - total);
    document.getElementById("kembalian").textContent = rupiah(kembalian);
}

function prosesPembayaran() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong.");
        return;
    }

    for (let item of keranjang) {
        let data = produk.find(p => p.id === item.id);
        if (!data || item.jumlah > data.stok) {
            alert("Stok " + item.nama + " tidak mencukupi.");
            return;
        }
    }

    let total = totalKeranjang();
    let metode = document.getElementById("metode").value;
    let uang = metode === "Tunai"
        ? Number(document.getElementById("uangBayar").value) || 0
        : total;

    if (uang < total) {
        alert("Uang pembayaran masih kurang.");
        return;
    }

    if (metode !== "Tunai" &&
        !confirm("Apakah pembayaran melalui " + metode + " sudah diterima?")) {
        return;
    }

    keranjang.forEach(item => {
        let data = produk.find(p => p.id === item.id);
        data.stok -= item.jumlah;
    });

    let transaksi = {
        nomor: "TRX-" + Date.now(),
        waktu: new Date().toISOString(),
        total,
        metode,
        uang,
        kembalian: uang - total,
        barang: keranjang.map(item => ({...item}))
    };

    riwayat.unshift(transaksi);

    buatStruk(transaksi);

    keranjang = [];
    document.getElementById("uangBayar").value = "";

    simpanData();
    perbaruiTampilan();

    // Tampilkan struk langsung di halaman.
    document.getElementById("receipt").style.display = "block";
    document.getElementById("receipt").scrollIntoView({behavior: "smooth"});

    alert("Pembayaran berhasil! Struk transaksi sudah ditampilkan.");
}

function buatStruk(data) {
    let isiBarang = data.barang.map(item => `
        <tr>
            <td colspan="2">${aman(item.nama)}</td>
        </tr>
        <tr>
            <td>${item.jumlah} x ${rupiah(item.harga)}</td>
            <td class="text-end">${rupiah(item.jumlah * item.harga)}</td>
        </tr>
    `).join("");

    document.getElementById("receipt").innerHTML = `
        <div class="text-center">
            <div class="receipt-logo">
                <i class="bi bi-bag-heart"></i>
            </div>
            <h4 class="receipt-title mt-2">LAVENDER STORE</h4>
            <p class="receipt-subtitle mb-1">Kasir Digital</p>
            <small>Terima kasih sudah berbelanja!</small>
        </div>

        <div class="receipt-line"></div>

        <div class="d-flex justify-content-between small">
            <span>No. Transaksi</span>
            <span>${aman(data.nomor)}</span>
        </div>
        <div class="d-flex justify-content-between small mt-1">
            <span>Tanggal</span>
            <span>${tanggalWaktu()}</span>
        </div>

        <div class="receipt-line"></div>

        <table class="receipt-table">
            ${isiBarang}
        </table>

        <div class="receipt-line"></div>

        <div class="receipt-total">
            <div class="d-flex justify-content-between">
                <strong>Total Belanja</strong>
                <strong>${rupiah(data.total)}</strong>
            </div>
            <div class="d-flex justify-content-between mt-2 small">
                <span>Metode Pembayaran</span>
                <span>${aman(data.metode)}</span>
            </div>
            <div class="d-flex justify-content-between mt-1 small">
                <span>Uang Diterima</span>
                <span>${rupiah(data.uang)}</span>
            </div>
            <div class="d-flex justify-content-between mt-1 small">
                <span>Kembalian</span>
                <span>${rupiah(data.kembalian)}</span>
            </div>
        </div>

        <div class="text-center receipt-footer mt-4">
            <strong>Terima Kasih!</strong>
            <p class="mb-0">Semoga hari Anda menyenangkan.</p>
            <small>Lavender Store - Belanja jadi lebih mudah</small>
        </div>
    `;
}

function tampilkanRiwayat() {
    const tempat = document.getElementById("daftarRiwayat");
    tempat.innerHTML = "";

    if (riwayat.length === 0) {
        tempat.innerHTML = `
            <tr><td colspan="4" class="text-center text-secondary">
                Belum ada transaksi.
            </td></tr>`;
        return;
    }

    riwayat.forEach((item, index) => {
        tempat.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${new Date(item.waktu).toLocaleString("id-ID")}</td>
                <td>${rupiah(item.total)}</td>
                <td>${aman(item.metode)}</td>
            </tr>
        `;
    });
}

perbaruiTampilan();
ubahMetode();
