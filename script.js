let layanan="";
let namaUser="";
let idPelanggan="";

function pilihLayanan(el,nama){
document.querySelectorAll('.opsi-box').forEach(x=>x.classList.remove('active'));
el.classList.add('active');
layanan=nama;

let input=document.getElementById("userName");
input.removeAttribute("readonly");
input.placeholder="Masukan Nama Anda...";
input.focus();
}

function cekLayanan(){
if(layanan==""){
alert("Silakan pilih layanan terlebih dahulu");
}
}

function startApp(){

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
idPelanggan = document.getElementById("kodePelanggan")
.innerText.replace("No Pelanggan : ","");

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

function ubahLayanan(){
document.getElementById("splash").style.display="flex";
document.querySelector("header").style.display="none";
document.querySelector("nav").style.display="none";
document.querySelectorAll('.page').forEach(p=>p.style.display='none');
}



window.onload=function(){
let now = new Date();

const bulan = [
"Januari","Februari","Maret","April","Mei","Juni",
"Juli","Agustus","September","Oktober","November","Desember"
];

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
function filterCat(cat, el){

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
function openProduct(title, price, desc, images){
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

function closeModal(){
  document.getElementById("productModal").style.display="none";
}

function changeImg(src){
  document.getElementById("modalMainImg").src = src;
}

// TAMBAH KERANJANG
let cart = [];
let total = 0;
let count = 0;

function addToCart(name, price, img){

  let existing = cart.find(item => item.name === name);

  if(existing){
    existing.qty += 1;
  } else {
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

  alert(name + " masuk keranjang");
}

function showCart(){
  console.log(cart);
}

function setNav(el){
document.querySelectorAll('.nav-item')
.forEach(item=>item.classList.remove('active'));

el.classList.add('active');
}

// SEARCH PRODUCT
function searchProduk(){
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
function openPage(page){
  document.querySelectorAll('.page').forEach(p=>{
    p.style.display='none';
  });

  document.getElementById(page).style.display='block';

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

document.getElementById("totalBayarPage").innerText =
"Rp " + totalAkhir.toLocaleString();

  }
}

function hitungOngkir(subtotal){
  subtotal = Number(subtotal);

  if(subtotal <= 0) return 0;

  return Math.ceil(subtotal / 200000) * 30000;
}


function renderCart(){
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

<b>${item.qty}</b>

<button class="qty-btn" onclick="tambahQty(${index})">+</button>

<b class="subtotal">
Rp ${subtotal.toLocaleString()}
</b>

</div>

</div>
`;

});

wrap.innerHTML = html;

let ongkir = 0;
if(layanan === "Delivery"){
ongkir = hitungOngkir(totalHarga);
}

document.getElementById("cartTotal").innerText =
"Rp " + (totalHarga + ongkir).toLocaleString();

document.getElementById("cartOngkir").innerText =
"Rp " + ongkir.toLocaleString();
}

function tambahQty(index){
cart[index].qty++;
count++;
document.getElementById("count").innerText = count;
renderCart();
}

function kurangQty(index){
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
}

function hapusItem(index){
count -= cart[index].qty;

if(count < 0){
count = 0;
}

cart.splice(index,1);

document.getElementById("count").innerText = count;
renderCart();
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

function goToBayar(){

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

document.getElementById("totalBayarPage").innerText =
"Rp " + total.toLocaleString();

openPage("bayar");

document.querySelectorAll('.nav-item')
.forEach(item=>item.classList.remove('active'));

document.getElementById("navBayar").classList.add("active");
}


function pilihBayar(el,metode){

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

function konfirmasiPembayaran(){

if(cart.length===0){
alert("Keranjang kosong");
return;
}

let now = new Date();

let hariArr = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

let hari = hariArr[now.getDay()];

let tanggal =
String(now.getDate()).padStart(2,"0") + "/" +
String(now.getMonth()+1).padStart(2,"0") + "/" +
now.getFullYear();

let waktu =
String(now.getHours()).padStart(2,"0") + ":" +
String(now.getMinutes()).padStart(2,"0");

let produk = cart.map(item =>
item.name + " x" + item.qty
).join("<br>");

let tbody = document.getElementById("adminTableBody");

let no = tbody.rows.length + 1;


tbody.innerHTML += `
<tr>
<td>${no}</td>
<td>
  <span class="layanan-badge ${layanan.replace(' ','-')}">
    ${layanan}
  </span>
</td>
<td>${waktu}</td>
<td>${idPelanggan}</td>
<td>${namaUser}</td>
<td>${produk}</td>
<td>
<select onchange="updateStatus(this)">
  <option value="Diproses">Diproses</option>
  <option value="Selesai">Selesai</option>
</select>
</td>
</tr>
`;

// styling row terakhir (BARU TAMBAH INI)
let lastSelect = tbody.querySelector("tr:last-child select");
lastSelect.style.background = "#fef3c7";
lastSelect.style.color = "#92400e";


sortAdminTable();
updateAdminSummary();

alert("Pesanan masuk ke dashboard admin");

cart = [];
count = 0;

document.getElementById("count").innerText="0";

renderCart();

openPage("home");

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
let timeA = a.children[1].innerText;
let timeB = b.children[1].innerText;

return timeB.localeCompare(timeA);

});

tbody.innerHTML = "";
rows.forEach(r=>tbody.appendChild(r));
updateAdminSummary();
}

function updateStatus(el){
  if(el.value === "Selesai"){
    el.style.background = "#dcfce7";
    el.style.color = "#166534";
  } else {
    el.style.background = "#fef3c7";
    el.style.color = "#92400e";
  }

  sortAdminTable();
updateAdminSummary();
}

function updateAdminSummary(){
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
