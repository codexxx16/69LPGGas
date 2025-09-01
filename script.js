document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const mainContent = document.getElementById('main-content');
    const guestLoginBtn = document.getElementById('guest-login');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const themeToggle = document.getElementById('theme-toggle');
    const cartCount = document.getElementById('cart-count');
    const buyNowBtn = document.getElementById('buy-now');
    const productsGrid = document.getElementById('products-grid');
    const floatingWhatsapp = document.getElementById('floating-whatsapp');
    
    // Cart items array
    let cartItems = [];
    
    // Initialize the page
    function init() {
        // Load products from JSON
        loadProducts();
        
        // Set up countdown timer
        initializeCountdown();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Guest login
        guestLoginBtn.addEventListener('click', function() {
            loginScreen.classList.remove('active');
            mainContent.classList.add('active');
        });
        
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page') + '-page';
                
                // Update active nav link
                navLinks.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Show the corresponding page
                pages.forEach(page => page.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');
            });
        });
        
        // Sidebar toggle
        hamburger.addEventListener('click', function() {
            sidebar.classList.add('active');
        });
        
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
        
        // Theme toggle
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('light-theme')) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
        
        // Buy Now button
        buyNowBtn.addEventListener('click', function() {
            if (cartItems.length === 0) {
                alert('Your cart is empty. Please add some products first.');
                return;
            }
            
            let message = "I'd like to buy these items:\n";
            let total = 0;
            
            cartItems.forEach(item => {
                message += `- ${item.name} ($${item.price})\n`;
                total += item.price;
            });
            
            message += `\nTotal: $${total.toFixed(2)}\n\nWhere do I make the payment?`;
            
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/263782404426?text=${encodedMessage}`, '_blank');
        });
        
        // Floating WhatsApp button
        floatingWhatsapp.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://wa.me/263780074647', '_blank');
        });
    }
    
    // Load products from JSON
    function loadProducts() {
        fetch('product.json')
            .then(response => response.json())
            .then(products => {
                displayProducts(products);
            })
            .catch(error => {
                console.error('Error loading products:', error);
                productsGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
            });
    }
    
    // Display products in the grid
    function displayProducts(products) {
        productsGrid.innerHTML = '';
        
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
            
            productsGrid.appendChild(productCard);
            
            // Add event listener to the Add to Cart button
            const addToCartBtn = productCard.querySelector('.add-to-cart');
            addToCartBtn.addEventListener('click', function() {
                addToCart(product);
            });
        });
    }
    
    // Add product to cart
    function addToCart(product) {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price
        });
        
        updateCartCount();
        
        // Show confirmation
        const confirmation = document.createElement('div');
        confirmation.textContent = `${product.name} added to cart!`;
        confirmation.style.position = 'fixed';
        confirmation.style.bottom = '20px';
        confirmation.style.left = '50%';
        confirmation.style.transform = 'translateX(-50%)';
        confirmation.style.backgroundColor = '#32CD32';
        confirmation.style.color = 'white';
        confirmation.style.padding = '10px 20px';
        confirmation.style.borderRadius = '5px';
        confirmation.style.zIndex = '1000';
        confirmation.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        
        document.body.appendChild(confirmation);
        
        // Remove confirmation after 2 seconds
        setTimeout(() => {
            confirmation.style.opacity = '0';
            confirmation.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(confirmation);
            }, 500);
        }, 2000);
    }
    
    // Update cart count
    function updateCartCount() {
        cartCount.textContent = cartItems.length;
    }
    
    // Initialize countdown timer
    function initializeCountdown() {
        // Set the date we're counting down to (10 days from now)
        const countDownDate = new Date();
        countDownDate.setDate(countDownDate.getDate() + 10);
        
        // Update the countdown every millisecond
        const countdownFunction = setInterval(function() {
            // Get current date and time
            const now = new Date().getTime();
            
            // Find the distance between now and the countdown date
            const distance = countDownDate - now;
            
            // Time calculations for days, hours, minutes, seconds, and milliseconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            const milliseconds = Math.floor(distance % 1000);
            
            // Display the results
            document.getElementById("days").textContent = days.toString().padStart(2, '0');
            document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
            document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
            document.getElementById("milliseconds").textContent = milliseconds.toString().padStart(3, '0');
            
            // If the countdown is over, write some text
            if (distance < 0) {
                clearInterval(countdownFunction);
                document.getElementById("countdown").innerHTML = "EXPIRED";
            }
        }, 1);
    }
    
    // Initialize the application
    init();
});
