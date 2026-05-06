// import firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// config
const firebaseConfig = {
  apiKey: "API_KEY_KAMU",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
};

// init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let layanan="";
let namaUser="";
let idPelanggan="";

window.pilihLayanan = function(el,nama){
  document.querySelectorAll('.opsi-box').forEach(x=>x.classList.remove('active'));
  el.classList.add('active');
  layanan=nama;
  let input=document.getElementById("userName");
  input.removeAttribute("readonly");
  input.placeholder="Masukan Nama Anda...";
  input.focus();
}

window.cekLayanan = function(){
  if(layanan==""){
    alert("Silakan pilih layanan terlebih dahulu");
  }
}

window.startApp = function(){
  if(layanan==""){
    alert("Pilih layanan dulu");
    return;
  }
  let nama=document.getElementById("userName").value.trim();
  if(nama==""){
    alert("Masukkan nama");
    return;
  }
  namaUser = nama;
  idPelanggan = document.getElementById("kodePelanggan").innerText.replace("No Pelanggan : ","");
  document.getElementById("helloUser").innerText="Horas! "+nama;
  document.getElementById("layananShow").innerText=layanan;
  document.getElementById("splash").style.display="none";
  document.querySelector("header").style.display="flex";
  document.querySelector("nav").style.display="flex";
  document.getElementById("home").style.display="block";
  if(nama==="AdminBatakEssence01#"){
    document.getElementById("navAdmin").style.display="block";
  }else{
    document.getElementById("navAdmin").style.display="none";
  }
}

window.ubahLayanan = function(){
  document.getElementById("splash").style.display="flex";
  document.querySelector("header").style.display="none";
  document.querySelector("nav").style.display="none";
  document.querySelectorAll('.page').forEach(p=>p.style.display='none');
}

window.onload=function(){
  // sembunyikan semua page dulu
  document.querySelectorAll('.page').forEach(p=>{
    p.style.display = 'none';
  });
  // pastikan success hidden
  document.getElementById("success").style.display = "none";
  document.querySelector("header").style.display = "none";
  document.querySelector("nav").style.display = "none";
  document.getElementById("splash").style.display = "flex";
  let now = new Date();
  const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  let hariArr = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  document.getElementById("tanggalAdmin").innerText =
    hariArr[now.getDay()] + ", " +
    String(now.getDate()).padStart(2,"0") + " " +
    bulan[now.getMonth()] + " " +
    now.getFullYear();
  let d=new Date();
  let kode=
    d.getFullYear().toString().slice(-2)+
    String(d.getMonth()+1).padStart(2,"0")+
    String(d.getDate()).padStart(2,"0")+
    Math.floor(Math.random()*900+100);
  document.getElementById("kodePelanggan").innerText="No Pelanggan : "+kode;
}

// FILTER
window.filterCat = function(cat, el){
  // active style reset
  document.querySelectorAll(".cat").forEach(c=>{
    c.style.background="#fff";
    c.style.color="#000";
  });
  // active
  el.style.background="#d4af37";
  el.style.color="#111";
  // filter
  let items = document.querySelectorAll(".card");
  items.forEach(item=>{
    let itemCat = item.getAttribute("data-cat");
    if(cat === "all"){
      item.style.display="block";
    }else{
      item.style.display = (itemCat === cat) ? "block" : "none";
    }
  });
}

// DETAIL PRODUCT
window.openProduct = function(title, price, desc, images){
  document.getElementById("productModal").style.display="flex";
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalPrice").innerText = "Rp " + price.toLocaleString();
  document.getElementById("modalDesc").innerText = desc;
  document.getElementById("modalMainImg").src = images[0];
  let thumbContainer = document.querySelector(".modal-thumb");
  thumbContainer.innerHTML = "";
  images.forEach(img => {
    thumbContainer.innerHTML += `
    <img src="${img}" onclick="changeImg('${img}')">
    `;
  });
}

window.closeModal = function(){
  document.getElementById("productModal").style.display="none";
}

window.changeImg = function(src){
  document.getElementById("modalMainImg").src = src;
}

// TAMBAH KERANJANG
let cart = [];
let total = 0;
let count = 0;

window.addToCart = function(name, price, img){
  let existing = cart.find(item => item.name === name);
  if(existing){
    existing.qty += 1;
  }else{
    cart.push({
      name: name,
      price: price,
      img: img,
      qty: 1
    });
  }
  count++;
  document.getElementById("count").innerText = count;
  renderCart();
  closeModal();
  showToast(name + " masuk keranjang");
  updateTotalBayar();
}

function showCart(){
  console.log(cart);
}

window.setNav = function(el){
  document.querySelectorAll('.nav-item').forEach(item=>item.classList.remove('active'));
  el.classList.add('active');
}

// SEARCH PRODUCT
window.searchProduk = function(){
  let keyword = document.getElementById("searchInput").value.toLowerCase();
  let cards = document.querySelectorAll(".card");
  cards.forEach(card=>{
    let nama = card.querySelector(".name").innerText.toLowerCase();
    if(nama.includes(keyword)){
      card.style.display = "block";
    }else{
      card.style.display = "none";
    }
  });
}

// CART
window.openPage = function(page){
  document.querySelectorAll('.page').forEach(p=>{
    p.style.display='none';
    p.classList.remove("active");
  });
  let target = document.getElementById(page);
  // ✅ khusus success pakai flex
  if(page === "success"){
    target.style.display = "flex";
  }else{
    target.style.display = "block";
  }
  if(page === "cart"){
    renderCart();
    document.getElementById("cartLayanan").innerText = layanan;
    let subtotal = 0;
    cart.forEach(item=>{
      subtotal += item.price * item.qty;
    });
    let ongkir = 0;
    if(layanan === "Delivery"){
      ongkir = hitungOngkir(subtotal);
    }
    let totalAkhir = subtotal + ongkir;
    document.getElementById("totalBayarPage").innerText = "Rp " + totalAkhir.toLocaleString();
  }
  if(page === "bayar"){
    updateTotalBayar();
  }
}

function hitungOngkir(subtotal){
  subtotal = Number(subtotal);
  if(subtotal <= 0) return 0;
  return Math.ceil(subtotal / 200000) * 30000;
}

window.renderCart = function(){
  let wrap = document.getElementById("cartItems");
  if(cart.length === 0){
    wrap.innerHTML = `<div class="empty-cart">Keranjang masih kosong</div>`;
    document.getElementById("cartTotal").innerText = "Rp 0";
    document.getElementById("cartOngkir").innerText = "Rp 0";
    return;
  }
  let html = "";
  let totalHarga = 0;
  cart.forEach((item,index)=>{
    let subtotal = item.price * item.qty;
    totalHarga += subtotal;
    html += `
      <div class="cart-item">
        <img src="${item.img}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>Rp ${item.price.toLocaleString()} / pcs</p>
        </div>
        <div class="qty-box">
          <button class="qty-btn" onclick="kurangQty(${index})">-</button>
          <input type="number" 
          class="qty-input" 
          value="${item.qty}" 
          min="1"
          onchange="inputQty(${index}, this.value)">
          <button class="qty-btn" onclick="tambahQty(${index})">+</button>
        </div>
        <b class="subtotal">
        Rp ${subtotal.toLocaleString()}
        </b>
      </div>
    `;
  });
  wrap.innerHTML = html;
  let ongkir = 0;
  if(layanan === "Delivery"){
    ongkir = hitungOngkir(totalHarga);
  }
  document.getElementById("cartTotal").innerText = "Rp " + (totalHarga + ongkir).toLocaleString();
  document.getElementById("cartOngkir").innerText = "Rp " + ongkir.toLocaleString();
}

window.tambahQty = function(index){
  cart[index].qty++;
  count++;
  document.getElementById("count").innerText = count;
  renderCart();
  updateTotalBayar();
}

window.kurangQty = function(index){
  cart[index].qty--;
  if(count > 0) count--;
  if(cart[index].qty <= 0){
    cart.splice(index,1);
  }
  if(count < 0){
    count = 0;
  }
  document.getElementById("count").innerText = count;
  renderCart();
  updateTotalBayar();
}

window.hapusItem = function(index){
  count -= cart[index].qty;
  if(count < 0){
    count = 0;
  }
  cart.splice(index,1);
  document.getElementById("count").innerText = count;
  renderCart();
  updateTotalBayar();
}

// CEKOUT CHART
function checkoutCart(){
  if(cart.length === 0){
    alert("Keranjang masih kosong");
    document.getElementById("cartTotal").innerText = "Rp 0";
    document.getElementById("cartOngkir").innerText = "Rp 0";
    return;
  }
  alert("Pesanan berhasil diproses");
  cart = [];
  count = 0;
  document.getElementById("count").innerText = "0";
  renderCart();
  openPage("home");
}

window.goToBayar = function(){
  if(cart.length === 0){
    alert("Keranjang masih kosong");
    return;
  }
  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.qty;
  });
  let ongkir = 0;
  if(layanan === "Delivery"){
    ongkir = hitungOngkir(total);
  }
  total = total + ongkir;
  document.getElementById("totalBayarPage").innerText = "Rp " + total.toLocaleString();
  openPage("bayar");
  document.querySelectorAll('.nav-item').forEach(item=>item.classList.remove('active'));
  document.getElementById("navBayar").classList.add("active");
}

window.pilihBayar = function(el,metode){
  // reset semua tombol
  document.querySelectorAll('.pay-card').forEach(card=>{
    card.classList.remove('active');
  });
  // aktifkan yg dipilih
  el.classList.add('active');
  // tampilkan box sesuai pilihan
  if(metode === "qris"){
    document.getElementById("boxQris").style.display = "block";
    document.getElementById("boxBank").style.display = "none";
  }else{
    document.getElementById("boxQris").style.display = "none";
    document.getElementById("boxBank").style.display = "block";
  }
}

window.konfirmasiPembayaran = function(){
  if(cart.length===0){
    alert("Keranjang kosong");
    return;
  }
  // VALIDASI UPLOAD
  let file = document.querySelector('input[type="file"]').files[0];
  if(!file){
    alert("Upload bukti pembayaran dulu!");
    return;
  }
  // WAKTU
  let now = new Date();
  let waktu =
    String(now.getHours()).padStart(2,"0") + ":" +
    String(now.getMinutes()).padStart(2,"0");
  // PRODUK
  let produkHTML = "";
  let total = 0;
  cart.forEach(item=>{
    let sub = item.price * item.qty;
    total += sub;
    produkHTML += `
    <div style="display:flex;justify-content:space-between;">
      <span>${item.name} x${item.qty}</span>
      <span>Rp ${sub.toLocaleString()}</span>
    </div>
    `;
  });
  // ONGKIR
  let ongkir = 0;
  if(layanan === "Delivery"){
    ongkir = hitungOngkir(total);
  }
  let totalAkhir = total + ongkir;
  document.getElementById("sOngkir").innerText = "Rp " + ongkir.toLocaleString();
  // =======================
  // ISI HALAMAN SUCCESS
  // =======================
  document.getElementById("sNama").innerText = namaUser;
  document.getElementById("sId").innerText = idPelanggan;
  document.getElementById("sWaktu").innerText = waktu;
  document.getElementById("sLayanan").innerText = layanan;
  document.getElementById("sProduk").innerHTML = produkHTML;
  document.getElementById("sTotal").innerText = "Rp " + totalAkhir.toLocaleString();
  // =======================
  // MASUKKAN KE ADMIN (kode lama kamu)
  // =======================
  let tbody = document.getElementById("adminTableBody");
  let no = tbody.rows.length + 1;
  let produkText = cart.map(item =>
    item.name + " x" + item.qty
  ).join("<br>");
  tbody.innerHTML += `
    <tr>
      <td>${no}</td>
      <td><span class="layanan-badge ${layanan.replace(' ','-')}">
        ${layanan}</span>
      </td>
      <td>${waktu}</td>
      <td>${idPelanggan}</td>
      <td>${namaUser}</td>
      <td>${produkText}</td>
      <td>
      <select onchange="updateStatus(this)">
        <option value="Diproses">Diproses</option>
        <option value="Selesai">Selesai</option>
      </select>
      </td>
    </tr>
  `;
  sortAdminTable();
  updateAdminSummary();
// =======================
// SIMPAN KE FIREBASE
// =======================
addDoc(collection(db, "orders"), {
  nama: namaUser,
  id: idPelanggan,
  layanan: layanan,
  produk: cart,
  total: totalAkhir,
  waktu: new Date().toISOString(),
  status: "Diproses"
})
.then(() => {
  console.log("Berhasil masuk Firebase ✅");
})
.catch((err) => {
  console.error("Gagal ❌", err);
});
  // =======================
  // RESET CART
  // =======================
  orders.push({
    nama: namaUser,
    id: idPelanggan,
    waktu: waktu,
    layanan: layanan,
    produk: JSON.parse(JSON.stringify(cart)),
    total: totalAkhir
  });
  cart = [];
  count = 0;
  document.getElementById("count").innerText="0";
  renderCart();
  // =======================
  // PINDAH KE SUCCESS PAGE
  // =======================
  openPage("success");
  // trigger ulang animasi
  let check = document.querySelector(".checkmark");
  check.innerHTML = check.innerHTML;
}

function sortAdminTable(){
  let tbody = document.getElementById("adminTableBody");
  let rows = Array.from(tbody.querySelectorAll("tr"));
  rows.sort((a,b)=>{
  let statusA = a.querySelector("select").value;
  let statusB = b.querySelector("select").value;
  // 1. Diproses selalu di atas
  if(statusA !== statusB){
    return statusA === "Diproses" ? -1 : 1;
  }
  // 2. kalau sama, urutkan waktu terbaru di atas
  let timeA = a.children[2].innerText;
  let timeB = b.children[2].innerText;
  return timeB.localeCompare(timeA);
  });
  tbody.innerHTML = "";
  rows.forEach(r=>tbody.appendChild(r));
  updateAdminSummary();
}

window.updateStatus = function(el){
  if(el.value === "Selesai"){
    el.style.background = "#dcfce7";
    el.style.color = "#166534";
  }else{
    el.style.background = "#fef3c7";
    el.style.color = "#92400e";
  }
  sortAdminTable();
  updateAdminSummary();
}

window.updateAdminSummary = function(){
  let rows = document.querySelectorAll("#adminTableBody tr");
  let total = rows.length;
  let proses = 0;
  let selesai = 0;
  rows.forEach(r=>{
    let status = r.querySelector("select").value;
    if(status === "Diproses") proses++;
    if(status === "Selesai") selesai++;
  });
  document.getElementById("totalOrder").innerText = total;
  document.getElementById("orderProses").innerText = proses;
  document.getElementById("orderSelesai").innerText = selesai;
}

window.showToast = function(msg){
  let toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(()=>{
    toast.classList.remove("show");
  }, 2000); // 2 detik hilang sendiri
}

window.openSuccess = function(){
  if(orders.length === 0){
    alert("Belum ada pesanan");
    return;
  }
  // filter order berdasarkan ID pelanggan
  let userOrders = orders.filter(o => o.id === idPelanggan);
  if(userOrders.length === 0){
    alert("Belum ada pesanan");
    return;
  }
  let produkHTML = "";
  let grandTotalProduk = 0;
  let grandTotalAkhir = 0;
  userOrders.forEach(order => {
    let subtotalOrder = 0;
    let ongkir = 0;
    produkHTML += `
      <div style="margin-bottom:10px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;">
      <div style="font-size:12px;color:#64748b;">
      ${order.waktu} - ${order.layanan}
      </div>
    `;
    order.produk.forEach(item=>{
      let sub = item.price * item.qty;
      subtotalOrder += sub;
      grandTotalProduk += sub;
      produkHTML += `
        <div style="display:flex;justify-content:space-between;">
          <span>${item.name} x${item.qty}</span>
          <span>Rp ${sub.toLocaleString()}</span>
        </div>
       `;
    });
    // ONGKIR PER ORDER
    if(order.layanan === "Delivery"){
      ongkir = hitungOngkir(subtotalOrder);
    }
    // tampilkan ongkir per order
    produkHTML += `
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#16a34a;margin-top:4px;">
        <span>Ongkir</span>
        <span>Rp ${ongkir.toLocaleString()}</span>
      </div>
    `;
    grandTotalAkhir += subtotalOrder + ongkir;
    produkHTML += `</div>`;
  });
  // isi data ke UI
  document.getElementById("sNama").innerText = namaUser;
  document.getElementById("sId").innerText = idPelanggan;
  document.getElementById("sWaktu").innerText = "-";
  document.getElementById("sLayanan").innerText = "Multiple Order";  
  document.getElementById("sProduk").innerHTML = produkHTML;
  document.getElementById("sOngkir").innerText = "";
  document.getElementById("sOngkir").style.display = "none";
  document.getElementById("sTotal").innerText = "Rp " + grandTotalAkhir.toLocaleString();
  openPage("success");
}

let orders = [];

window.inputQty = function(index, value){
  let val = parseInt(value);
  if(isNaN(val) || val < 1){
    val = 1;
  }
  // update count lama dikurangi dulu
  count -= cart[index].qty;
  // set qty baru
  cart[index].qty = val;
  // tambah ke count
  count += val;
  document.getElementById("count").innerText = count;
  renderCart();
  updateTotalBayar();
}

function updateTotalBayar(){
  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.qty;
  });
  let ongkir = 0;
  if(layanan === "Delivery"){
    ongkir = hitungOngkir(total);
  }
  let totalAkhir = total + ongkir;
  let el = document.getElementById("totalBayarPage");
  // ❗ cek dulu biar ga error kalau belum di halaman bayar
  if(el){
    el.innerText = "Rp " + totalAkhir.toLocaleString();
  }
}

