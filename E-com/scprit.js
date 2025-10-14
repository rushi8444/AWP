
// Basic product data (sample mobile phones)
const PRODUCTS = [
    { id: 'p1', title: 'Aurora X1', price: 14999, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1d5e5ea3c8a3d2f0b3d0f6f3b7f9f8d2' , desc: '6.5" AMOLED • 8GB RAM • 128GB'},
    { id: 'p2', title: 'Nova Lite', price: 9999, img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6f7d2b6b3b5c1f2c1c3d6b5a3a9e0f1b' , desc: '6.1" LCD • 6GB RAM • 64GB'},
    { id: 'p3', title: 'Pixelia Pro', price: 26999, img: 'https://images.unsplash.com/photo-1510557880182-3d4d3b6a2f4a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a8a6c5f3b5c1e2b6f9a1d2c3b4e5f6a' , desc: '6.7" OLED • 12GB RAM • 256GB'},
    { id: 'p4', title: 'Sprint Z', price: 7999, img: 'https://images.unsplash.com/photo-1511688878358-6a2a1f1b8b0f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8c9d7e6f5b4a3c2d1e0f9a8b7c6d5e4f' , desc: '6.0" IPS • 4GB RAM • 64GB'},
    { id: 'p5', title: 'Orbit Neo', price: 19999, img: 'https://images.unsplash.com/photo-1512499617640-c2f9992f6b5d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d' , desc: '6.4" AMOLED • 8GB RAM • 128GB'},
    { id: 'p6', title: 'Echo Mini', price: 5999, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9a8b7c6d5e4f3a2b1c0d9e8f7b6a5c4d' , desc: '5.8" Compact • 3GB RAM • 32GB'}
]
// Simple cart stored in localStorage
const CART_KEY = 'mini_cart_v1';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}')
const productsEl = document.getElementById('products');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const clearBtn = document.getElementById('clearCart');
const placeOrderBtn = document.getElementById('placeOrder')
function formatPrice(n){return '₹' + n.toLocaleString();
function renderProducts(){
    productsEl.innerHTML = '';
    PRODUCTS.forEach(p => {
        const el = document.createElement('div'); el.className = 'card';
        el.innerHTML = `
            <div class="prod-img" style="background-image:url('${p.img}')"></div>
            <div class="prod-title">${p.title}</div>
            <div class="prod-desc">${p.desc}</div>
            <div class="price-row">
                <div class="price">${formatPrice(p.price)}</div>
                <div>
                    <button class="btn" data-add="${p.id}">Add</button>
                </div>
            </div>
        `;
        productsEl.appendChild(el);
    })
    // attach add handlers
    document.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-add');
        addToCart(id);
    }));

function saveCart(){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();

function addToCart(productId){
    if(!cart[productId]) cart[productId] = {id:productId, qty:0};
    cart[productId].qty++;
    saveCart();

function removeFromCart(productId){
    delete cart[productId];
    saveCart();

function changeQty(productId, delta){
    if(!cart[productId]) return;
    cart[productId].qty += delta;
    if(cart[productId].qty <= 0) removeFromCart(productId);
    saveCart();

function cartSummary(){
    let count = 0, total = 0;
    Object.values(cart).forEach(ci => {
        const p = PRODUCTS.find(x=>x.id===ci.id);
        if(p){ count += ci.qty; total += p.price * ci.qty; }
    });
    return {count, total};

function renderCart(){
    cartItemsEl.innerHTML = '';
    const items = Object.values(cart);
    if(items.length === 0){
        cartItemsEl.innerHTML = '<div style="color:var(--muted)">Your cart is empty</div>';
    }
    items.forEach(ci => {
        const p = PRODUCTS.find(x=>x.id===ci.id);
        if(!p) return;
        const row = document.createElement('div'); row.className = 'cart-item';
        row.innerHTML = `
            <div class="ci-img" style="background-image:url('${p.img}')"></div>
            <div class="ci-info">
                <div style="font-weight:700">${p.title}</div>
                <div style="color:var(--muted);font-size:.9rem">${formatPrice(p.price)} • ${p.desc}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.35rem">
                <div class="qty">
                    <button data-dec="${p.id}">-</button>
                    <div style="padding:.25rem .6rem;background:#071321;border-radius:6px">${ci.qty}</div>
                    <button data-inc="${p.id}">+</button>
                </div>
                <div style="font-weight:800">${formatPrice(p.price * ci.qty)}</div>
            </div>
        `;
        cartItemsEl.appendChild(row);
    })
    // attach qty handlers
    document.querySelectorAll('[data-inc]').forEach(b=>b.addEventListener('click',e=>changeQty(e.currentTarget.getAttribute('data-inc'),1)));
    document.querySelectorAll('[data-dec]').forEach(b=>b.addEventListener('click',e=>changeQty(e.currentTarget.getAttribute('data-dec'),-1)))
    const summary = cartSummary();
    cartCountEl.textContent = summary.count;
    cartTotalEl.textContent = formatPrice(summary.total);

clearBtn.addEventListener('click', ()=>{ cart = {}; saveCart(); })
placeOrderBtn.addEventListener('click', ()=>{
    const name = document.getElementById('custName').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    if(Object.keys(cart).length===0){ alert('Cart is empty'); return; }
    if(!name || !email){ alert('Please enter name and email'); return; }
    // simulate order placement
    const order = { id: 'ORD'+Date.now(), name, email, items: cart, total: cartSummary().total };
    console.log('Order placed', order);
    // clear cart after order
    cart = {}; saveCart();
    alert('Order placed! Order ID: ' + order.id);
    document.getElementById('custName').value=''; document.getElementById('custEmail').value='';
})
// bootstrap
renderProducts(); 
renderCart();