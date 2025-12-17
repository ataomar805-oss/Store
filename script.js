/* ===========================
   DOM ELEMENTS
=========================== */
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const cartItemsContainer = document.querySelector('.cart-items');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const filterButtons = document.querySelectorAll('.product-filter button');
const productItems = document.querySelectorAll('.product-item');
const navLinks = document.querySelectorAll('.nav-links a');
const featuredSlider = document.querySelector('.featured-slider');

/* ===========================
   CART DATA
=========================== */
let cart = [];

/* ===========================
   UPDATE CART DISPLAY
=========================== */
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    totalPrice.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;

    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            updateCartDisplay();
        });
    });
}

/* ===========================
   ADD TO CART
=========================== */
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const product = e.target.closest('.product-item');
        const name = product.querySelector('h3').textContent;
        const price = parseFloat(product.querySelector('.price').textContent.replace('$',''));

        cart.push({ name, price });
        updateCartDisplay();
        animateAddToCart(product);
    });
});

/* ===========================
   ADD TO CART ANIMATION
=========================== */
function animateAddToCart(product) {
    const img = product.querySelector('img');
    const imgClone = img.cloneNode(true);
    const rect = img.getBoundingClientRect();
    imgClone.style.position = 'fixed';
    imgClone.style.left = rect.left + 'px';
    imgClone.style.top = rect.top + 'px';
    imgClone.style.width = rect.width + 'px';
    imgClone.style.transition = 'all 1s ease-in-out';
    imgClone.style.zIndex = 1000;
    document.body.appendChild(imgClone);

    const cartIcon = document.querySelector('.cart-icon');
    const cartRect = cartIcon.getBoundingClientRect();

    setTimeout(() => {
        imgClone.style.left = cartRect.left + 'px';
        imgClone.style.top = cartRect.top + 'px';
        imgClone.style.width = '0px';
        imgClone.style.opacity = 0;
    }, 50);

    setTimeout(() => {
        document.body.removeChild(imgClone);
    }, 1050);
}

/* ===========================
   FILTER PRODUCTS
=========================== */
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        productItems.forEach(item => {
            if(filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                item.style.opacity = 0;
                setTimeout(() => item.style.opacity = 1, 50);
            } else {
                item.style.opacity = 0;
                setTimeout(() => item.style.display = 'none', 300);
            }
        });
    });
});

/* ===========================
   SCROLL ANIMATIONS
=========================== */
const sections = document.querySelectorAll('.section');

function revealOnScroll() {
    const windowHeight = window.innerHeight;
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if(sectionTop < windowHeight - 100) {
            section.style.opacity = 1;
            section.style.transform = 'translateY(0)';
            section.style.transition = 'all 1s ease-out';
        } else {
            section.style.opacity = 0;
            section.style.transform = 'translateY(50px)';
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ===========================
   SMOOTH SCROLL FOR NAV LINKS
=========================== */
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

/* ===========================
   FEATURED SLIDER DRAG
=========================== */
let isDown = false;
let startX;
let scrollLeft;

featuredSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    featuredSlider.classList.add('active');
    startX = e.pageX - featuredSlider.offsetLeft;
    scrollLeft = featuredSlider.scrollLeft;
});

featuredSlider.addEventListener('mouseleave', () => {
    isDown = false;
    featuredSlider.classList.remove('active');
});

featuredSlider.addEventListener('mouseup', () => {
    isDown = false;
    featuredSlider.classList.remove('active');
});

featuredSlider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - featuredSlider.offsetLeft;
    const walk = (x - startX) * 2; //scroll-fast
    featuredSlider.scrollLeft = scrollLeft - walk;
});