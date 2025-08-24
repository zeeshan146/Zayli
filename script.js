// Mobile navigation toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe sections and cards
document.querySelectorAll('.section, .card').forEach(el => {
  observer.observe(el);
});

// Update year in footer
const yearSpan = document.querySelector('.footer-year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Add loading animation to images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('load', () => {
    img.classList.add('loaded');
  });
  
  img.addEventListener('error', () => {
    img.classList.add('error');
    img.alt = 'Image not available';
  });
});

// Product Modal functionality
let currentProductImages = [];
let currentProductIndex = 0;

// Initialize product modal
const productModal = document.getElementById('product-modal');
const mainProductImage = document.getElementById('main-product-image');
const productTitle = document.getElementById('product-title');
const thumbnailGallery = document.getElementById('thumbnail-gallery');
const closeModal = document.querySelector('.close-modal');
const qtyInput = document.getElementById('qty-input');
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');

// Product data (you can customize this for each product)
const productData = {
  title: "Elegant Zayli Necklace",
  price: "₹1,299",
  originalPrice: "₹1,999",
  discount: "35% OFF",
  description: "This stunning necklace features premium craftsmanship with elegant design. Perfect for both casual and formal occasions. Made with high-quality materials that ensure durability and beauty.",
  features: [
    "Premium quality materials",
    "Elegant design suitable for all occasions",
    "Adjustable length for perfect fit",
    "Hypoallergenic and skin-friendly",
    "Comes with elegant packaging"
  ],
  specs: {
    "Material": "Sterling Silver",
    "Length": "18-20 inches",
    "Weight": "15 grams",
    "Clasp": "Lobster Clasp"
  }
};

// Open product modal
function openProductModal(imageSrc, imageAlt, galleryImages, imageIndex) {
  currentProductImages = galleryImages;
  currentProductIndex = imageIndex;
  
  // Set main image
  mainProductImage.src = imageSrc;
  mainProductImage.alt = imageAlt;
  
  // Update product title
  productTitle.textContent = productData.title;
  
  // Create thumbnails
  createThumbnails(galleryImages, imageIndex);
  
  // Show modal
  productModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Create thumbnail gallery
function createThumbnails(images, activeIndex) {
  thumbnailGallery.innerHTML = '';
  
  images.forEach((image, index) => {
    const thumbnail = document.createElement('img');
    thumbnail.src = image.src;
    thumbnail.alt = image.alt;
    thumbnail.className = `thumbnail ${index === activeIndex ? 'active' : ''}`;
    thumbnail.addEventListener('click', () => {
      setActiveThumbnail(index);
      mainProductImage.src = image.src;
      mainProductImage.alt = image.alt;
      currentProductIndex = index;
    });
    thumbnailGallery.appendChild(thumbnail);
  });
}

// Set active thumbnail
function setActiveThumbnail(index) {
  document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

// Close product modal
function closeProductModal() {
  productModal.classList.remove('show');
  document.body.style.overflow = '';
}

// Quantity controls
function updateQuantity() {
  const currentQty = parseInt(qtyInput.value);
  qtyMinus.disabled = currentQty <= 1;
  qtyPlus.disabled = currentQty >= 10;
}

// Event listeners
closeModal.addEventListener('click', closeProductModal);

// Close modal when clicking outside
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) {
    closeProductModal();
  }
});

// Quantity controls
qtyMinus.addEventListener('click', () => {
  const currentQty = parseInt(qtyInput.value);
  if (currentQty > 1) {
    qtyInput.value = currentQty - 1;
    updateQuantity();
  }
});

qtyPlus.addEventListener('click', () => {
  const currentQty = parseInt(qtyInput.value);
  if (currentQty < 10) {
    qtyInput.value = currentQty + 1;
    updateQuantity();
  }
});

qtyInput.addEventListener('change', updateQuantity);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!productModal.classList.contains('show')) return;
  
  switch(e.key) {
    case 'Escape':
      closeProductModal();
      break;
    case 'ArrowLeft':
      if (currentProductIndex > 0) {
        const prevImage = currentProductImages[currentProductIndex - 1];
        mainProductImage.src = prevImage.src;
        mainProductImage.alt = prevImage.alt;
        setActiveThumbnail(currentProductIndex - 1);
        currentProductIndex--;
      }
      break;
    case 'ArrowRight':
      if (currentProductIndex < currentProductImages.length - 1) {
        const nextImage = currentProductImages[currentProductIndex + 1];
        mainProductImage.src = nextImage.src;
        mainProductImage.alt = nextImage.alt;
        setActiveThumbnail(currentProductIndex + 1);
        currentProductIndex++;
      }
      break;
  }
});

// Add click functionality to all gallery cards
document.querySelectorAll('.gallery').forEach(gallery => {
  const cards = gallery.querySelectorAll('.card');
  const images = gallery.querySelectorAll('img');
  
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const image = images[index];
      openProductModal(image.src, image.alt, images, index);
    });
  });
});

// Initialize quantity controls
updateQuantity();

```

```

