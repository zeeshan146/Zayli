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

// Video Gallery functionality
document.querySelectorAll('.video-card').forEach(videoCard => {
  const video = videoCard.querySelector('video');
  
  // Pause video on hover
  videoCard.addEventListener('mouseenter', () => {
    video.pause();
  });
  
  // Resume video when mouse leaves
  videoCard.addEventListener('mouseleave', () => {
    video.play();
  });
  
  // Click to open video in modal or fullscreen
  videoCard.addEventListener('click', () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  });
});

// Product Data with Real Prices
const productData = {
  necklaces: [
    { id: 'L1', name: 'Elegant Pearl Necklace', price: 1299, originalPrice: 1999, image: 'assets/necklaces/L1.jpeg', category: 'necklaces' },
    { id: 'L2', name: 'Diamond Cut Chain', price: 899, originalPrice: 1499, image: 'assets/necklaces/L2.jpeg', category: 'necklaces' },
    { id: 'L3', name: 'Royal Gold Necklace', price: 1899, originalPrice: 2499, image: 'assets/necklaces/L3.jpeg', category: 'necklaces' },
    { id: 'L4', name: 'Silver Statement Piece', price: 699, originalPrice: 1199, image: 'assets/necklaces/L4.jpeg', category: 'necklaces' },
    { id: 'L5', name: 'Layered Gold Chain', price: 1599, originalPrice: 2199, image: 'assets/necklaces/L5.jpeg', category: 'necklaces' },
    { id: 'L6', name: 'Minimalist Silver', price: 499, originalPrice: 899, image: 'assets/necklaces/L6.jpeg', category: 'necklaces' },
    { id: 'L7', name: 'Premium Diamond Necklace', price: 2499, originalPrice: 2999, image: 'assets/necklaces/L7.jpeg', category: 'necklaces' },
    { id: 'L8', name: 'Rose Gold Chain', price: 1199, originalPrice: 1799, image: 'assets/necklaces/L8.jpeg', category: 'necklaces' },
    { id: 'L9', name: 'Crystal Pendant Necklace', price: 799, originalPrice: 1299, image: 'assets/necklaces/L9.jpeg', category: 'necklaces' },
    { id: 'L10', name: 'Luxury Gold Chain', price: 2099, originalPrice: 2699, image: 'assets/necklaces/L10.jpeg', category: 'necklaces' },
    { id: 'L11', name: 'Silver Layered Chain', price: 599, originalPrice: 999, image: 'assets/necklaces/L11.jpeg', category: 'necklaces' },
    { id: 'L12', name: 'Gold Statement Necklace', price: 1699, originalPrice: 2299, image: 'assets/necklaces/L12.jpeg', category: 'necklaces' },
    { id: 'L13', name: 'Pearl Drop Necklace', price: 999, originalPrice: 1599, image: 'assets/necklaces/L13.jpeg', category: 'necklaces' },
    { id: 'L14', name: 'Diamond Chain Necklace', price: 2299, originalPrice: 2899, image: 'assets/necklaces/L14.jpeg', category: 'necklaces' },
    { id: 'L15', name: 'Silver Minimalist', price: 399, originalPrice: 699, image: 'assets/necklaces/L15.jpeg', category: 'necklaces' },
    { id: 'L16', name: 'Gold Premium Chain', price: 1999, originalPrice: 2599, image: 'assets/necklaces/L16.jpeg', category: 'necklaces' },
    { id: 'L17', name: 'Crystal Statement', price: 899, originalPrice: 1499, image: 'assets/necklaces/L17.jpeg', category: 'necklaces' },
    { id: 'lc2', name: 'Silver Elegant Chain', price: 649, originalPrice: 1099, image: 'assets/necklaces/lc2.jpeg', category: 'necklaces' },
    { id: 'lc3', name: 'Gold Layered Necklace', price: 1399, originalPrice: 1999, image: 'assets/necklaces/lc3.jpeg', category: 'necklaces' },
    { id: 'lc4', name: 'Pearl Luxury Chain', price: 1149, originalPrice: 1699, image: 'assets/necklaces/lc4.jpeg', category: 'necklaces' },
    { id: 'lc5', name: 'Diamond Silver Chain', price: 1799, originalPrice: 2399, image: 'assets/necklaces/lc5.jpeg', category: 'necklaces' },
    { id: 'lc6', name: 'Gold Statement Chain', price: 1549, originalPrice: 2149, image: 'assets/necklaces/lc6.jpeg', category: 'necklaces' },
    { id: 'lc7', name: 'Silver Premium Chain', price: 849, originalPrice: 1399, image: 'assets/necklaces/lc7.jpeg', category: 'necklaces' },
    { id: 'lc8', name: 'Crystal Gold Chain', price: 1249, originalPrice: 1849, image: 'assets/necklaces/lc8.jpeg', category: 'necklaces' },
    { id: 'lc9', name: 'Pearl Silver Chain', price: 749, originalPrice: 1249, image: 'assets/necklaces/lc9.jpeg', category: 'necklaces' },
    { id: 'lc12', name: 'Diamond Gold Chain', price: 1949, originalPrice: 2549, image: 'assets/necklaces/lc12.jpeg', category: 'necklaces' },
    { id: 'lc13', name: 'Silver Luxury Chain', price: 949, originalPrice: 1549, image: 'assets/necklaces/lc13.jpeg', category: 'necklaces' },
    { id: 'lc14', name: 'Gold Crystal Chain', price: 1649, originalPrice: 2249, image: 'assets/necklaces/lc14.jpeg', category: 'necklaces' },
    { id: 'lc15', name: 'Pearl Diamond Chain', price: 1349, originalPrice: 1949, image: 'assets/necklaces/lc15.jpeg', category: 'necklaces' },
    { id: 'lc16', name: 'Silver Statement Chain', price: 699, originalPrice: 1199, image: 'assets/necklaces/lc16.jpeg', category: 'necklaces' },
    { id: 'lc17', name: 'Gold Premium Chain', price: 1849, originalPrice: 2449, image: 'assets/necklaces/lc17.jpeg', category: 'necklaces' },
    { id: 'lc18', name: 'Crystal Silver Chain', price: 1049, originalPrice: 1649, image: 'assets/necklaces/lc18.jpeg', category: 'necklaces' },
    { id: 'lc19', name: 'Pearl Gold Chain', price: 1449, originalPrice: 2049, image: 'assets/necklaces/lc19.jpeg', category: 'necklaces' },
    { id: 'lc20', name: 'Diamond Silver Chain', price: 1599, originalPrice: 2199, image: 'assets/necklaces/lc20.jpeg', category: 'necklaces' }
  ],
  bracelets: [
    { id: 'B1', name: 'Elegant Gold Bracelet', price: 699, originalPrice: 1099, image: 'assets/bracelets/bracelet1.jpeg', category: 'bracelets' },
    { id: 'B2', name: 'Silver Charm Bracelet', price: 499, originalPrice: 799, image: 'assets/bracelets/bracelet2.jpeg', category: 'bracelets' },
    { id: 'B3', name: 'Diamond Cut Bracelet', price: 899, originalPrice: 1399, image: 'assets/bracelets/bracelet3.jpeg', category: 'bracelets' },
    { id: 'B4', name: 'Rose Gold Chain', price: 599, originalPrice: 999, image: 'assets/bracelets/bracelet4.jpeg', category: 'bracelets' },
    { id: 'B5', name: 'Premium Silver Bracelet', price: 799, originalPrice: 1299, image: 'assets/bracelets/bracelet5.jpeg', category: 'bracelets' }
  ],
  earrings: [
    { id: 'E1', name: 'Pearl Drop Earrings', price: 399, originalPrice: 699, image: 'assets/earrings/earrings-1.jpeg', category: 'earrings' },
    { id: 'E2', name: 'Gold Stud Earrings', price: 299, originalPrice: 499, image: 'assets/earrings/earrings2.jpeg', category: 'earrings' }
  ]
};

// Cart instance will be initialized below

// Premium Filter System
class PremiumFilterSystem {
  constructor() {
    this.initializeFilters();
    this.setupEventListeners();
    this.updatePriceDisplay();
    this.allProducts = [...productData.necklaces, ...productData.bracelets, ...productData.earrings];
    this.filteredProducts = [...this.allProducts];
    this.updateResults();
  }

  initializeFilters() {
    this.priceMin = document.getElementById('price-min');
    this.priceMax = document.getElementById('price-max');
    this.priceMinDisplay = document.querySelector('.price-min');
    this.priceMaxDisplay = document.querySelector('.price-max');
    this.sortButtons = document.querySelectorAll('.sort-btn');
    this.quickFilterButtons = document.querySelectorAll('.quick-filter-btn');
    this.clearFiltersBtn = document.querySelector('.clear-filters-btn');
    this.resultsCount = document.querySelector('.results-count strong');
    
    // Set initial values
    this.currentSort = 'featured';
    this.currentCategory = 'all';
    this.minPrice = 299;
    this.maxPrice = 2999;
  }

  setupEventListeners() {
    // Price range sliders
    this.priceMin.addEventListener('input', (e) => {
      this.minPrice = parseInt(e.target.value);
      this.updatePriceDisplay();
      this.applyFilters();
    });

    this.priceMax.addEventListener('input', (e) => {
      this.maxPrice = parseInt(e.target.value);
      this.updatePriceDisplay();
      this.applyFilters();
    });

    // Sort buttons
    this.sortButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.sortButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSort = btn.dataset.sort;
        this.applyFilters();
        this.animateButton(btn);
      });
    });

    // Quick filter buttons
    this.quickFilterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.quickFilterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category;
        this.applyFilters();
        this.animateButton(btn);
      });
    });

    // Clear filters
    this.clearFiltersBtn.addEventListener('click', () => {
      this.clearAllFilters();
    });
  }

  updatePriceDisplay() {
    this.priceMinDisplay.textContent = `₹${this.minPrice}`;
    this.priceMaxDisplay.textContent = `₹${this.maxPrice}`;
  }

  applyFilters() {
    // Filter by category
    let filtered = this.allProducts;
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.currentCategory);
    }

    // Filter by price
    filtered = filtered.filter(product => 
      product.price >= this.minPrice && product.price <= this.maxPrice
    );

    // Sort products
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;
    this.updateResults();
    this.showFilterApplied();
  }

  sortProducts(products) {
    switch (this.currentSort) {
      case 'price-low':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high':
        return products.sort((a, b) => b.price - a.price);
      case 'newest':
        return products.sort((a, b) => b.id.localeCompare(a.id));
      case 'featured':
      default:
        return products.sort((a, b) => {
          // Featured: Show discounted items first, then by price
          const aDiscount = ((a.originalPrice - a.price) / a.originalPrice) * 100;
          const bDiscount = ((b.originalPrice - b.price) / b.originalPrice) * 100;
          if (aDiscount !== bDiscount) return bDiscount - aDiscount;
          return a.price - b.price;
        });
    }
  }

  updateResults() {
    this.resultsCount.textContent = this.filteredProducts.length;
  }

  clearAllFilters() {
    // Reset price range
    this.priceMin.value = 299;
    this.priceMax.value = 2999;
    this.minPrice = 299;
    this.maxPrice = 2999;
    this.updatePriceDisplay();
    
    // Reset sort
    this.sortButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-sort="featured"]').classList.add('active');
    this.currentSort = 'featured';
    
    // Reset category
    this.quickFilterButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');
    this.currentCategory = 'all';
    
    this.filteredProducts = [...this.allProducts];
    this.updateResults();
    this.showClearFeedback();
  }

  animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }

  showFilterApplied() {
    const filterSystem = document.querySelector('.premium-filter-system');
    filterSystem.style.boxShadow = '0 20px 40px rgba(212, 180, 140, 0.2)';
    setTimeout(() => {
      filterSystem.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
    }, 300);
  }

  showClearFeedback() {
    const filterSystem = document.querySelector('.premium-filter-system');
    filterSystem.style.animation = 'filterSlideIn 0.6s ease-out';
    setTimeout(() => {
      filterSystem.style.animation = '';
    }, 600);
  }
}

// Product Card Generator
class ProductCardGenerator {
  constructor() {
    this.generateAllProducts();
    this.setupCartButton();
  }

  generateAllProducts() {
    this.generateProductCards('necklaces-gallery', productData.necklaces);
    this.generateProductCards('bracelets-gallery', productData.bracelets);
    this.generateProductCards('earrings-gallery', productData.earrings);
  }

  generateProductCards(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return;
    }

    container.innerHTML = '';
    console.log(`Generating ${products.length} cards for ${containerId}`);
    console.log('Products:', products);
    
    products.forEach((product, index) => {
      const card = this.createProductCard(product);
      container.appendChild(card);
      console.log(`Card ${index + 1} created for ${product.name}`);
    });
    
    console.log(`Total cards in ${containerId}:`, container.children.length);
  }

  createProductCard(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.productId = product.id;
    
    const cardHTML = `
      <span class="badge">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="card-content">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">
            <span class="current-price">₹${product.price}</span>
            <span class="original-price">₹${product.originalPrice}</span>
            <span class="discount-badge">${discount}% OFF</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, ${product.originalPrice}, '${product.image}', '${product.category}')">
            <i class="fa-solid fa-cart-plus"></i>
            Add to Cart
          </button>
          <button class="quick-view-btn" onclick="openProductModal('${product.image}', '${product.name}', [], 0, '${product.category}')">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>
    `;
    
    card.innerHTML = cardHTML;
    
    console.log(`Created card for ${product.name} with discount ${discount}%`);
    console.log('Card HTML preview:', cardHTML.substring(0, 200) + '...');
    
    return card;
  }

  setupCartButton() {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        if (zayliCart.items.length > 0) {
          const message = zayliCart.getWhatsAppMessage();
          const whatsappUrl = `https://wa.me/917903162712?text=${message}`;
          window.open(whatsappUrl, '_blank');
        } else {
          zayliCart.showSuccessNotification('Your cart is empty. Add some products first!');
        }
      });
    }
  }
}

// Initialize everything when DOM is loaded
function initializeApp() {
  // Initialize the premium filter system
  window.premiumFilter = new PremiumFilterSystem();
  
  // Initialize product cards
  window.productGenerator = new ProductCardGenerator();
  
  // Initialize quantity controls
  updateQuantity();
  
  console.log('All systems initialized successfully!');
  console.log('Cart:', zayliCart);
  console.log('Product Generator:', window.productGenerator);
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already loaded, initialize immediately
  initializeApp();
}

// DEBUG: Check if buttons exist
setTimeout(() => {
  const buttons = document.querySelectorAll('.add-to-cart-btn');
  console.log('🔍 Found', buttons.length, 'add-to-cart buttons');
  
  if (buttons.length === 0) {
    console.log('❌ NO BUTTONS FOUND!');
    alert('❌ NO ADD TO CART BUTTONS FOUND! Check the console for details.');
  } else {
    console.log('✅ Buttons found:', buttons);
    alert('✅ Found ' + buttons.length + ' add to cart buttons! They should be visible now.');
    
    // Make sure they're visible
    buttons.forEach((btn, index) => {
      btn.style.background = '#ff0000';
      btn.style.color = 'white';
      btn.style.padding = '20px';
      btn.style.fontSize = '18px';
      btn.style.border = '5px solid yellow';
      btn.style.display = 'block';
      btn.style.visibility = 'visible';
      btn.style.opacity = '1';
      btn.style.zIndex = '9999';
      console.log('Button', index + 1, ':', btn);
    });
  }
}, 2000);

// Enhanced Cart System - Single Implementation
class ZayliCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.init();
  }

  init() {
    this.updateCartDisplay();
    this.setupCartButton();
    console.log('Zayli Cart System initialized!');
  }

  addItem(id, name, price, originalPrice, image, category, quantity = 1, button = null) {
    const existingItem = this.items.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: id,
        name: name,
        price: price,
        originalPrice: originalPrice,
        image: image,
        category: category,
        quantity: quantity
      });
    }
    
    this.calculateTotal();
    this.updateCartDisplay();
    this.showAddToCartSuccess();
    
    // Show button success feedback if button is provided
    if (button) {
      this.showAddToCartButtonSuccess(button);
    }
    
    // Show success notification
    this.showSuccessNotification(`${name} added to cart!`);
    
    console.log('✅ Item added to cart:', name);
    console.log('📦 Current cart:', this.items);
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.calculateTotal();
    this.updateCartDisplay();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.calculateTotal();
        this.updateCartDisplay();
      }
    }
  }

  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'block' : 'none';
      
      // Add bounce animation when items are added
      if (totalItems > 0) {
        cartCount.style.animation = 'cartBounce 0.6s ease-out';
        setTimeout(() => {
          cartCount.style.animation = '';
        }, 600);
      }
    }
  }

  showAddToCartSuccess() {
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
      cartBtn.style.transform = 'scale(1.1)';
      cartBtn.style.transition = 'transform 0.2s ease';
      setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
      }, 200);
    }
  }

  showAddToCartButtonSuccess(button) {
    if (!button) return;
    
    const originalHTML = button.innerHTML;
    const originalBackground = button.style.background;
    
    button.classList.add('success');
    button.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
    button.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    button.disabled = true;
    
    setTimeout(() => {
      button.classList.remove('success');
      button.innerHTML = originalHTML;
      button.style.background = originalBackground;
      button.disabled = false;
    }, 1500);
  }

  showSuccessNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <i class="fa-solid fa-check-circle"></i>
      <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
      zIndex: '10000',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '500',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  getWhatsAppMessage() {
    if (this.items.length === 0) return '';
    
    let message = '🛍️ *ZAYLI JEWELRY ORDER*\n\n';
    
    this.items.forEach(item => {
      const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
      message += `*${item.name}*\n`;
      message += `Quantity: ${item.quantity}\n`;
      message += `Price: ₹${item.price} (${discount}% OFF)\n`;
      message += `Original: ₹${item.originalPrice}\n\n`;
    });
    
    message += `*Total: ₹${this.total}*\n\n`;
    message += 'Please confirm my order! 🙏';
    
    return encodeURIComponent(message);
  }

  setupCartButton() {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        if (this.items.length > 0) {
          const message = this.getWhatsAppMessage();
          const whatsappUrl = `https://wa.me/917903162712?text=${message}`;
          window.open(whatsappUrl, '_blank');
        } else {
          this.showSuccessNotification('Your cart is empty. Add some products first!');
        }
      });
    }
  }

  clearCart() {
    this.items = [];
    this.total = 0;
    this.updateCartDisplay();
  }
}

// Initialize global cart instance
const zayliCart = new ZayliCart();

// Global add to cart function for HTML onclick events
function addToCart(id, name, price, originalPrice, image, category, quantity = 1, button = null) {
  // If called from an onclick event, try to get the button context
  if (!button && event && event.target) {
    button = event.target.closest('.add-to-cart-btn');
  }
  zayliCart.addItem(id, name, price, originalPrice, image, category, quantity, button);
}

// Test function to verify cart functionality
function testCart() {
  console.log('🧪 Testing cart functionality...');
  console.log('📦 Current cart items:', zayliCart.items);
  console.log('💰 Current cart total:', zayliCart.total);
  
  // Test adding a sample item
  addToCart('test', 'Test Product', 999, 1499, 'assets/logo/zayli-logo.jpeg', 'test');
  console.log('✅ Test product added to cart!');
}

```

```

