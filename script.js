const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Mobile nav
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger) {
  hamburger.addEventListener('click', () => navMenu.classList.toggle('show'));
}

// Year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Helpers
const MAX_SIZE = 10 * 1024 * 1024;
const toDataURL = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function toast(msg) {
  console.log(msg);
}

async function handleFiles(files, key, galleryEl) {
  const valid = [];
  for (const f of files) {
    if (!f.type.startsWith('image/')) continue;
    if (f.size > MAX_SIZE) { toast(`Skipped ${f.name}: too large`); continue; }
    valid.push(f);
  }
  if (!valid.length) return;

  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  for (const file of valid) {
    const url = await toDataURL(file);
    existing.push({ url, name: file.name, ts: Date.now() });
  }
  localStorage.setItem(key, JSON.stringify(existing));
  renderGallery(key, galleryEl);
}

function renderGallery(key, galleryEl) {
  const items = JSON.parse(localStorage.getItem(key) || '[]');
  galleryEl.innerHTML = '';
  for (const item of items) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <span class="badge">${key === 'earrings' ? 'Earrings' : 'Necklaces'}</span>
      <div class="card-actions">
        <button class="icon-btn" data-action="download" title="Download"><i class="fa-regular fa-circle-down"></i></button>
        <button class="icon-btn" data-action="remove" title="Remove"><i class="fa-regular fa-trash-can"></i></button>
      </div>
      <img loading="lazy" alt="${item.name || ''}">
    `;
    const img = card.querySelector('img');
    img.src = item.url;
    galleryEl.appendChild(card);

    card.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      const action = b.dataset.action;
      if (action === 'remove') {
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        const idx = arr.findIndex(x => x.url === item.url);
        if (idx > -1) {
          arr.splice(idx, 1);
          localStorage.setItem(key, JSON.stringify(arr));
          renderGallery(key, galleryEl);
        }
      } else if (action === 'download') {
        const a = document.createElement('a');
        a.href = item.url;
        a.download = item.name || 'zayli-photo';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    });
  }
}

// Wire up Earrings
const earringsInput = $('#earrings-input');
const earringsDrop = $('#earrings-drop');
const earringsGallery = $('#earrings-gallery');
const earringsClear = $('#earrings-clear');

if (earringsInput && earringsDrop && earringsGallery) {
  renderGallery('earrings', earringsGallery);

  earringsInput.addEventListener('change', e => {
    handleFiles(e.target.files, 'earrings', earringsGallery);
    earringsInput.value = '';
  });

  ;['dragenter','dragover'].forEach(evt =>
    earringsDrop.addEventListener(evt, e => { e.preventDefault(); earringsDrop.classList.add('drag'); })
  );
  ;['dragleave','drop'].forEach(evt =>
    earringsDrop.addEventListener(evt, e => { e.preventDefault(); earringsDrop.classList.remove('drag'); })
  );
  earringsDrop.addEventListener('drop', e => {
    const files = e.dataTransfer.files;
    handleFiles(files, 'earrings', earringsGallery);
  });

  earringsClear.addEventListener('click', () => {
    localStorage.removeItem('earrings');
    renderGallery('earrings', earringsGallery);
  });
}

// Wire up Necklaces
const necklacesInput = $('#necklaces-input');
const necklacesDrop = $('#necklaces-drop');
const necklacesGallery = $('#necklaces-gallery');
const necklacesClear = $('#necklaces-clear');

if (necklacesInput && necklacesDrop && necklacesGallery) {
  renderGallery('necklaces', necklacesGallery);

  necklacesInput.addEventListener('change', e => {
    handleFiles(e.target.files, 'necklaces', necklacesGallery);
    necklacesInput.value = '';
  });

  ;['dragenter','dragover'].forEach(evt =>
    necklacesDrop.addEventListener(evt, e => { e.preventDefault(); necklacesDrop.classList.add('drag'); })
  );
  ;['dragleave','drop'].forEach(evt =>
    necklacesDrop.addEventListener(evt, e => { e.preventDefault(); necklacesDrop.classList.remove('drag'); })
  );
  necklacesDrop.addEventListener('drop', e => {
    const files = e.dataTransfer.files;
    handleFiles(files, 'necklaces', necklacesGallery);
  });

  necklacesClear.addEventListener('click', () => {
    localStorage.removeItem('necklaces');
    renderGallery('necklaces', necklacesGallery);
  });
}

// Logo sync: if there's only one logo, mirror it to hero/footer when it loads/fails gracefully
const brandLogo = $('#brand-logo');
const heroLogo = $('#hero-logo');
if (brandLogo && heroLogo) {
  heroLogo.src = brandLogo.src;
}

```

```

