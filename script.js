// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app');
    const guestLoginBtn = document.getElementById('guest-login');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const themeToggle = document.getElementById('theme-toggle');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const cartCount = document.getElementById('cart-count');
    const buyNowBtn = document.getElementById('buy-now');
    const productsContainer = document.getElementById('products-container');
    
    // Cart array to store products
    let cart = [];
    
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    // Guest login functionality
    guestLoginBtn.addEventListener('click', function() {
        loginScreen.classList.remove('active');
        appScreen.classList.add('active');
    });
    
    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Show the corresponding page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`${pageId}-page`).classList.add('active');
            
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Initialize countdown timer
    initializeCountdown();
    
    // Load products from JSON
    loadProducts();
    
    // Buy Now button functionality
    buyNowBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        let message = "I'd like to buy these items:\n";
        let total = 0;
        
        cart.forEach(item => {
            message += `- ${item.name} ($${item.price})\n`;
            total += parseFloat(item.price);
        });
        
        message += `\nTotal: $${total.toFixed(2)}\n\nWhere do I make the payment and pickup?`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/263782404426?text=${encodedMessage}`, '_blank');
    });
    
    // Function to initialize countdown timer
    function initializeCountdown() {
        // Set the date we're counting down to (10 days from now)
        const countDownDate = new Date();
        countDownDate.setDate(countDownDate.getDate() + 10);
        
        // Update the count down every 1 millisecond
        const countdownFunction = setInterval(function() {
            // Get today's date and time
            const now = new Date().getTime();
            
            // Find the distance between now and the count down date
            const distance = countDownDate - now;
            
            // Time calculations for days, hours, minutes, seconds and milliseconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            const milliseconds = Math.floor(distance % 1000);
            
            // Output the result in elements with id="days", "hours", "minutes", "seconds", "milliseconds"
            document.getElementById("days").textContent = days.toString().padStart(2, '0');
            document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
            document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
            document.getElementById("milliseconds").textContent = milliseconds.toString().padStart(3, '0');
            
            // If the count down is over, write some text 
            if (distance < 0) {
                clearInterval(countdownFunction);
                document.getElementById("countdown-timer").innerHTML = "EXPIRED";
            }
        }, 1);
    }
    
    // Function to load products
    function loadProducts() {
        // In a real scenario, we would fetch this from product.json
        // For this example, we'll use a hardcoded array
        
        const products = [
            {
                id: 1,
                name: "Steel Gas Stove",
                price: "25",
                image: "https://files.catbox.moe/jcujvc.png",
                description: "Durable steel gas stove with high efficiency burners. Perfect for home cooking with easy-to-clean surface."
            },
            {
                id: 2,
                name: "CADAC Gas Stove with pipe",
                price: "23",
                image: "https://files.catbox.moe/4ge45b.png",
                description: "Portable CADAC gas stove with included pipe. Ideal for outdoor activities and camping."
            },
            {
                id: 3,
                name: "Afrox Gas Stove",
                price: "20",
                image: "https://files.catbox.moe/mf1784.jpg",
                description: "Reliable Afrox gas stove with safety features. Trusted brand for household cooking needs."
            },
            {
                id: 4,
                name: "9kg Gas Tank Empty",
                price: "31.50",
                image: "https://files.catbox.moe/irszqf.png",
                description: "Empty 9kg gas tank, ready for refill. Durable construction with safety valve."
            },
            {
                id: 5,
                name: "11kg Gas Tank Empty",
                price: "42",
                image: "https://files.catbox.moe/d1xv59.jpg",
                description: "Empty 11kg gas tank for larger households. High-quality tank with long service life."
            }
        ];
        
        // Render products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price}</p>
                    <p class="product-description">${product.description}</p>
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
        
        // Add event listeners to Add to Cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const price = this.getAttribute('data-price');
                
                // Add product to cart
                cart.push({ id, name, price });
                
                // Update cart count
                cartCount.textContent = cart.length;
                
                // Show confirmation
                this.textContent = 'Added!';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 1500);
            });
        });
    }
});
