/* =========================
   CART STATE
========================= */
let cart = [];

/* =========================
   ADD TO CART
========================= */
function addToCart(name, price) {
  // DEBUG: Check what is actually coming in
  console.log("Name received:", name);
  console.log("Price received:", price);

  const numericPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[^\d.]/g, '')) 
    : price;

  console.log("Numeric Price after conversion:", numericPrice);

  if (!name || isNaN(numericPrice)) {
    alert("Error: Name or Price is missing/wrong. Check Console (F12)");
    console.error("Validation failed:", { name, numericPrice });
    return; // This stops the function from running
  }

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: numericPrice, quantity: 1 });
  }

  updateCartUI();
  showToast(`${name} added! 🛒`);
}
/* =========================
   CHANGE QUANTITY (+/-)
========================= */
function changeQuantity(name, delta) {
  const item = cart.find(item => item.name === name);
  if (!item) return;

  item.quantity += delta;

  // Remove item if quantity hits 0
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.name !== name);
  }

  updateCartUI();
}

/* =========================
   UPDATE CART UI
========================= */
function updateCartUI() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    itemCount += item.quantity;

    // Create the row using your CSS classes
    const row = document.createElement("div");
    row.className = "cart-row"; 
    
    row.innerHTML = `
      <div class="item-name">${item.name}</div>
      <div class="qty-controls">
        <button onclick="changeQuantity('${item.name}', -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity('${item.name}', 1)">+</button>
      </div>
      <div class="price">₹${item.price * item.quantity}</div>
    `;

    cartItems.appendChild(row);
  });

  cartCount.innerText = itemCount;
  cartTotal.innerText = `₹${total}`;
}
/* =========================
   CLEAR CART
========================= */
function clearCart() {
    // Check if cart has items
    if (cart.length === 0) {
        showToast("Cart is already empty! 🛒");
        return;
    }

    // Ask for confirmation
    if (confirm("Are you sure you want to clear your cart?")) {
        // Clear the actual array content
        cart.length = 0; 
        
        // Refresh the UI to show ₹0 and empty list
        updateCartUI(); 
        
        showToast("Cart cleared! 🗑️");
    }
}

/* =========================
   UI HELPERS (Search, Filter, Toast)
========================= */
function toggleCart() {
  document.getElementById("cartPopup").classList.toggle("show");
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

document.getElementById("searchInput").addEventListener("keyup", function () {
  const value = this.value.toLowerCase();
  document.querySelectorAll(".food-card").forEach(card => {
    card.style.display = card.dataset.name.includes(value) ? "block" : "none";
  });
});

function filterCategory(category) {
  // Toggle active class on spans
  document.querySelectorAll('.categories span').forEach(s => s.classList.remove('active'));
  event.target.classList.add('active');

  document.querySelectorAll(".food-card").forEach(card => {
    card.style.display = (category === "all" || card.dataset.category === category) ? "block" : "none";
  });
}

function orderNow() {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}