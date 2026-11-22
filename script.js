const initialDeals = [
  {id:1,name:"Gulab Jamun (2 pcs)",restaurant:"Spice Garden",price:48,original:80,type:"veg",qty:6,emoji:"🍩",bg:"#fff0df",rating:"4.8"},
  {id:2,name:"Masala Dosa",restaurant:"Spice Garden",price:54,original:90,type:"veg",qty:4,emoji:"🥞",bg:"#f9e9cb",rating:"4.7"},
  {id:3,name:"Veg Biryani",restaurant:"Spice Garden",price:108,original:180,type:"veg",qty:5,emoji:"🍛",bg:"#f4e6cf",rating:"4.9"},
  {id:4,name:"Paneer Butter Masala",restaurant:"The Curry House",price:132,original:220,type:"veg",qty:3,emoji:"🥘",bg:"#f8dfd3",rating:"4.8"},
  {id:5,name:"Chicken Biryani",restaurant:"The Curry House",price:144,original:240,type:"nonveg",qty:2,emoji:"🍗",bg:"#f5e1d5",rating:"4.6"}
];
let deals = [...initialDeals];
let reservedUnits = 0;
const $ = s => document.querySelector(s);
const money = n => "₹" + Number(n).toFixed(0);
function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
function navigate(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===page));document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$(".desktop-nav").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});if(page==="deals")renderDeals();if(page==="manager")renderInventory()}
document.addEventListener("click",e=>{const target=e.target.closest("[data-page]");if(target){e.preventDefault();navigate(target.dataset.page)}});
$("#menuToggle").addEventListener("click",()=>$(".desktop-nav").classList.toggle("open"));
$("#notificationBtn").addEventListener("click",()=>showToast("You're all caught up! New deal alerts will appear here."));
function dealCard(d){const discount=Math.round((1-d.price/d.original)*100);return `<article class="deal-card"><div class="deal-image" style="background:${d.bg}"><span>${d.emoji}</span><b class="discount">${discount}% OFF</b></div><div class="deal-body"><div class="deal-title-row"><h3>${escapeHtml(d.name)}</h3><span class="food-tag ${d.type==="nonveg"?"nonveg":""}">${d.type==="veg"?"VEG":"NON-VEG"}</span></div><p class="restaurant">${escapeHtml(d.restaurant)} · Bengaluru</p><div class="deal-price"><strong>${money(d.price)}</strong><del>${money(d.original)}</del><span class="rating">★ ${d.rating||"New"}</span></div><div class="deal-meta"><span>♧ ${d.qty} portions left</span><span>Pickup before 11:59 PM</span></div><button class="btn btn-primary reserve-btn" data-reserve="${d.id}" ${d.qty<1?"disabled":""}>${d.qty<1?"Sold out":"Reserve now →"}</button></div></article>`}
function renderDeals(){const q=$("#searchInput").value.toLowerCase(),type=$("#typeFilter").value,max=Number($("#priceFilter").value);const filtered=deals.filter(d=>d.qty>0&&d.price<=max&&(type==="all"||d.type===type)&&(`${d.name} ${d.restaurant}`).toLowerCase().includes(q));$("#dealGrid").innerHTML=filtered.map(dealCard).join("");$("#dealCount").textContent=filtered.length;$("#emptyState").classList.toggle("hidden",filtered.length>0)}
["searchInput","typeFilter","priceFilter"].forEach(id=>$("#"+id).addEventListener(id==="searchInput"?"input":"change",renderDeals));
$("#clearFilters").addEventListener("click",()=>{$("#searchInput").value="";$("#typeFilter").value="all";$("#priceFilter").value="999";renderDeals()});
$("#dealGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-reserve]");if(!btn)return;const d=deals.find(x=>x.id===Number(btn.dataset.reserve));if(!d||d.qty<1)return;d.qty--;reservedUnits++;$("#pickupCode").textContent=String(Math.floor(100000+Math.random()*900000));$("#modal").classList.remove("hidden");renderDeals();renderInventory()});
function renderInventory(){$("#inventoryList").innerHTML=deals.map(d=>`<div class="inventory-item"><span class="inventory-emoji" style="background:${d.bg}">${d.emoji}</span><div><b>${escapeHtml(d.name)}</b><small>${escapeHtml(d.restaurant)} · ${d.qty} portions left</small></div><strong>${money(d.price)}</strong></div>`).join("");$("#activeMetric").textContent=deals.filter(d=>d.qty>0).length;$("#rescuedMetric").textContent=24+reservedUnits;$("#revenueMetric").textContent=money(2460+reservedUnits*100)}
$("#listingForm").addEventListener("submit",e=>{e.preventDefault();const name=$("#foodName").value.trim(),price=Number($("#foodPrice").value),qty=Number($("#foodQty").value),type=$("#foodType").value,restaurant=$("#restaurantName").value.trim();if(!name||!restaurant||price<=0||qty<1)return;const emojis=["🍱","🍲","🥗","🍕","🥪"];deals.unshift({id:Date.now(),name,restaurant,original:price,price:Math.round(price*.6),type,qty,emoji:emojis[Math.floor(Math.random()*emojis.length)],bg:"#e8f0dc",rating:"New"});e.target.reset();$("#restaurantName").value="Spice Garden";renderInventory();showToast("Your discounted food deal is now published!");});
$("#loginForm").addEventListener("submit",e=>{e.preventDefault();navigate("deals");showToast("Welcome! You're exploring the customer demo.")});
function closeModal(){$("#modal").classList.add("hidden");showToast("Enjoy your rescued meal!")}
$("#modalClose").addEventListener("click",closeModal);$("#doneBtn").addEventListener("click",closeModal);$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
renderDeals();renderInventory();
