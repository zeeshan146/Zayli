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

// Product data for different categories
const productCategories = {
  necklaces: {
    title: "Elegant Zayli Necklace Collection",
    price: "₹1,299",
    originalPrice: "₹1,999",
    discount: "35% OFF",
    description: "Discover our stunning necklace collection featuring premium craftsmanship and timeless elegance. Each piece is meticulously designed to complement your style for both casual and formal occasions. Made with high-quality materials that ensure durability and lasting beauty.",
    features: [
      "Premium Sterling Silver construction",
      "Elegant design suitable for all occasions",
      "Adjustable length (18-22 inches) for perfect fit",
      "Hypoallergenic and skin-friendly materials",
      "Comes with elegant gift packaging",
      "Handcrafted by skilled artisans"
    ],
    specs: {
      "Material": "Sterling Silver (925)",
      "Length": "18-22 inches adjustable",
      "Weight": "15-25 grams",
      "Clasp": "Premium Lobster Clasp",
      "Finish": "Polished & Rhodium plated"
    }
  },
  earrings: {
    title: "Sophisticated Zayli Earring Collection",
    price: "₹899",
    originalPrice: "₹1,399",
    discount: "36% OFF",
    description: "Elevate your style with our sophisticated earring collection. Each piece showcases intricate detailing and premium materials, designed to add elegance to any outfit. Perfect for daily wear and special occasions alike.",
    features: [
      "Premium metal construction",
      "Intricate design patterns",
      "Lightweight and comfortable wear",
      "Hypoallergenic materials",
      "Secure butterfly backings",
      "Elegant presentation box"
    ],
    specs: {
      "Material": "Sterling Silver & Gold Plated",
      "Size": "Medium (15-20mm)",
      "Weight": "8-12 grams per pair",
      "Backing": "Butterfly Clasp",
      "Finish": "Polished & Plated"
    }
  },
  bracelets: {
    title: "Charming Zayli Bracelet Collection",
    price: "₹699",
    originalPrice: "₹1,099",
    discount: "36% OFF",
    description: "Adorn your wrists with our charming bracelet collection. Each piece features delicate craftsmanship and elegant designs that complement your personal style. Perfect for layering or wearing alone for a sophisticated look.",
    features: [
      "Delicate chain construction",
      "Adjustable sizing for perfect fit",
      "Elegant charm designs",
      "Lightweight and comfortable",
      "Hypoallergenic materials",
      "Gift-ready packaging"
    ],
    specs: {
      "Material": "Sterling Silver",
      "Length": "7-8 inches adjustable",
      "Weight": "10-15 grams",
      "Clasp": "Toggle or Lobster Clasp",
      "Finish": "Polished & Rhodium plated"
    }
  }
};

// Open product modal
function openProductModal(imageSrc, imageAlt, galleryImages, imageIndex, category = 'necklaces') {
  currentProductImages = galleryImages;
  currentProductIndex = imageIndex;
  
  // Set main image
  mainProductImage.src = imageSrc;
  mainProductImage.alt = imageAlt;
  
  // Get product data based on category
  const productData = productCategories[category] || productCategories.necklaces;
  
  // Update product title
  productTitle.textContent = productData.title;
  
  // Update product details in the modal
  updateProductDetails(productData);
  
  // Create thumbnails
  createThumbnails(galleryImages, imageIndex);
  
  // Show modal
  productModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Update product details in the modal
function updateProductDetails(productData) {
  // Update price information
  const priceElement = document.querySelector('.price');
  const originalPriceElement = document.querySelector('.original-price');
  const discountElement = document.querySelector('.discount');
  
  if (priceElement) priceElement.textContent = productData.price;
  if (originalPriceElement) originalPriceElement.textContent = productData.originalPrice;
  if (discountElement) discountElement.textContent = productData.discount;
  
  // Update description
  const descriptionElement = document.querySelector('.product-description p');
  if (descriptionElement) descriptionElement.textContent = productData.description;
  
  // Update features
  const featuresList = document.querySelector('.product-features ul');
  if (featuresList) {
    featuresList.innerHTML = '';
    productData.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });
  }
  
  // Update specifications
  const specsGrid = document.querySelector('.spec-grid');
  if (specsGrid) {
    specsGrid.innerHTML = '';
    Object.entries(productData.specs).forEach(([key, value]) => {
      const specItem = document.createElement('div');
      specItem.className = 'spec-item';
      specItem.innerHTML = `
        <span class="spec-label">${key}:</span>
        <span class="spec-value">${value}</span>
      `;
      specsGrid.appendChild(specItem);
    });
  }
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
  
  // Determine category based on gallery ID
  let category = 'necklaces'; // default
  if (gallery.id === 'earrings-gallery') {
    category = 'earrings';
  } else if (gallery.id === 'bracelets-gallery') {
    category = 'bracelets';
  }
  
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const image = images[index];
      openProductModal(image.src, image.alt, images, index, category);
    });
  });
});

// Initialize quantity controls
updateQuantity();

```

```

