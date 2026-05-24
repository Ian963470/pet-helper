// ── State ─────────────────────────────────────────────────────────────────────
let currentLostPetId = sessionStorage.getItem('currentLostPetId') || null;
let allSightings = [];

// ── Navigation ────────────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Validation ────────────────────────────────────────────────────────────────
function isValidPhone(phone) {
  const digits = phone.replace(/[\s\-\(\)\+]/g, '');
  return /^\d{7,15}$/.test(digits);
}

function isValidContact(contact) {
  if (isValidPhone(contact)) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
}

// ── Error helpers ─────────────────────────────────────────────────────────────
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById('err-' + fieldId);
  if (field) field.classList.add('error');
  if (errEl) errEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById('err-' + fieldId);
  if (field) field.classList.remove('error');
  if (errEl) errEl.textContent = '';
}

// ── localStorage helpers ──────────────────────────────────────────────────────
function getLostPetReports() {
  return JSON.parse(localStorage.getItem('lostPets') || '[]');
}

function setLostPetReports(reports) {
  try {
    localStorage.setItem('lostPets', JSON.stringify(reports));
  } catch (e) {
    alert('Storage is full. Try removing the photo to save space.');
  }
}

function getRawSightings() {
  return JSON.parse(localStorage.getItem('sightings') || '[]');
}

function getSightingReports() {
  const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;
  return getRawSightings().filter(s => s.timestamp > cutoff && !s.flagged);
}

function setSightingReports(sightings) {
  try {
    localStorage.setItem('sightings', JSON.stringify(sightings));
  } catch (e) {
    alert('Storage is full. Try removing the photo to save space.');
  }
}

// ── Photo reader ──────────────────────────────────────────────────────────────
function readPhoto(fileInput, callback) {
  const file = fileInput.files[0];
  if (!file) { callback(null, null); return; }

  if (file.size > 5 * 1024 * 1024) {
    callback(null, 'Photo must be under 5 MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = e => callback(e.target.result, null);
  reader.readAsDataURL(file);
}

// ── Lost Pet Form ─────────────────────────────────────────────────────────────
document.getElementById('lost-pet-form-el').addEventListener('submit', function (e) {
  e.preventDefault();

  const lpFields = ['lp-pet-type', 'lp-color', 'lp-size', 'lp-gender', 'lp-street', 'lp-city', 'lp-contact'];
  lpFields.forEach(f => clearError(f));
  clearError('lp-photo');

  const petType  = document.getElementById('lp-pet-type').value;
  const color    = document.getElementById('lp-color').value.trim();
  const size     = document.getElementById('lp-size').value;
  const gender   = document.getElementById('lp-gender').value;
  const desc     = document.getElementById('lp-description').value.trim();
  const street   = document.getElementById('lp-street').value.trim();
  const city     = document.getElementById('lp-city').value.trim();
  const contact  = document.getElementById('lp-contact').value.trim();

  let valid = true;
  if (!petType)  { showError('lp-pet-type', 'This field is required'); valid = false; }
  if (!color)    { showError('lp-color',    'This field is required'); valid = false; }
  if (!size)     { showError('lp-size',     'This field is required'); valid = false; }
  if (!gender)   { showError('lp-gender',   'This field is required'); valid = false; }
  if (!street)   { showError('lp-street',   'This field is required'); valid = false; }
  if (!city)     { showError('lp-city',     'This field is required'); valid = false; }
  if (!contact) {
    showError('lp-contact', 'This field is required'); valid = false;
  } else if (!isValidContact(contact)) {
    showError('lp-contact', 'Please enter a valid phone number or email address'); valid = false;
  }
  if (!valid) return;

  readPhoto(document.getElementById('lp-photo'), (photoData, err) => {
    if (err) { showError('lp-photo', err); return; }

    const id = currentLostPetId || generateId();
    const report = { id, petType, color, size, gender, desc, street, city, contact, photo: photoData, timestamp: Date.now() };

    const reports = getLostPetReports();
    const existingIdx = reports.findIndex(r => r.id === id);
    if (existingIdx !== -1) {
      reports[existingIdx] = report;
    } else {
      reports.push(report);
    }
    setLostPetReports(reports);

    currentLostPetId = id;
    sessionStorage.setItem('currentLostPetId', id);

    const conf = document.getElementById('lost-pet-confirmation');
    conf.textContent = 'Your report was saved. We will show you sightings near your area.';
    conf.classList.remove('hidden');
    document.getElementById('lost-pet-controls').classList.remove('hidden');

    allSightings = getMatchingSightings(report);
    renderResults();
    renderMissingGallery();
    renderSidebar();

    setTimeout(() => showPage('sightings-results'), 1500);
  });
});

// ── Edit / Delete / Found ─────────────────────────────────────────────────────
function editLostPetReport() {
  if (!currentLostPetId) return;
  const report = getLostPetReports().find(r => r.id === currentLostPetId);
  if (!report) { alert('This report no longer exists.'); return; }

  document.getElementById('lp-pet-type').value  = report.petType;
  document.getElementById('lp-color').value      = report.color;
  document.getElementById('lp-size').value       = report.size;
  document.getElementById('lp-gender').value     = report.gender;
  document.getElementById('lp-description').value = report.desc || '';
  document.getElementById('lp-street').value     = report.street;
  document.getElementById('lp-city').value       = report.city;
  document.getElementById('lp-contact').value    = report.contact;

  document.getElementById('lost-pet-confirmation').classList.add('hidden');
  showPage('lost-pet-form');
}

function deleteLostPetReport() {
  if (!currentLostPetId) return;
  if (!confirm('Are you sure you want to delete your report?')) return;

  setLostPetReports(getLostPetReports().filter(r => r.id !== currentLostPetId));
  clearOwnerSession();
  alert('Your report has been removed.');
  showPage('home');
}

function markPetAsFound() {
  if (!currentLostPetId) return;
  if (!confirm('Mark your pet as found? This will remove your report.')) return;

  setLostPetReports(getLostPetReports().filter(r => r.id !== currentLostPetId));
  clearOwnerSession();
  alert('Great news! We hope your pet is home safe.');
  showPage('home');
}

function clearOwnerSession() {
  currentLostPetId = null;
  sessionStorage.removeItem('currentLostPetId');
  document.getElementById('lost-pet-form-el').reset();
  document.getElementById('lost-pet-confirmation').classList.add('hidden');
  document.getElementById('lost-pet-controls').classList.add('hidden');
}

// ── Sighting Form ─────────────────────────────────────────────────────────────
document.getElementById('sighting-form-el').addEventListener('submit', function (e) {
  e.preventDefault();

  const sFields = ['s-pet-type', 's-color', 's-size', 's-gender', 's-street', 's-city', 's-phone'];
  sFields.forEach(f => clearError(f));
  clearError('s-photo');

  const petType = document.getElementById('s-pet-type').value;
  const color   = document.getElementById('s-color').value.trim();
  const size    = document.getElementById('s-size').value;
  const gender  = document.getElementById('s-gender').value;
  const street  = document.getElementById('s-street').value.trim();
  const city    = document.getElementById('s-city').value.trim();
  const phone   = document.getElementById('s-phone').value.trim();

  let valid = true;
  if (!petType) { showError('s-pet-type', 'This field is required'); valid = false; }
  if (!color)   { showError('s-color',    'This field is required'); valid = false; }
  if (!size)    { showError('s-size',     'This field is required'); valid = false; }
  if (!gender)  { showError('s-gender',   'This field is required'); valid = false; }
  if (!street)  { showError('s-street',   'This field is required'); valid = false; }
  if (!city)    { showError('s-city',     'This field is required'); valid = false; }
  if (!phone) {
    showError('s-phone', 'This field is required'); valid = false;
  } else if (!isValidPhone(phone)) {
    showError('s-phone', 'Please enter a valid phone number'); valid = false;
  }
  if (!valid) return;

  readPhoto(document.getElementById('s-photo'), (photoData, err) => {
    if (err) { showError('s-photo', err); return; }

    const sighting = {
      id: generateId(),
      petType, color, size, gender,
      street, city, phone,
      photo: photoData,
      timestamp: Date.now(),
      flagged: false
    };

    const all = getRawSightings();
    all.push(sighting);
    setSightingReports(all);

    const matches = findMatchingLostPets(sighting);
    const conf = document.getElementById('sighting-confirmation');
    conf.textContent = matches.length > 0
      ? 'Your sighting may match a lost pet! The owner can now see your report.'
      : 'No matches yet, but your report was saved. The owner will be able to see it.';
    conf.classList.remove('hidden');

    document.getElementById('sighting-form-el').reset();
    renderSidebar();
  });
});

// ── Matching logic ────────────────────────────────────────────────────────────
function genderMatches(a, b) {
  return a === b || a === 'unknown' || b === 'unknown';
}

function getMatchingSightings(report) {
  return getSightingReports()
    .filter(s =>
      s.petType === report.petType &&
      s.color.toLowerCase() === report.color.toLowerCase() &&
      s.size === report.size &&
      genderMatches(s.gender, report.gender) &&
      s.city.toLowerCase() === report.city.toLowerCase()
    )
    .sort((a, b) => b.timestamp - a.timestamp);
}

function findMatchingLostPets(sighting) {
  return getLostPetReports().filter(r =>
    r.petType === sighting.petType &&
    r.color.toLowerCase() === sighting.color.toLowerCase() &&
    r.size === sighting.size &&
    genderMatches(r.gender, sighting.gender) &&
    r.city.toLowerCase() === sighting.city.toLowerCase()
  );
}

// ── Filters ───────────────────────────────────────────────────────────────────
function applyFilters() {
  const colorF  = document.getElementById('f-color').value.trim().toLowerCase();
  const sizeF   = document.getElementById('f-size').value;
  const genderF = document.getElementById('f-gender').value;
  const nhoodF  = document.getElementById('f-neighborhood').value.trim().toLowerCase();

  const filtered = allSightings.filter(s => {
    if (colorF  && !s.color.toLowerCase().includes(colorF))   return false;
    if (sizeF   && s.size !== sizeF)                          return false;
    if (genderF && s.gender !== genderF)                      return false;
    if (nhoodF  && !s.street.toLowerCase().includes(nhoodF))  return false;
    return true;
  });

  renderCards(filtered.slice(0, 20));
}

function clearFilters() {
  document.getElementById('f-color').value       = '';
  document.getElementById('f-size').value        = '';
  document.getElementById('f-gender').value      = '';
  document.getElementById('f-neighborhood').value = '';
  applyFilters();
}

// ── Results rendering ─────────────────────────────────────────────────────────
function renderResults() {
  applyFilters();
}

function renderCards(cards) {
  const countEl = document.getElementById('results-count');
  const listEl  = document.getElementById('results-list');

  if (allSightings.length === 0) {
    countEl.textContent = '';
    listEl.innerHTML = '<p class="empty-msg">No sightings yet. Check back soon.</p>';
    return;
  }

  if (cards.length === 0) {
    countEl.textContent = '';
    listEl.innerHTML = '<p class="empty-msg">No sightings match your filters. Try adjusting them.</p>';
    return;
  }

  countEl.textContent = cards.length + ' sighting' + (cards.length === 1 ? '' : 's') + ' found near you';
  listEl.innerHTML = cards.map(buildCard).join('');
}

function buildCard(s) {
  const photoHtml = s.photo
    ? `<img class="card-photo" src="${s.photo}" alt="Photo of spotted pet" />`
    : '';

  return `
    <div class="card" id="card-${s.id}">
      ${photoHtml}
      <div class="card-location">${escapeHtml(s.street)}, ${escapeHtml(s.city)}</div>
      <div class="card-details">
        ${capitalize(s.petType)} &bull; ${escapeHtml(s.color)} &bull; ${capitalize(s.size)} &bull; ${capitalize(s.gender)}
      </div>
      <div class="card-time">${formatDate(s.timestamp)}</div>
      <div class="card-actions">
        <button class="btn btn-ghost" onclick="showContact('${s.id}', '${escapeHtml(s.phone)}')">Show contact</button>
        <button class="btn btn-ghost" onclick="reportSpam('${s.id}')">Report spam</button>
      </div>
      <div id="contact-${s.id}" class="phone-revealed hidden">${escapeHtml(s.phone)}</div>
    </div>
  `;
}

function showContact(id) {
  const el = document.getElementById('contact-' + id);
  if (el) el.classList.remove('hidden');
}

function reportSpam(id) {
  const all = getRawSightings();
  const idx = all.findIndex(s => s.id === id);
  if (idx !== -1) { all[idx].flagged = true; setSightingReports(all); }

  allSightings = allSightings.filter(s => s.id !== id);
  applyFilters();
  alert('Thank you. This sighting has been flagged for review.');
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const TIPS = [
  'Microchipped pets are up to 20 times more likely to be returned to their owner.',
  'Always put a collar tag with your phone number on your pet — even indoor cats.',
  'Pets are more likely to hide at night. Search near bushes, under cars, and in quiet spots.',
  'Shaking a treat bag is more effective than calling your pet\'s name when searching.',
  'Most lost pets are found within a few blocks of their home.',
  'Letting your pet\'s bedding air outside can help them sniff their way home.',
  'Call local vets and shelters within the first hour — they keep records of found animals.',
];
let currentTip = 0;

function renderSidebar() {
  const lost     = getLostPetReports();
  const sightings = getSightingReports();
  const today    = Date.now() - 24 * 60 * 60 * 1000;
  const todayCount = sightings.filter(s => s.timestamp > today).length;

  const sbMissing = document.getElementById('sb-missing');
  const sbToday   = document.getElementById('sb-today');
  const sbActive  = document.getElementById('sb-active');
  if (sbMissing) sbMissing.textContent = lost.length;
  if (sbToday)   sbToday.textContent   = todayCount;
  if (sbActive)  sbActive.textContent  = sightings.length;

  // Recent activity — merge reports and sightings, sort by newest
  const all = [
    ...lost.map(r => ({ type: 'lost', label: `🐾 ${capitalize(r.color)} ${capitalize(r.petType)} reported missing`, time: r.timestamp })),
    ...sightings.map(s => ({ type: 'sighting', label: `👀 ${capitalize(s.color)} ${capitalize(s.petType)} spotted on ${escapeHtml(s.street)}`, time: s.timestamp })),
  ].sort((a, b) => b.time - a.time).slice(0, 5);

  const activityEl = document.getElementById('sb-activity');
  if (activityEl) {
    activityEl.innerHTML = all.length
      ? all.map(a => `
          <div class="activity-item">
            ${a.label}
            <span class="activity-time">${timeAgo(a.time)}</span>
          </div>`).join('')
      : '<p class="activity-empty">No activity yet.</p>';
  }

  // Tip
  const tipEl = document.getElementById('sb-tip');
  if (tipEl) tipEl.textContent = TIPS[currentTip];
}

function nextTip() {
  currentTip = (currentTip + 1) % TIPS.length;
  const tipEl = document.getElementById('sb-tip');
  if (tipEl) tipEl.textContent = TIPS[currentTip];
}

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return mins + ' min ago';
  if (hours < 24) return hours + ' hr ago';
  return days + ' day' + (days === 1 ? '' : 's') + ' ago';
}

// ── Facts toggle ─────────────────────────────────────────────────────────────
function toggleFacts() {
  const content = document.getElementById('facts-content');
  const btn = document.getElementById('facts-toggle');
  const isNowHidden = content.classList.toggle('hidden');
  btn.textContent = isNowHidden ? 'Show facts ▼' : 'Hide facts ▲';
}

// ── Missing pet gallery ───────────────────────────────────────────────────────
const PET_EMOJI = { dog: '🐕', cat: '🐈', bird: '🐦', rabbit: '🐇', other: '🐾' };

function renderMissingGallery() {
  const gallery = document.getElementById('missing-gallery');
  const badge   = document.getElementById('missing-count');
  if (!gallery) return;

  const reports = getLostPetReports().slice(-6).reverse();
  badge.textContent = reports.length || '';
  badge.style.display = reports.length ? 'inline' : 'none';

  if (reports.length === 0) {
    gallery.innerHTML = '<div class="gallery-empty">No pets reported missing yet.<br>Be the first to use Lost Pet Finder!</div>';
    return;
  }

  gallery.innerHTML = reports.map(r => {
    const imageHtml = r.photo
      ? `<img class="pet-tile-image" src="${r.photo}" alt="Photo of ${escapeHtml(r.color)} ${escapeHtml(r.petType)}" />`
      : `<div class="pet-tile-emoji">${PET_EMOJI[r.petType] || '🐾'}</div>`;

    return `
      <div class="pet-tile" onclick="showPage('sightings-results')" title="Click to view sightings">
        ${imageHtml}
        <div class="pet-tile-info">
          <div class="pet-tile-name">${capitalize(r.color)} ${capitalize(r.petType)}</div>
          <div class="pet-tile-detail">${escapeHtml(r.city)}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Accessibility ─────────────────────────────────────────────────────────────
function toggleLargeText() {
  document.body.classList.toggle('large-text');
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
}

// ── Init ──────────────────────────────────────────────────────────────────────
renderMissingGallery();
renderSidebar();

if (currentLostPetId) {
  const report = getLostPetReports().find(r => r.id === currentLostPetId);
  if (report) {
    document.getElementById('lost-pet-controls').classList.remove('hidden');
    allSightings = getMatchingSightings(report);
  } else {
    currentLostPetId = null;
    sessionStorage.removeItem('currentLostPetId');
  }
}
