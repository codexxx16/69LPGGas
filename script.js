// Global variables
let cart = [];
let products = [];
let countdownDate = new Date().getTime() + (10 * 24 * 60 * 60 * 1000); // 10 days from now

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const mainSite = document.getElementById('mainSite');
const loginBtn = document.getElementById('loginBtn');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartCount = document.getElementById('cartCount');
const buyNowBtn = document.getElementById('buyNowBtn');
const whatsappFloat = document.getElementById('whatsappFloat');
const userMenu = document.getElementById('userMenu');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    startCountdown();
    setupScrollEffects();
});

// Event Listeners
function setupEventListeners() {
    // Login functionality
    loginBtn.addEventListener('click', function() {
        loginScreen.classList.remove('active');
        mainSite.classList.add('active');
    });

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            
            // Update active nav link
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });

    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // Hamburger menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        this.classList.toggle('active');
    });

    // Buy now button
    buyNowBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const cartItems = cart.map(item => `${item.name} - $${item.price}`).join('\n');
        const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
        
        const message = `I'd like to buy these items:\n${cartItems}\nFor a total of $${total}\nWhere do I make the payment?`;
        const whatsappUrl = `https://wa.me/263782404426?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    });

    // Hamburger click to show user menu
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!navMenu.classList.contains('active')) {
            userMenu.classList.toggle('active');
        }
    });

    // Close user menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target) && !hamburger.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });
}

// Page navigation
function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId + 'Page').classList.add('active');
}

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback products if JSON fails to load
        products = [
            {
                "id": 1,
                "name": "Steel Gas Stove",
                "image": "https://files.catbox.moe/jcujvc.png",
                "price": "25",
                "description": "High-quality steel gas stove with durable construction. Perfect for everyday cooking needs. Features efficient gas consumption and easy maintenance."
            },
            {
                "id": 2,
                "name": "CADAC Gas Stove with Pipe",
                "image": "https://files.catbox.moe/4ge45b.png",
                "price": "23",
                "description": "Professional CADAC gas stove complete with connecting pipe. Ideal for outdoor cooking and camping. Reliable performance and portable design."
            },
            {
                "id": 3,
                "name": "Afrox Gas Stove",
                "image": "https://files.catbox.moe/mf1784.jpg",
                "price": "20",
                "description": "Reliable Afrox gas stove with consistent performance. Budget-friendly option without compromising quality. Easy to use and maintain."
            },
            {
                "id": 4,
                "name": "9kg Gas Tank Empty",
                "image": "https://files.catbox.moe/irszqf.png",
                "price": "31.50",
                "description": "Empty 9kg gas tank ready for filling. Standard size perfect for small to medium households. Durable construction with safety features."
            },
            {
                "id": 5,
                "name": "11kg Gas Tank Empty",
                "image": "https://files.catbox.moe/d1xv59.jpg",
                "price": "42",
                "description": "Empty 11kg gas tank for larger households. Extended capacity for longer usage periods. Built to international safety standards."
            }
        ];
        renderProducts();
    }
}

// Render products
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        
        // Show feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
    cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
}

// Countdown timer
function startCountdown() {
    const countdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById('countdown').innerHTML = '<div class="expired">OFFER EXPIRED</div>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Scroll effects for WhatsApp button
function setupScrollEffects() {
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        // Add intense neon effect while scrolling
        whatsappFloat.style.animation = 'neonPulse 0.5s infinite';
        whatsappFloat.style.boxShadow = `
            0 4px 25px rgba(37, 211, 102, 0.8),
            0 0 40px rgba(37, 211, 102, 0.6),
            0 0 60px rgba(37, 211, 102, 0.4)
        `;
        
        // Clear previous timeout
        clearTimeout(scrollTimeout);
        
        // Reset to normal after scrolling stops
        scrollTimeout = setTimeout(function() {
            whatsappFloat.style.animation = 'neonPulse 2s infinite';
            whatsappFloat.style.boxShadow = '';
        }, 150);
    });
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Handle image loading errors
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/300x200?text=Product+Image';
    img.alt = 'Product Image Not Available';
}

// Add smooth transitions for page changes
function smoothPageTransition(targetPage) {
    const currentPage = document.querySelector('.page.active');
    
    if (currentPage) {
        currentPage.style.opacity = '0';
        currentPage.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            currentPage.classList.remove('active');
            const newPage = document.getElementById(targetPage + 'Page');
            newPage.classList.add('active');
            newPage.style.opacity = '0';
            newPage.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                newPage.style.opacity = '1';
                newPage.style.transform = 'translateX(0)';
            }, 50);
        }, 200);
    }
}

// Enhanced hamburger animation
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerSpans = document.querySelectorAll('.hamburger span');
    
    hamburger.addEventListener('click', function() {
        if (this.classList.contains('active')) {
            hamburgerSpans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburgerSpans[1].style.opacity = '0';
            hamburgerSpans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            hamburgerSpans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });
});

// Add loading animation
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>Loading...</p>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
}

// Add CSS for loader
const loaderStyles = `
.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(220, 38, 38, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    color: white;
    font-size: 1.2rem;
}

.loader-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top: 5px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Inject loader styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loaderStyles;
document.head.appendChild(styleSheet);

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add touch gesture support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    const swipeThreshold = 100;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - could implement page navigation
            console.log('Swiped right');
        } else {
            // Swipe left - could implement page navigation
            console.log('Swiped left');
        }
    }
}

// Add window resize handler for responsive adjustments
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        userMenu.classList.remove('active');
    }
});

// Add error handling for fetch operations
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Service worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
                          }
