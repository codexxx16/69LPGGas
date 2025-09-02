// Global variables
let cart = [];
let products = [];
let countdownInterval;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Load products from JSON
    loadProducts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start the promotion countdown
    startCountdown();
});

// Initialize the application
function initApp() {
    // Check if user has already logged in (for page refresh)
    if(localStorage.getItem('guestLoggedIn') === 'true') {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('app').classList.add('active');
    }
}

// Load products from JSON file
function loadProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data.products;
            renderProducts();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            // Fallback to hardcoded products if JSON fails to load
            products = [
                {
                    id: 1,
                    name: "Steel Gas Stove",
                    price: 25,
                    image: "https://files.catbox.moe/jcujvc.png",
                    description: "Durable steel construction gas stove with high efficiency burners. Perfect for home use with safety features."
                },
                {
                    id: 2,
                    name: "CADAC Gas Stove with pipe",
                    price: 23,
                    image: "https://files.catbox.moe/4ge45b.png",
                    description: "Premium CADAC brand gas stove complete with connecting pipe. Portable and reliable for indoor/outdoor use."
                },
                {
                    id: 3,
                    name: "Afrox Gas Stove",
                    price: 20,
                    image: "https://files.catbox.moe/mf1784.jpg",
                    description: "Trusted Afrox brand gas stove with easy ignition system and stable design. Energy efficient and safe."
                },
                {
                    id: 4,
                    name: "9kg Gas Tank Empty",
                    price: 31.50,
                    image: "https://files.catbox.moe/irszqf.png",
                    description: "Empty 9kg gas tank, certified and tested. Ready for refill. Comes with safety valve."
                },
                {
                    id: 5,
                    name: "11kg Gas Tank Empty",
                    price: 42,
                    image: "https://files.catbox.moe/d1xv59.jpg",
                    description: "Empty 11kg gas tank, professionally inspected. Durable construction with long lifespan."
                }
            ];
            renderProducts();
        });
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
                <div class="product-price">$${product.price}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to the add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Guest login button
    document.getElementById('guest-login').addEventListener('click', guestLogin);
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage(this.getAttribute('data-page'));
        });
    });
    
    // Hamburger menu
    document.getElementById('hamburger').addEventListener('click', toggleMobileMenu);
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Buy now button
    document.getElementById('buy-now').addEventListener('click', proceedToBuy);
}

// Guest login function
function guestLogin() {
    localStorage.setItem('guestLoggedIn', 'true');
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('app').classList.add('active');
}

// Switch between pages
function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update active navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('active');
}

// Toggle theme (light/dark)
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if(body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Proceed to buy (open WhatsApp)
function proceedToBuy() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    let message = "I'd like to buy these items:\n";
    let total = 0;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - $${item.price} x ${item.quantity}\n`;
        total += item.price * item.quantity;
    });
    
    message += `\nTotal: $${total.toFixed(2)}\n\nWhere do I make the payment and pickup?`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/263782404426?text=${encodedMessage}`, '_blank');
}

// Start promotion countdown
function startCountdown() {
    // Set end date (10 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);
    
    // Update countdown immediately
    updateCountdown(endDate);
    
    // Update countdown every millisecond
    countdownInterval = setInterval(() => {
        updateCountdown(endDate);
    }, 1);
}

// Update countdown display
function updateCountdown(endDate) {
    const now = new Date();
    const timeRemaining = endDate - now;
    
    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown-timer').innerHTML = '<div>Promotion Ended</div>';
        return;
    }
    
    // Calculate time components
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    const milliseconds = timeRemaining % 1000;
    
    // Update display
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    document.getElementById('milliseconds').textContent = milliseconds.toString().padStart(3, '0');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('active');
    }
});
