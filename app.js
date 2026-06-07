// ── Supabase ──────────────────────────────────────────────────────────────────
const { createClient } = supabase;
const db = createClient(
  'https://jfixnhhdiwtteugxpkwi.supabase.co',
  'sb_publishable_D8svdOvMpGN5amAUsfOHqA_K16erMAm'
);

// ── State ─────────────────────────────────────────────────────────────────────
let currentLostPetId = sessionStorage.getItem('currentLostPetId') || null;
let allSightings = [];

// ── Navigation ────────────────────────────────────────────────────────────────
async function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  if (id === 'sightings-results') {
    if (currentLostPetId) {
      const report = await getLostPetById(currentLostPetId);
      if (report) allSightings = await getMatchingSightings(report);
    }
    renderResults();
    await renderOwnerBar();
  }
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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateOwnerCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'PH-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += '-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function hashOwnerCode(code) {
  let h = 5381;
  for (let i = 0; i < code.length; i++) {
    h = ((h << 5) + h) ^ code.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(36);
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

// ── Row mappers ───────────────────────────────────────────────────────────────
function rowToReport(row) {
  return {
    id: row.id,
    petType: row.pet_type,
    color: row.color,
    size: row.size,
    gender: row.gender,
    desc: row.description,
    street: row.street,
    city: row.city,
    contact: row.contact,
    photo: row.photo,
    timestamp: row.timestamp,
    status: row.status,
    ownerCodeHash: row.owner_code_hash,
    pendingFoundClaimId: row.pending_found_claim_id
  };
}

function reportToRow(r) {
  return {
    id: r.id,
    pet_type: r.petType,
    color: r.color,
    size: r.size,
    gender: r.gender,
    description: r.desc || null,
    street: r.street,
    city: r.city,
    contact: r.contact,
    photo: r.photo || null,
    timestamp: r.timestamp,
    status: r.status,
    owner_code_hash: r.ownerCodeHash || null,
    pending_found_claim_id: r.pendingFoundClaimId || null
  };
}

function rowToSighting(row) {
  return {
    id: row.id,
    petType: row.pet_type,
    color: row.color,
    size: row.size,
    gender: row.gender,
    street: row.street,
    city: row.city,
    phone: row.phone,
    photo: row.photo,
    timestamp: row.timestamp,
    flagged: row.flagged
  };
}

function sightingToRow(s) {
  return {
    id: s.id,
    pet_type: s.petType,
    color: s.color,
    size: s.size,
    gender: s.gender,
    street: s.street,
    city: s.city,
    phone: s.phone,
    photo: s.photo || null,
    timestamp: s.timestamp,
    flagged: s.flagged
  };
}

function rowToClaim(row) {
  return {
    id: row.id,
    petType: row.pet_type,
    color: row.color,
    size: row.size,
    gender: row.gender,
    street: row.street,
    city: row.city,
    circumstances: row.circumstances,
    finderName: row.finder_name,
    finderPhone: row.finder_phone,
    finderEmail: row.finder_email,
    photo: row.photo,
    timestamp: row.timestamp,
    expiresAt: row.expires_at,
    status: row.status,
    matchedPetId: row.matched_pet_id
  };
}

function claimToRow(c) {
  return {
    id: c.id,
    pet_type: c.petType,
    color: c.color,
    size: c.size,
    gender: c.gender,
    street: c.street,
    city: c.city,
    circumstances: c.circumstances,
    finder_name: c.finderName,
    finder_phone: c.finderPhone,
    finder_email: c.finderEmail,
    photo: c.photo || null,
    timestamp: c.timestamp,
    expires_at: c.expiresAt,
    status: c.status,
    matched_pet_id: c.matchedPetId || null
  };
}

// ── DB helpers — lost_pets ────────────────────────────────────────────────────
async function getLostPetReports() {
  const { data, error } = await db.from('lost_pets').select('*');
  if (error) { console.error(error); return []; }
  return data.map(rowToReport);
}

async function getLostPetById(id) {
  const { data, error } = await db.from('lost_pets').select('*').eq('id', id).single();
  if (error) return null;
  return rowToReport(data);
}

async function insertLostPet(report) {
  const { error } = await db.from('lost_pets').insert(reportToRow(report));
  if (error) { alert('Error saving report. Please try again.'); console.error(error); }
}

async function updateLostPet(id, changes) {
  const { error } = await db.from('lost_pets').update(changes).eq('id', id);
  if (error) console.error(error);
}

async function deleteLostPet(id) {
  const { error } = await db.from('lost_pets').delete().eq('id', id);
  if (error) console.error(error);
}

// ── DB helpers — sightings ────────────────────────────────────────────────────
async function getSightingReports() {
  const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;
  const { data, error } = await db
    .from('sightings')
    .select('*')
    .eq('flagged', false)
    .gt('timestamp', cutoff);
  if (error) { console.error(error); return []; }
  return data.map(rowToSighting);
}

async function insertSighting(sighting) {
  const { error } = await db.from('sightings').insert(sightingToRow(sighting));
  if (error) { alert('Error saving sighting. Please try again.'); console.error(error); }
}

async function flagSighting(id) {
  const { error } = await db.from('sightings').update({ flagged: true }).eq('id', id);
  if (error) console.error(error);
}

// ── DB helpers — found_claims ─────────────────────────────────────────────────
async function getFoundClaims() {
  const { data, error } = await db.from('found_claims').select('*');
  if (error) { console.error(error); return []; }
  return data.map(rowToClaim);
}

async function getActiveFoundClaims() {
  const now = Date.now();
  const { data, error } = await db
    .from('found_claims')
    .select('*')
    .eq('status', 'pending')
    .gt('expires_at', now);
  if (error) { console.error(error); return []; }
  return data.map(rowToClaim);
}

async function insertFoundClaim(claim) {
  const { error } = await db.from('found_claims').insert(claimToRow(claim));
  if (error) { alert('Error saving claim. Please try again.'); console.error(error); }
}

async function updateFoundClaim(id, changes) {
  const { error } = await db.from('found_claims').update(changes).eq('id', id);
  if (error) console.error(error);
}

// ── Rate limit (client-side only) ─────────────────────────────────────────────
function checkClaimRateLimit() {
  const key = 'claimRateLimit';
  const windowMs = 60 * 60 * 1000;
  const max = 3;
  const now = Date.now();
  const recent = JSON.parse(localStorage.getItem(key) || '[]').filter(t => t > now - windowMs);
  if (recent.length >= max) return false;
  recent.push(now);
  localStorage.setItem(key, JSON.stringify(recent));
  return true;
}

// ── Photo reader ──────────────────────────────────────────────────────────────
function readPhoto(fileInput, callback) {
  const file = fileInput.files[0];
  if (!file) { callback(null, null); return; }
  if (file.size > 5 * 1024 * 1024) { callback(null, 'Photo must be under 5 MB'); return; }
  const reader = new FileReader();
  reader.onload = e => callback(e.target.result, null);
  reader.readAsDataURL(file);
}

// ── Expire old claims ─────────────────────────────────────────────────────────
async function expireOldClaims() {
  const now = Date.now();
  const { data, error } = await db
    .from('found_claims')
    .select('*')
    .eq('status', 'pending')
    .lte('expires_at', now);
  if (error || !data || data.length === 0) return;

  for (const row of data) {
    await updateFoundClaim(row.id, { status: 'expired' });
    if (row.matched_pet_id) {
      await updateLostPet(row.matched_pet_id, { status: 'active', pending_found_claim_id: null });
    }
  }
}

// ── Lost Pet Form ─────────────────────────────────────────────────────────────
document.getElementById('lost-pet-form-el').addEventListener('submit', async function (e) {
  e.preventDefault();

  const lpFields = ['lp-pet-type', 'lp-color', 'lp-size', 'lp-gender', 'lp-street', 'lp-city', 'lp-contact'];
  lpFields.forEach(f => clearError(f));
  clearError('lp-photo');

  const petType = document.getElementById('lp-pet-type').value;
  const color   = document.getElementById('lp-color').value.trim();
  const size    = document.getElementById('lp-size').value;
  const gender  = document.getElementById('lp-gender').value;
  const desc    = document.getElementById('lp-description').value.trim();
  const street  = document.getElementById('lp-street').value.trim();
  const city    = document.getElementById('lp-city').value.trim();
  const contact = document.getElementById('lp-contact').value.trim();

  let valid = true;
  if (!petType) { showError('lp-pet-type', 'This field is required'); valid = false; }
  if (!color)   { showError('lp-color',    'This field is required'); valid = false; }
  if (!size)    { showError('lp-size',     'This field is required'); valid = false; }
  if (!gender)  { showError('lp-gender',   'This field is required'); valid = false; }
  if (!street)  { showError('lp-street',   'This field is required'); valid = false; }
  if (!city)    { showError('lp-city',     'This field is required'); valid = false; }
  if (!contact) {
    showError('lp-contact', 'This field is required'); valid = false;
  } else if (!isValidContact(contact)) {
    showError('lp-contact', 'Please enter a valid phone number or email address'); valid = false;
  }
  if (!valid) return;

  readPhoto(document.getElementById('lp-photo'), async (photoData, err) => {
    if (err) { showError('lp-photo', err); return; }

    const isNew = !currentLostPetId;
    const id = currentLostPetId || generateId();

    let existing = null;
    let ownerCodeHash = null;
    let generatedCode = null;

    if (!isNew) {
      existing = await getLostPetById(id);
      ownerCodeHash = existing ? existing.ownerCodeHash : null;
    } else {
      generatedCode = generateOwnerCode();
      ownerCodeHash = hashOwnerCode(generatedCode);
    }

    const report = {
      id, petType, color, size, gender, desc, street, city, contact,
      photo: photoData || (existing ? existing.photo : null),
      timestamp: Date.now(),
      status: existing ? (existing.status || 'active') : 'active',
      ownerCodeHash,
      pendingFoundClaimId: existing ? existing.pendingFoundClaimId : null
    };

    if (isNew) {
      await insertLostPet(report);
    } else {
      await updateLostPet(id, reportToRow(report));
    }

    currentLostPetId = id;
    sessionStorage.setItem('currentLostPetId', id);

    const conf = document.getElementById('lost-pet-confirmation');
    conf.textContent = 'Your report was saved. We will show you sightings near your area.';
    conf.classList.remove('hidden');
    document.getElementById('lost-pet-controls').classList.remove('hidden');

    const fullReport = await getLostPetById(id);
    if (fullReport) allSightings = await getMatchingSightings(fullReport);
    renderResults();
    await renderMissingGallery();
    await renderSidebar();

    if (isNew && generatedCode) {
      showOwnerCodeModal(generatedCode);
    } else {
      setTimeout(() => showPage('sightings-results'), 1500);
    }
  });
});

// ── Edit / Delete / Found ─────────────────────────────────────────────────────
async function editLostPetReport() {
  if (!currentLostPetId) return;
  const report = await getLostPetById(currentLostPetId);
  if (!report) { alert('This report no longer exists.'); return; }

  document.getElementById('lp-pet-type').value    = report.petType;
  document.getElementById('lp-color').value        = report.color;
  document.getElementById('lp-size').value         = report.size;
  document.getElementById('lp-gender').value       = report.gender;
  document.getElementById('lp-description').value  = report.desc || '';
  document.getElementById('lp-street').value       = report.street;
  document.getElementById('lp-city').value         = report.city;
  document.getElementById('lp-contact').value      = report.contact;

  document.getElementById('lost-pet-confirmation').classList.add('hidden');
  showPage('lost-pet-form');
}

async function deleteLostPetReport() {
  if (!currentLostPetId) return;
  if (!confirm('Are you sure you want to delete your report?')) return;

  const claims = await getFoundClaims();
  for (const c of claims) {
    if (c.matchedPetId === currentLostPetId && c.status === 'pending') {
      await updateFoundClaim(c.id, { status: 'denied' });
    }
  }

  await deleteLostPet(currentLostPetId);
  clearOwnerSession();
  await renderMissingGallery();
  await renderSidebar();
  alert('Your report has been removed.');
  showPage('home');
}

function promptMarkAsFound(claimId) {
  if (!currentLostPetId) return;
  const modal = document.getElementById('confirm-found-modal');
  modal.dataset.claimId = claimId || '';
  document.getElementById('owner-code-input').value = '';
  document.getElementById('owner-code-error').textContent = '';
  modal.classList.remove('hidden');
  setTimeout(() => document.getElementById('owner-code-input').focus(), 50);
}

function closeConfirmFoundModal() {
  document.getElementById('confirm-found-modal').classList.add('hidden');
}

async function confirmPetFoundWithCode() {
  const modal = document.getElementById('confirm-found-modal');
  const claimId = modal.dataset.claimId || null;
  const enteredCode = document.getElementById('owner-code-input').value.trim().toUpperCase().replace(/\s/g, '');
  const errEl = document.getElementById('owner-code-error');

  const report = await getLostPetById(currentLostPetId);
  if (!report) { errEl.textContent = 'Report not found. It may have already been removed.'; return; }

  if (report.ownerCodeHash) {
    if (!enteredCode) { errEl.textContent = 'Please enter your owner code.'; return; }
    if (hashOwnerCode(enteredCode) !== report.ownerCodeHash) {
      errEl.textContent = 'Incorrect owner code. Please check and try again.';
      return;
    }
  }

  if (claimId) await updateFoundClaim(claimId, { status: 'confirmed' });
  await updateLostPet(currentLostPetId, { status: 'confirmed_found', pending_found_claim_id: null });

  closeConfirmFoundModal();
  clearOwnerSession();
  await renderMissingGallery();
  await renderSidebar();
  showPage('home');
  alert('Wonderful! We\'re so glad your pet is home safe.');
}

async function denyFoundClaim(claimId, petId) {
  if (!confirm('Deny this claim? Your listing will stay active.')) return;

  await updateFoundClaim(claimId, { status: 'denied' });
  await updateLostPet(petId, { status: 'active', pending_found_claim_id: null });

  await renderOwnerBar();
  await renderMissingGallery();
  await renderSidebar();
}

function showOwnerCodeModal(code) {
  document.getElementById('owner-code-display').textContent = code;
  document.getElementById('owner-code-modal').classList.remove('hidden');
}

function closeOwnerCodeModal() {
  document.getElementById('owner-code-modal').classList.add('hidden');
  showPage('sightings-results');
}

function clearOwnerSession() {
  currentLostPetId = null;
  sessionStorage.removeItem('currentLostPetId');
  document.getElementById('lost-pet-form-el').reset();
  document.getElementById('lost-pet-confirmation').classList.add('hidden');
  document.getElementById('lost-pet-controls').classList.add('hidden');
}

// ── Sighting Form ─────────────────────────────────────────────────────────────
document.getElementById('sighting-form-el').addEventListener('submit', async function (e) {
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

  readPhoto(document.getElementById('s-photo'), async (photoData, err) => {
    if (err) { showError('s-photo', err); return; }

    const sighting = {
      id: generateId(),
      petType, color, size, gender,
      street, city, phone,
      photo: photoData,
      timestamp: Date.now(),
      flagged: false
    };

    await insertSighting(sighting);

    const matches = await findMatchingLostPets(sighting);
    const conf = document.getElementById('sighting-confirmation');
    conf.textContent = matches.length > 0
      ? 'Your sighting may match a lost pet! The owner can now see your report.'
      : 'No matches yet, but your report was saved. The owner will be able to see it.';
    conf.classList.remove('hidden');

    document.getElementById('sighting-form-el').reset();
    await renderSidebar();
  });
});

// ── Matching logic ────────────────────────────────────────────────────────────
function genderMatches(a, b) {
  return a === b || a === 'unknown' || b === 'unknown';
}

async function getMatchingSightings(report) {
  const sightings = await getSightingReports();
  return sightings
    .filter(s =>
      s.petType === report.petType &&
      s.color.toLowerCase() === report.color.toLowerCase() &&
      s.size === report.size &&
      genderMatches(s.gender, report.gender) &&
      s.city.toLowerCase() === report.city.toLowerCase()
    )
    .sort((a, b) => b.timestamp - a.timestamp);
}

async function findMatchingLostPets(sighting) {
  const reports = await getLostPetReports();
  return reports.filter(r =>
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
    if (colorF  && !s.color.toLowerCase().includes(colorF))  return false;
    if (sizeF   && s.size !== sizeF)                         return false;
    if (genderF && s.gender !== genderF)                     return false;
    if (nhoodF  && !s.street.toLowerCase().includes(nhoodF)) return false;
    return true;
  });

  renderCards(filtered.slice(0, 20));
}

function clearFilters() {
  document.getElementById('f-color').value        = '';
  document.getElementById('f-size').value         = '';
  document.getElementById('f-gender').value       = '';
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
        <button class="btn btn-ghost" onclick="showContact('${s.id}')">Show contact</button>
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

async function reportSpam(id) {
  await flagSighting(id);
  allSightings = allSightings.filter(s => s.id !== id);
  applyFilters();
  alert('Thank you. This sighting has been flagged for review.');
}

// ── Found Pet Form ────────────────────────────────────────────────────────────
document.getElementById('found-pet-form-el').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fields = ['fp-pet-type', 'fp-color', 'fp-size', 'fp-gender', 'fp-street', 'fp-city', 'fp-circumstances', 'fp-name', 'fp-phone', 'fp-email'];
  fields.forEach(f => clearError(f));
  clearError('fp-photo');

  const petType       = document.getElementById('fp-pet-type').value;
  const color         = document.getElementById('fp-color').value.trim();
  const size          = document.getElementById('fp-size').value;
  const gender        = document.getElementById('fp-gender').value;
  const street        = document.getElementById('fp-street').value.trim();
  const city          = document.getElementById('fp-city').value.trim();
  const circumstances = document.getElementById('fp-circumstances').value.trim();
  const finderName    = document.getElementById('fp-name').value.trim();
  const finderPhone   = document.getElementById('fp-phone').value.trim();
  const finderEmail   = document.getElementById('fp-email').value.trim();

  let valid = true;
  if (!petType)        { showError('fp-pet-type',     'This field is required'); valid = false; }
  if (!color)          { showError('fp-color',         'This field is required'); valid = false; }
  if (!size)           { showError('fp-size',          'This field is required'); valid = false; }
  if (!gender)         { showError('fp-gender',        'This field is required'); valid = false; }
  if (!street)         { showError('fp-street',        'This field is required'); valid = false; }
  if (!city)           { showError('fp-city',          'This field is required'); valid = false; }
  if (!circumstances) {
    showError('fp-circumstances', 'This field is required'); valid = false;
  } else if (circumstances.length < 30) {
    showError('fp-circumstances', 'Please provide at least 30 characters of detail'); valid = false;
  }
  if (!finderName)     { showError('fp-name',  'This field is required'); valid = false; }
  if (!finderPhone) {
    showError('fp-phone', 'This field is required'); valid = false;
  } else if (!isValidPhone(finderPhone)) {
    showError('fp-phone', 'Please enter a valid phone number'); valid = false;
  }
  if (!finderEmail) {
    showError('fp-email', 'This field is required'); valid = false;
  } else if (!isValidEmail(finderEmail)) {
    showError('fp-email', 'Please enter a valid email address'); valid = false;
  }
  if (!valid) return;

  if (!checkClaimRateLimit()) {
    alert('Too many found reports submitted recently. Please wait an hour and try again.');
    return;
  }

  readPhoto(document.getElementById('fp-photo'), async (photoData, err) => {
    if (err) { showError('fp-photo', err); return; }

    const now = Date.now();
    const claim = {
      id: generateId(),
      petType, color, size, gender,
      street, city, circumstances,
      finderName, finderPhone, finderEmail,
      photo: photoData,
      timestamp: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000,
      status: 'pending',
      matchedPetId: null
    };

    const allReports = await getLostPetReports();
    const availableMatch = allReports.find(r =>
      r.petType === petType &&
      r.color.toLowerCase() === color.toLowerCase() &&
      r.size === size &&
      genderMatches(r.gender, gender) &&
      r.city.toLowerCase() === city.toLowerCase() &&
      (r.status || 'active') === 'active' &&
      !r.pendingFoundClaimId
    );

    if (availableMatch) {
      claim.matchedPetId = availableMatch.id;
      await updateLostPet(availableMatch.id, { status: 'possibly_found', pending_found_claim_id: claim.id });
    }

    await insertFoundClaim(claim);

    const conf = document.getElementById('found-pet-confirmation');
    conf.textContent = availableMatch
      ? 'Your report was sent to the owner! They will contact you if it\'s a match.'
      : 'Your report was saved. We\'ll match it if a listing is posted that fits the description.';
    conf.classList.remove('hidden');

    document.getElementById('found-pet-form-el').reset();
    await renderMissingGallery();
    await renderSidebar();
  });
});

// ── Owner bar ─────────────────────────────────────────────────────────────────
async function renderOwnerBar() {
  const ownerBar = document.getElementById('owner-found-bar');
  if (!ownerBar) return;

  if (!currentLostPetId) { ownerBar.classList.add('hidden'); return; }

  const report = await getLostPetById(currentLostPetId);
  if (!report) { ownerBar.classList.add('hidden'); return; }

  ownerBar.classList.remove('hidden');

  const claimBanner = document.getElementById('found-claim-banner');
  if (!report.pendingFoundClaimId) { claimBanner.classList.add('hidden'); return; }

  const { data } = await db
    .from('found_claims')
    .select('*')
    .eq('id', report.pendingFoundClaimId)
    .eq('status', 'pending')
    .single();

  if (!data) { claimBanner.classList.add('hidden'); return; }
  const claim = rowToClaim(data);

  claimBanner.classList.remove('hidden');
  document.getElementById('claim-finder-name').textContent = claim.finderName;
  document.getElementById('claim-finder-contact').textContent =
    claim.finderPhone + (claim.finderEmail ? ' | ' + claim.finderEmail : '');
  document.getElementById('claim-location').textContent    = claim.street + ', ' + claim.city;
  document.getElementById('claim-circumstances').textContent = claim.circumstances;
  document.getElementById('claim-time-ago').textContent    = timeAgo(claim.timestamp);

  const claimPhoto = document.getElementById('claim-photo');
  if (claim.photo) { claimPhoto.src = claim.photo; claimPhoto.classList.remove('hidden'); }
  else { claimPhoto.classList.add('hidden'); }

  document.getElementById('btn-confirm-found').onclick = () => promptMarkAsFound(claim.id);
  document.getElementById('btn-deny-claim').onclick    = () => denyFoundClaim(claim.id, report.id);
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

async function renderSidebar() {
  const [allReports, sightings, found] = await Promise.all([
    getLostPetReports(),
    getSightingReports(),
    getActiveFoundClaims()
  ]);

  const lost = allReports.filter(r => (r.status || 'active') !== 'confirmed_found');
  const today = Date.now() - 24 * 60 * 60 * 1000;
  const todayCount = sightings.filter(s => s.timestamp > today).length;

  const sbMissing = document.getElementById('sb-missing');
  const sbToday   = document.getElementById('sb-today');
  const sbActive  = document.getElementById('sb-active');
  if (sbMissing) sbMissing.textContent = lost.length;
  if (sbToday)   sbToday.textContent   = todayCount;
  if (sbActive)  sbActive.textContent  = sightings.length;

  const all = [
    ...lost.map(r => {
      const label = (r.status || 'active') === 'possibly_found'
        ? `🕵️ ${capitalize(r.color)} ${capitalize(r.petType)} — possibly found`
        : `🐾 ${capitalize(r.color)} ${capitalize(r.petType)} reported missing`;
      return { label, time: r.timestamp };
    }),
    ...sightings.map(s => ({ label: `👀 ${capitalize(s.color)} ${capitalize(s.petType)} spotted on ${escapeHtml(s.street)}`, time: s.timestamp })),
    ...found.map(c => ({ label: `🎉 ${capitalize(c.color)} ${capitalize(c.petType)} found on ${escapeHtml(c.street)}`, time: c.timestamp })),
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

  const tipEl = document.getElementById('sb-tip');
  if (tipEl) tipEl.textContent = TIPS[currentTip];
}

function nextTip() {
  currentTip = (currentTip + 1) % TIPS.length;
  const tipEl = document.getElementById('sb-tip');
  if (tipEl) tipEl.textContent = TIPS[currentTip];
}

function timeAgo(timestamp) {
  const diff  = Date.now() - timestamp;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return mins + ' min ago';
  if (hours < 24) return hours + ' hr ago';
  return days + ' day' + (days === 1 ? '' : 's') + ' ago';
}

// ── Facts toggle ──────────────────────────────────────────────────────────────
function toggleFacts() {
  const content = document.getElementById('facts-content');
  const btn = document.getElementById('facts-toggle');
  const isNowHidden = content.classList.toggle('hidden');
  btn.textContent = isNowHidden ? 'Show facts ▼' : 'Hide facts ▲';
}

// ── Missing pet gallery ───────────────────────────────────────────────────────
const PET_EMOJI = { dog: '🐕', cat: '🐈', bird: '🐦', rabbit: '🐇', other: '🐾' };

async function renderMissingGallery() {
  const gallery = document.getElementById('missing-gallery');
  const badge   = document.getElementById('missing-count');
  if (!gallery) return;

  const allReports    = await getLostPetReports();
  const activeReports = allReports.filter(r => (r.status || 'active') !== 'confirmed_found');

  badge.textContent  = activeReports.length || '';
  badge.style.display = activeReports.length ? 'inline' : 'none';

  if (activeReports.length === 0) {
    gallery.innerHTML = '<div class="gallery-empty">No pets reported missing yet.<br>Be the first to use Lost Pet Finder!</div>';
    return;
  }

  filterGallery(activeReports);
}

function filterGallery(preloaded) {
  const gallery = document.getElementById('missing-gallery');
  if (!gallery) return;

  const colorQ = (document.getElementById('gs-color')?.value || '').trim().toLowerCase();
  const cityQ  = (document.getElementById('gs-city')?.value  || '').trim().toLowerCase();

  const render = (reports) => {
    const filtered = reports
      .filter(r => (r.status || 'active') !== 'confirmed_found')
      .slice(-12).reverse()
      .filter(r => {
        if (colorQ && !r.color.toLowerCase().includes(colorQ)) return false;
        if (cityQ  && !r.city.toLowerCase().includes(cityQ))   return false;
        return true;
      });

    if (filtered.length === 0) {
      gallery.innerHTML = '<div class="gallery-empty">No pets match your search.</div>';
      return;
    }

    gallery.innerHTML = filtered.map(r => {
      const imageHtml = r.photo
        ? `<img class="pet-tile-image" src="${r.photo}" alt="Photo of ${escapeHtml(r.color)} ${escapeHtml(r.petType)}" />`
        : `<div class="pet-tile-emoji">${PET_EMOJI[r.petType] || '🐾'}</div>`;

      const statusBadge = (r.status || 'active') === 'possibly_found'
        ? `<div class="status-badge badge-possibly-found">Possibly Found</div>`
        : `<div class="status-badge badge-active">Missing</div>`;

      return `
        <div class="pet-tile" onclick="showPage('sightings-results')" title="Click to view sightings">
          <div class="pet-tile-img-wrap">
            ${imageHtml}
            ${statusBadge}
          </div>
          <div class="pet-tile-info">
            <div class="pet-tile-name">${capitalize(r.color)} ${capitalize(r.petType)}</div>
            <div class="pet-tile-detail">${escapeHtml(r.city)}</div>
          </div>
        </div>
      `;
    }).join('');
  };

  if (preloaded) {
    render(preloaded);
  } else {
    getLostPetReports().then(render);
  }
}

// ── Accessibility ─────────────────────────────────────────────────────────────
function toggleLargeText() {
  document.body.classList.toggle('large-text');
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
}

// ── Init ──────────────────────────────────────────────────────────────────────
(async () => {
  await expireOldClaims();
  await renderMissingGallery();
  await renderSidebar();

  if (currentLostPetId) {
    const report = await getLostPetById(currentLostPetId);
    if (report) {
      document.getElementById('lost-pet-controls').classList.remove('hidden');
      allSightings = await getMatchingSightings(report);
      renderResults();
    } else {
      currentLostPetId = null;
      sessionStorage.removeItem('currentLostPetId');
    }
  }
})();
