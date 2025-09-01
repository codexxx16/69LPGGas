// Global variables
let cart = [];
let products = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Initialize the application
function initApp() {
    // Load products from JSON
    loadProducts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize countdown timer
    initializeCountdown();
}

// Load products from JSON file
function loadProducts() {
    fetch('product.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

// Set up all event listeners
function setupEventListeners() {
    // Guest login
    document.getElementById('guest-login').addEventListener('click', handleGuestLogin);
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Mobile menu links
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    document.getElementById('menu-toggle').addEventListener('click', toggleMobileMenu);
    document.getElementById('close-menu').addEventListener('click', toggleMobileMenu);
    
    // Buy now button
    document.getElementById('buy-now-btn').addEventListener('click', handleBuyNow);
}

// Handle guest login
function handleGuestLogin() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    // Show home page by default
    showPage('home');
}

// Handle navigation
function handleNavigation(e) {
    e.preventDefault();
    const page = this.getAttribute('data-page');
    
    // Update active nav link
    document.querySelectorAll('.nav-link, .menu-link').forEach(link => {
        link.classList.remove('active');
    });
    this.classList.add('active');
    
    // Show the selected page
    showPage(page);
    
    // Close mobile menu if open
    document.getElementById('mobile-menu').classList.add('hidden');
}

// Show specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
}

// Toggle theme (light/dark)
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

// Initialize countdown timer
function initializeCountdown() {
    // Set the date we're counting down to (10 days from now)
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 10);
    
    // Update the count down every 1 second
    const countdownFunction = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the count down date
        const distance = countDownDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((distance % 1000));
        
        // Display the result
        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
        
        // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("countdown").innerHTML = "EXPIRED";
        }
    }, 100);
}

// Render products to the page
function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add product to cart
function addToCart(e) {
    const productId = parseInt(this.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartCount();
        
        // Show confirmation
        showNotification(`${product.name} added to cart!`);
    }
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.textContent = totalItems;
}

// Handle buy now action
function handleBuyNow() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Generate message for WhatsApp
    const message = generateWhatsAppMessage();
    
    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/263782404426?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Generate WhatsApp message with cart items
function generateWhatsAppMessage() {
    let message = "I'd like to buy these items:\n";
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - $${item.price} x ${item.quantity}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    message += `\nTotal: $${total.toFixed(2)}\n\nWhere do I make the payment and pickup?`;
    
    return message;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: fadeInUp 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Check for saved theme preference
function checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
}

// Initialize when DOM is fully loaded
window.addEventListener('DOMContentLoaded', checkSavedTheme);
