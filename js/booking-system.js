// 🚀 NeighbourHub - Smart Booking System
// API Configuration
const API_BASE_URL = 'http://localhost:8000';
const USER_STORAGE_KEY = 'neighbourhub_user';

// ==================== QUICK BOOKING FUNCTION ====================
// Direct booking without form - straight to payment
function quickBooking(amount, service, providerName) {
  const user = getCurrentUser();
  
  if (!user) {
    showAuthModal();
    return;
  }
  
  // Direct show payment options
  showQuickPaymentOptions(amount, service, providerName);
}

function showQuickPaymentOptions(amount, service, providerName) {
  const transactionId = `TXN${Date.now()}`;
  const bookingId = `BK${Date.now()}`;
  
  const modal = `
    <div class="modal-header">
      <div class="modal-title">💳 Complete Payment</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="padding: 2rem; text-align: center;">
      <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.9rem; color: #4A3728; margin-bottom: 0.5rem;">Service Booking</div>
        <div style="font-weight: 600; margin-bottom: 0.75rem;">${service}</div>
        <div style="font-size: 0.85rem; color: #8B7355; margin-bottom: 0.75rem;">Provider: ${providerName}</div>
        <div style="font-size: 2.5rem; font-weight: 700; color: #D4722A;">₹${amount}</div>
      </div>

      <h3 style="color: #1A1208; margin-bottom: 1.5rem;">Select Payment Method:</h3>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <!-- QR CODE OPTION -->
        <div style="border: 2px solid #E8E0D4; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: all 0.2s;" onclick="showQuickQRPayment(${amount}, '${transactionId}', '${service}')" onmouseover="this.style.borderColor='#D4722A'; this.style.boxShadow='0 4px 12px rgba(212,114,42,0.1)'" onmouseout="this.style.borderColor='#E8E0D4'; this.style.boxShadow='none'">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📲</div>
          <div style="font-weight: 600; color: #1A1208; margin-bottom: 0.25rem;">Scan QR Code</div>
          <div style="font-size: 0.85rem; color: #8B7355;">Use any UPI app</div>
          <button style="width: 100%; padding: 0.75rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 0.75rem;" onclick="showQuickQRPayment(${amount}, '${transactionId}', '${service}')">Generate QR 📲</button>
        </div>

        <!-- UPI DIRECT OPTION -->
        <div style="border: 2px solid #E8E0D4; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: all 0.2s;" onclick="showQuickUPIPayment(${amount}, '${transactionId}', '${service}')" onmouseover="this.style.borderColor='#D4722A'; this.style.boxShadow='0 4px 12px rgba(212,114,42,0.1)'" onmouseout="this.style.borderColor='#E8E0D4'; this.style.boxShadow='none'">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">💳</div>
          <div style="font-weight: 600; color: #1A1208; margin-bottom: 0.25rem;">UPI ID Payment</div>
          <div style="font-size: 0.85rem; color: #8B7355;">Enter UPI ID</div>
          <button style="width: 100%; padding: 0.75rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 0.75rem;" onclick="showQuickUPIPayment(${amount}, '${transactionId}', '${service}')">Pay via UPI 💳</button>
        </div>
      </div>

      <button style="width: 100%; padding: 0.75rem; border: 1.5px solid #E8E0D4; background: white; color: #4A3728; border-radius: 8px; cursor: pointer; font-weight: 600;" onclick="closeModal()">Cancel</button>
    </div>
  `;
  
  document.getElementById('modalBox').innerHTML = modal;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function showQuickQRPayment(amount, transactionId, service) {
  const qrModal = `
    <div class="modal-header">
      <div class="modal-title">📲 Scan QR Code to Pay</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="padding: 2rem; text-align: center;">
      <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.9rem; color: #4A3728; margin-bottom: 0.5rem;">Amount</div>
        <div style="font-size: 2rem; font-weight: 700; color: #D4722A;">₹${amount}</div>
      </div>

      <h4 style="color: #1A1208; margin-bottom: 1rem;">🔲 Scan with any UPI app:</h4>
      
      <div style="background: white; border: 2px solid #E8E0D4; border-radius: 12px; padding: 1.5rem; display: inline-block; margin-bottom: 1.5rem;">
        <div id="qrCodeDisplay" style="width: 250px; height: 250px;"></div>
      </div>

      <div style="background: #fffbf0; border: 1px solid #D4722A; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; color: #8B7355; margin-bottom: 0.5rem;">📍 Service: ${service}</div>
        <div style="font-size: 0.85rem; color: #8B7355;">Transaction ID: ${transactionId}</div>
      </div>

      <button style="width: 100%; padding: 0.75rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 0.5rem;" onclick="completeQuickPayment('${transactionId}', ${amount}, '${service}', 'QR')">✅ Payment Complete</button>
      <button style="width: 100%; padding: 0.75rem; border: 1.5px solid #E8E0D4; background: white; color: #4A3728; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="closeModal()">Cancel</button>
    </div>
  `;
  
  document.getElementById('modalBox').innerHTML = qrModal;
  
  // Generate QR code
  if (typeof QRCode !== 'undefined') {
    setTimeout(() => {
      const qrElement = document.getElementById('qrCodeDisplay');
      qrElement.innerHTML = '';
      new QRCode(qrElement, {
        text: `upi://pay?pa=neighbourhub@upi&pn=NeighbourHub&tr=${transactionId}&am=${amount}`,
        width: 250,
        height: 250
      });
    }, 100);
  }
}

function showQuickUPIPayment(amount, transactionId, service) {
  const upiModal = `
    <div class="modal-header">
      <div class="modal-title">💳 UPI Payment</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="padding: 2rem;">
      <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.9rem; color: #4A3728; margin-bottom: 0.5rem;">Amount to Pay</div>
        <div style="font-size: 2rem; font-weight: 700; color: #D4722A;">₹${amount}</div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #1A1208;">Enter UPI ID:</label>
        <input type="text" id="quickUpiId" placeholder="example@upi" style="width: 100%; padding: 0.75rem; border: 1.5px solid #E8E0D4; border-radius: 6px; font-size: 1rem;" />
      </div>

      <button style="width: 100%; padding: 0.75rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 0.5rem;" onclick="completeQuickUPIPayment('${transactionId}', ${amount}, '${service}')">Pay ₹${amount}</button>
      <button style="width: 100%; padding: 0.75rem; border: 1.5px solid #E8E0D4; background: white; color: #4A3728; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="closeModal()">Cancel</button>
    </div>
  `;
  
  document.getElementById('modalBox').innerHTML = upiModal;
}

async function completeQuickPayment(transactionId, amount, service, method) {
  try {
    const user = getCurrentUser();
    
    // Show success modal
    const successModal = `
      <div class="modal-header">
        <div class="modal-title">✅ Payment Successful!</div>
      </div>
      <div style="padding: 2rem; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">✨</div>
        
        <div style="background: #f0fff4; border: 2px solid #52c41a; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="font-weight: 600; color: #1A1208; margin-bottom: 0.5rem;">Payment Confirmed</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #D4722A; margin-bottom: 0.5rem;">₹${amount}</div>
          <div style="font-size: 0.85rem; color: #4A3728;">via ${method}</div>
        </div>

        <div style="background: #f9f9f9; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; text-align: left;">
          <div style="margin-bottom: 0.75rem;">
            <div style="font-size: 0.8rem; color: #4A3728; margin-bottom: 0.3rem;">Service</div>
            <div style="font-weight: 600; color: #1A1208;">${service}</div>
          </div>
          <div style="margin-bottom: 0.75rem;">
            <div style="font-size: 0.8rem; color: #4A3728; margin-bottom: 0.3rem;">Transaction ID</div>
            <div style="font-family: monospace; font-weight: 600; color: #1A1208;">${transactionId}</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: #4A3728; margin-bottom: 0.3rem;">Status</div>
            <div style="color: #52c41a; font-weight: 600;">✅ Completed</div>
          </div>
        </div>

        <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
          <div style="font-weight: 600; color: #1A1208; margin-bottom: 0.5rem;">Booking Confirmed! 🎉</div>
          <div style="font-size: 0.9rem; color: #4A3728;">Your service booking has been confirmed. A provider will contact you shortly.</div>
        </div>

        <button style="width: 100%; padding: 0.75rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 0.5rem;" onclick="location.reload()">Done</button>
      </div>
    `;
    
    document.getElementById('modalBox').innerHTML = successModal;
    
  } catch (error) {
    showError('Payment processing failed: ' + error.message);
  }
}

function completeQuickUPIPayment(transactionId, amount, service) {
  const upiId = document.getElementById('quickUpiId').value;
  
  if (!upiId) {
    showError('❌ Please enter UPI ID');
    return;
  }
  
  if (!upiId.includes('@')) {
    showError('❌ Invalid UPI ID format');
    return;
  }
  
  completeQuickPayment(transactionId, amount, service, `UPI - ${upiId}`);
}

// ==================== AUTH SYSTEM ====================

// Check if user logged in
function isUserLoggedIn() {
  return localStorage.getItem(USER_STORAGE_KEY) !== null;
}

// Get current user
function getCurrentUser() {
  const user = localStorage.getItem(USER_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
}

// Save user
function saveUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

// Logout
function logoutUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
  window.location.reload();
}

// ==================== SIGNUP ====================
async function handleSignup(e) {
  e?.preventDefault();
  
  const firstName = document.getElementById('signup-firstName')?.value;
  const lastName = document.getElementById('signup-lastName')?.value;
  const email = document.getElementById('signup-email')?.value;
  const password = document.getElementById('signup-password')?.value;
  const confirmPassword = document.getElementById('signup-confirm')?.value;
  
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showError('❌ Please fill all fields');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('❌ Passwords do not match');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showSuccess('✅ Account created! Login now');
      document.getElementById('signup-form').reset();
      setTimeout(() => document.querySelector('[data-tab="login"]')?.click(), 1500);
    } else {
      showError(data.message || 'Signup failed');
    }
  } catch (error) {
    console.error('Signup error:', error);
    showError('Connection error - Check console. Make sure backend is running on port 8000');
  }
}

// ==================== LOGIN ====================
async function handleLogin(e) {
  e?.preventDefault();
  
  const email = document.getElementById('login-email')?.value;
  const password = document.getElementById('login-password')?.value;
  
  if (!email || !password) {
    showError('❌ Email and password required');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      saveUser(data.user);
      showSuccess(`✅ Welcome ${data.user.firstName}!`);
      updateUI();
      document.getElementById('login-form').reset();
      setTimeout(() => { closeModal(); location.reload(); }, 1500);
    } else {
      showError('❌ Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Connection error - Check console. Make sure backend is running on port 8000');
  }
}

// ==================== UI UPDATE ====================
function updateUI() {
  const user = getCurrentUser();
  const navCTA = document.querySelector('.nav-cta');
  
  if (user && navCTA) {
    navCTA.innerHTML = `
      <div class="user-profile" onclick="toggleMenu()">
        <div class="user-avatar">${user.firstName?.[0]?.toUpperCase()}</div>
        <div class="user-info">
          <div style="font-weight: 600;">${user.firstName} ${user.lastName}</div>
          <div style="font-size: 0.75rem; color: #8B7355;">${user.email}</div>
        </div>
      </div>
      <div id="userMenu" style="display: none; position: absolute; top: 70px; right: 20px; background: white; border: 1px solid #E8E0D4; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 1000;">
        <div style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #E8E0D4;" onclick="showMyBookings()">📅 My Bookings</div>
        <div style="padding: 0.75rem 1rem; cursor: pointer;" onclick="logoutUser()">🚪 Logout</div>
      </div>
    `;
  }
}

function toggleMenu() {
  const menu = document.getElementById('userMenu');
  if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Get user's current location
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        }
      );
    } else {
      reject(new Error('Geolocation not supported'));
    }
  });
}

// Initialize map
async function initializeMap(lat, lng, containerId = 'map') {
  if (typeof google === 'undefined') {
    console.error('Google Maps API not loaded');
    return null;
  }

  const map = new google.maps.Map(document.getElementById(containerId), {
    zoom: 15,
    center: { lat, lng },
    styles: [{ featureType: 'all', elementType: 'geometry.fill', stylers: [{ color: '#F5F0E8' }] }]
  });

  new google.maps.Marker({
    position: { lat, lng },
    map: map,
    title: 'Your Location',
    animation: google.maps.Animation.DROP
  });

  return map;
}

// Get address from coordinates
async function getAddressFromCoordinates(lat, lng) {
  if (typeof google === 'undefined') return null;
  
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject('Unable to get address');
      }
    });
  });
}

// Setup autocomplete
function setupAddressAutocomplete(inputId) {
  if (typeof google === 'undefined') return;

  const input = document.getElementById(inputId);
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['address'],
    fields: ['address_components', 'geometry', 'formatted_address']
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      return {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
    }
  });

  return autocomplete;
}

// Services database with pricing
const SERVICES = [
  {
    id: 1,
    name: 'Plumbing',
    emoji: '🔧',
    description: 'Repairs, maintenance, and installations',
    icon: '💧',
    options: [
      { id: 1, name: 'Pipe Repair', price: 25, time: '30 min' },
      { id: 2, name: 'Drain Cleaning', price: 35, time: '45 min' },
      { id: 3, name: 'Tap Installation', price: 40, time: '1 hour' },
      { id: 4, name: 'Emergency Service', price: 50, time: 'ASAP' }
    ]
  },
  {
    id: 2,
    name: 'Electrical',
    emoji: '⚡',
    description: 'Wiring, repairs, and installations',
    icon: '💡',
    options: [
      { id: 5, name: 'Switch/Socket Installation', price: 20, time: '30 min' },
      { id: 6, name: 'Light Fitting', price: 30, time: '45 min' },
      { id: 7, name: 'Rewiring', price: 60, time: '2-3 hours' },
      { id: 8, name: 'Fuse Box Repair', price: 45, time: '1 hour' }
    ]
  },
  {
    id: 3,
    name: 'Cleaning',
    emoji: '🧹',
    description: 'Home and office cleaning',
    icon: '🧽',
    options: [
      { id: 9, name: 'Basic Cleaning', price: 30, time: '1 hour' },
      { id: 10, name: 'Deep Cleaning', price: 60, time: '2-3 hours' },
      { id: 11, name: 'Carpet Cleaning', price: 50, time: '1.5 hours' },
      { id: 12, name: 'Move-in/out Cleaning', price: 80, time: '3-4 hours' }
    ]
  },
  {
    id: 4,
    name: 'Tutoring',
    emoji: '📚',
    description: 'Academic help and skill training',
    icon: '✏️',
    options: [
      { id: 13, name: 'Math Tutoring', price: 25, time: '1 hour' },
      { id: 14, name: 'English Tutoring', price: 25, time: '1 hour' },
      { id: 15, name: 'Science Tutoring', price: 30, time: '1 hour' },
      { id: 16, name: 'Programming Lessons', price: 40, time: '1 hour' }
    ]
  },
  {
    id: 5,
    name: 'Delivery',
    emoji: '🚚',
    description: 'Fast and reliable delivery',
    icon: '📦',
    options: [
      { id: 17, name: 'Local Delivery', price: 10, time: '1-2 hours' },
      { id: 18, name: 'Express Delivery', price: 20, time: '30 min' },
      { id: 19, name: 'Same Day', price: 15, time: '2-4 hours' },
      { id: 20, name: 'Heavy Item Delivery', price: 30, time: '1-2 hours' }
    ]
  }
];

// Generate services grid
function generateServicesGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">';
  
  SERVICES.forEach(service => {
    html += `
      <div style="
        background: white;
        border: 1.5px solid #E8E0D4;
        border-radius: 12px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;\
      " onclick="selectService(${service.id})">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${service.emoji}</div>
        <div style="font-weight: 600; font-size: 1rem; margin-bottom: 0.3rem;">${service.name}</div>
        <div style="font-size: 0.85rem; color: #4A3728; margin-bottom: 0.5rem;">${service.description}</div>
        <div style="color: #D4722A; font-weight: 600;">From $${Math.min(...service.options.map(o => o.price))}</div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// Select service and show options
function selectService(serviceId) {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) return;

  let html = `
    <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <h3 style="margin-bottom: 0.5rem;">${service.emoji} ${service.name}</h3>
      <p style="font-size: 0.9rem; color: #4A3728;">${service.description}</p>
    </div>
    <div style="margin-bottom: 1.5rem;">
      <h4 style="margin-bottom: 1rem;">Select Service Option:</h4>
      <div style="display: grid; gap: 0.75rem;">
  `;

  service.options.forEach(option => {
    html += `
      <div style="
        border: 1.5px solid #E8E0D4;
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        justify-content: space-between;
        align-items: center;
      " onclick="selectServiceOption(${service.id}, ${option.id}, '${option.name}', ${option.price})">
        <div>
          <div style="font-weight: 600;">${option.name}</div>
          <div style="font-size: 0.85rem; color: #4A3728;">⏱️ ${option.time}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 600; color: #D4722A; font-size: 1.1rem;">$${option.price}</div>
        </div>
      </div>
    `;
  });

  html += `</div></div>`;
  
  document.getElementById('serviceOptions').innerHTML = html;
  document.getElementById('serviceOptions').scrollIntoView({ behavior: 'smooth' });
}

// Select specific service option
function selectServiceOption(serviceId, optionId, optionName, price) {
  const service = SERVICES.find(s => s.id === serviceId);
  
  // Store selected service
  window.selectedService = {
    serviceId,
    serviceName: service.name,
    optionId,
    optionName,
    price
  };

  showToast(`✅ Selected: ${service.name} - ${optionName} ($${price})`);
  
  // Show booking form
  setTimeout(() => {
    document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
  }, 500);
}

// Format current date and time
function getFormattedDateTime() {
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  return minDate;
}

// Generate UPI string
function generateUPIString(payeeUPI, payeeName, amount, transactionId) {
  return `upi://pay?pa=${payeeUPI}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=NeighbourHub%20Booking%20%23${transactionId}&tr=${transactionId}`;
}

// Generate QR Code
function generateQRCode(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Using a simple QR code library (qrcode.min.js)
  if (typeof QRCode !== 'undefined') {
    container.innerHTML = '';
    new QRCode(container, {
      text: data,
      width: 200,
      height: 200,
      colorDark: '#1A1208',
      colorLight: '#FDFAF4'
    });
  } else {
    container.innerHTML = '<p style="text-align: center; color: #D4722A;">QR Code loading...</p>';
  }
}

// Process payment
async function processPayment(amount, method) {
  const transactionId = 'TXN' + Date.now();
  
  if (method === 'upi') {
    return showUPIPaymentModal(amount, transactionId);
  } else if (method === 'card') {
    return showCardPaymentModal(amount, transactionId);
  } else if (method === 'wallet') {
    return showWalletPaymentModal(amount, transactionId);
  }
}

// Show UPI Payment Modal
function showUPIPaymentModal(amount, transactionId) {
  const upiModal = `
    <div class="modal-header">
      <div class="modal-title">💳 UPI Payment</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="padding: 1.5rem;">
      <div style="background: #f0f8ff; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; text-align: center;">
        <div style="font-size: 0.9rem; color: #4A3728; margin-bottom: 0.5rem;">Total Amount</div>
        <div style="font-size: 2rem; font-weight: 700; color: #D4722A;">$${amount}</div>
        <div style="font-size: 0.8rem; color: #4A3728; margin-top: 0.5rem;">Transaction ID: ${transactionId}</div>
      </div>

      <h4 style="margin-bottom: 1rem; color: #1A1208;">Select Your UPI App:</h4>
      <div style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
        <button style="padding: 1rem; border: 1.5px solid #E8E0D4; background: white; border-radius: 8px; cursor: pointer; font-weight: 600;" onclick="openUPIApp('googlepay', ${amount}, '${transactionId}')">
          🔵 Google Pay
        </button>
        <button style="padding: 1rem; border: 1.5px solid #E8E0D4; background: white; border-radius: 8px; cursor: pointer; font-weight: 600;" onclick="openUPIApp('paytm', ${amount}, '${transactionId}')">
          🔴 Paytm
        </button>
        <button style="padding: 1rem; border: 1.5px solid #E8E0D4; background: white; border-radius: 8px; cursor: pointer; font-weight: 600;" onclick="openUPIApp('phonepe', ${amount}, '${transactionId}')">
          🟣 PhonePe
        </button>
      </div>

      <h4 style="margin-bottom: 1rem; color: #1A1208;">Or Enter UPI ID:</h4>
      <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="position: relative;">
          <input type="text" id="upiId" placeholder="username@bankname" style="width: 100%; padding: 0.75rem; border: 1.5px solid #E8E0D4; border-radius: 8px; font-family: monospace;" />
        </div>
        <button class="form-submit" onclick="submitUPIPayment(${amount}, '${transactionId}')">Pay with UPI</button>
      </div>

      <h4 style="margin-bottom: 1rem; color: #1A1208;">Or Scan QR Code:</h4>
      <div id="qrCodeContainer" style="text-align: center; padding: 1rem; background: #f9f9f9; border-radius: 8px; margin-bottom: 1.5rem;"></div>
      
      <button style="width: 100%; padding: 0.75rem; border: 1.5px solid #D4722A; background: white; color: #D4722A; border-radius: 8px; cursor: pointer; font-weight: 600;" onclick="closeModal()">
        Cancel
      </button>
    </div>
  `;

  document.getElementById('modalBox').innerHTML = upiModal;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';

  // Generate QR Code
  setTimeout(() => {
    const upiString = generateUPIString('neighbourhub@upi', 'NeighbourHub', amount, transactionId);
    generateQRCode('qrCodeContainer', upiString);
  }, 100);
}

// Open UPI App
function openUPIApp(app, amount, transactionId) {
  const upiId = document.getElementById('upiId').value;
  if (!upiId) {
    showToast('❌ Please enter UPI ID first');
    return;
  }
  submitUPIPayment(amount, transactionId);
}

// Submit UPI Payment
function submitUPIPayment(amount, transactionId) {
  const upiId = document.getElementById('upiId').value;
  
  if (!upiId || !upiId.includes('@')) {
    showToast('❌ Please enter valid UPI ID');
    return;
  }

  showPaymentProcessing(amount, transactionId, 'UPI');
}

// Show Card Payment Modal
function showCardPaymentModal(amount, transactionId) {
  const cardModal = `
    <div class="modal-header">
      <div class="modal-title">💳 Card Payment</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="padding: 1.5rem;">
      <div style="background: #f0f8ff; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; text-align: center;">
        <div style="font-size: 0.9rem; color: #4A3728;">Amount to Pay</div>
        <div style="font-size: 2rem; font-weight: 700; color: #D4722A; margin-top: 0.5rem;">$${amount}</div>
      </div>
      
      <div class="form-group">
        <label class="form-label">Cardholder Name</label>
        <input class="form-input" type="text" placeholder="John Doe">
      </div>
      <div class="form-group">
        <label class="form-label">Card Number</label>
        <input class="form-input" type="text" placeholder="1234 5678 9012 3456" maxlength="19">
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div class="form-group">
          <label class="form-label">Expiry</label>
          <input class="form-input" type="text" placeholder="MM/YY" maxlength="5">
        </div>
        <div class="form-group">
          <label class="form-label">CVV</label>
          <input class="form-input" type="text" placeholder="123" maxlength="3">
        </div>
      </div>
      <button class="form-submit" onclick="submitCardPayment(${amount}, '${transactionId}')">Pay $${amount}</button>
    </div>
  `;

  document.getElementById('modalBox').innerHTML = cardModal;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Submit Card Payment
function submitCardPayment(amount, transactionId) {
  showPaymentProcessing(amount, transactionId, 'Card');
}

// Show Wallet Payment Modal
function showWalletPaymentModal(amount, transactionId) {
  const walletModal = `
    <div class="modal-header">
      <div class="modal-title">💰 Wallet Payment</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="padding: 1.5rem; text-align: center;">
      <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.9rem; color: #4A3728; margin-bottom: 0.5rem;">Your Wallet Balance</div>
        <div style="font-size: 2rem; font-weight: 700; color: #D4722A;">$${Math.random() * 200 + 50 | 0}</div>
      </div>
      
      <div style="background: #fffbf0; border: 1.5px solid #D4722A; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-weight: 600; color: #1A1208; margin-bottom: 0.5rem;">Amount to Pay</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #D4722A;">$${amount}</div>
      </div>

      <button class="form-submit" onclick="submitWalletPayment(${amount}, '${transactionId}')">Pay from Wallet</button>
      <button style="width: 100%; padding: 0.75rem; margin-top: 0.75rem; border: 1.5px solid #E8E0D4; background: white; color: #4A3728; border-radius: 8px; cursor: pointer; font-weight: 600;" onclick="closeModal()">
        Cancel
      </button>
    </div>
  `;

  document.getElementById('modalBox').innerHTML = walletModal;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Submit Wallet Payment
function submitWalletPayment(amount, transactionId) {
  showPaymentProcessing(amount, transactionId, 'Wallet');
}

// Show payment processing with verification
function showPaymentProcessing(amount, transactionId, method) {
  let processedAmount = 0;
  const processingModal = `
    <div class="modal-header">
      <div class="modal-title">⏳ Processing Payment...</div>
    </div>
    <div style="padding: 2rem; text-align: center;">
      <div style="width: 80px; height: 80px; background: rgba(212,114,42,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; animation: spin 2s linear infinite; font-size: 2rem;">
        💳
      </div>
      <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Processing your ${method} payment...</div>
      <div style="font-size: 0.9rem; color: #4A3728; margin-bottom: 1.5rem;">Amount: <strong>$${amount}</strong></div>
      
      <div style="background: #f9f9f9; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; color: #4A3728; margin-bottom: 0.5rem;">Transaction ID</div>
        <div style="font-family: monospace; font-weight: 600; color: #1A1208;">${transactionId}</div>
      </div>

      <div id="paymentProgress" style="background: #E8E0D4; border-radius: 8px; height: 8px; overflow: hidden; margin-bottom: 1.5rem;">
        <div style="background: #D4722A; height: 100%; width: 0%; animation: progress 3s ease-in-out forwards;"></div>
      </div>

      <div id="paymentStatus" style="font-size: 0.9rem; color: #4A3728;">Verifying payment...</div>
    </div>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes progress { to { width: 100%; } }
    </style>
  `;

  document.getElementById('modalBox').innerHTML = processingModal;
  
  // Simulate payment processing
  setTimeout(() => {
    document.getElementById('paymentStatus').textContent = 'Confirming transaction...';
  }, 1000);

  setTimeout(() => {
    showPaymentSuccess(amount, transactionId, method);
  }, 3000);
}

// Show payment success
function showPaymentSuccess(amount, transactionId, method) {
  const successModal = `
    <div class="modal-header">
      <div class="modal-title">✅ Payment Successful!</div>
    </div>
    <div style="padding: 2rem; text-align: center;">
      <div style="font-size: 4rem; margin-bottom: 1rem;">✨</div>
      
      <div style="background: #f0fff4; border: 2px solid #52c41a; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="font-weight: 600; color: #1A1208; margin-bottom: 0.5rem;">Payment Confirmed</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #D4722A; margin-bottom: 0.5rem;">$${amount}</div>
        <div style="font-size: 0.85rem; color: #4A3728;">via ${method}</div>
      </div>

      <div style="background: #f9f9f9; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; text-align: left;">
        <div style="margin-bottom: 0.75rem;">
          <div style="font-size: 0.8rem; color: #4A3728; margin-bottom: 0.3rem;">Transaction ID</div>
          <div style="font-family: monospace; font-weight: 600; color: #1A1208;">${transactionId}</div>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: #4A3728; margin-bottom: 0.3rem;">Status</div>
          <div style="color: #52c41a; font-weight: 600;">✅ Completed</div>
        </div>
      </div>

      <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-weight: 600; color: #1A1208; margin-bottom: 0.5rem;">Booking Confirmed!</div>
        <div style="font-size: 0.9rem; color: #4A3728;">Your service booking has been confirmed. A provider will contact you shortly.</div>
      </div>

      <button class="form-submit" onclick="completeBooking('${transactionId}')">View Booking Details</button>
      <button style="width: 100%; padding: 0.75rem; margin-top: 0.75rem; border: 1.5px solid #E8E0D4; background: white; color: #4A3728; border-radius: 8px; cursor: pointer; font-weight: 600;" onclick="location.reload()">
        Go to Home
      </button>
    </div>
  `;

  document.getElementById('modalBox').innerHTML = successModal;
}


// Complete booking
function completeBooking(transactionId) {
  showToast('✅ Booking completed! Reference: ' + transactionId);
  closeModal();
}

// ==================== BOOKING API ====================
async function handleBooking(e) {
  e?.preventDefault();
  
  const user = getCurrentUser();
  if (!user) {
    showAuthModal();
    return;
  }
  
  const service = document.getElementById('booking-service')?.value;
  const date = document.getElementById('booking-date')?.value;
  const time = document.getElementById('booking-time')?.value;
  const address = document.getElementById('booking-address')?.value;
  const phone = document.getElementById('booking-phone')?.value;
  
  if (!service || !date || !time || !address || !phone) {
    showError('❌ Please fill all fields');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service, date, time, address, phone, userId: user.id, amount: 500 })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showSuccess('✅ Booking confirmed!');
      setTimeout(() => showPaymentOptions(data.booking), 1500);
    } else {
      showError(data.message || 'Booking failed');
    }
  } catch (error) {
    console.error('Booking error:', error);
    showError('Connection error - Check console. Make sure backend is running on port 8000');
  }
}

// ==================== MY BOOKINGS ====================
async function showMyBookings() {
  const user = getCurrentUser();
  if (!user) {
    showAuthModal();
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings?userId=${user.id}`);
    const data = await response.json();
    const bookings = data.bookings || [];
    
    let html = `<div class="modal-header"><div class="modal-title">📅 My Bookings</div><button class="modal-close" onclick="closeModal()">✕</button></div><div style="padding: 2rem; max-height: 70vh; overflow-y: auto;">`;
    
    if (bookings.length === 0) {
      html += `<p style="text-align: center; color: #8B7355;">No bookings yet 🎉</p>`;
    } else {
      bookings.forEach(b => {
        html += `<div style="border: 1px solid #E8E0D4; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;"><div style="font-weight: 600;">${b.service}</div><div style="font-size: 0.85rem; color: #8B7355;">📅 ${b.date} at ${b.time}</div><div style="font-size: 0.85rem; color: #8B7355;">📍 ${b.address}</div></div>`;
      });
    }
    
    html += `</div>`;
    document.getElementById('modalBox').innerHTML = html;
    document.getElementById('modal').classList.add('active');
  } catch (error) {
    showError('Error: ' + error.message);
  }
}

// ==================== PAYMENT ====================
function showPaymentOptions(booking) {
  const amount = booking.amount || 500;
  const transactionId = `TXN${Date.now()}`;
  
  const modal = `
    <div class="modal-header">
      <div class="modal-title">💳 Complete Payment</div>
    </div>
    <div style="padding: 2rem; text-align: center;">
      <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.9rem; color: #4A3728;">Amount to Pay</div>
        <div style="font-size: 2.5rem; font-weight: 700; color: #D4722A;">₹${amount}</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="border: 2px solid #E8E0D4; border-radius: 8px; padding: 1.5rem; cursor: pointer;" onclick="processQRPayment(${amount}, '${transactionId}')">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📲</div>
          <div style="font-weight: 600; margin-bottom: 0.25rem;">Scan QR Code</div>
          <button style="width: 100%; padding: 0.5rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 0.75rem;" onclick="processQRPayment(${amount}, '${transactionId}')">Generate QR</button>
        </div>

        <div style="border: 2px solid #E8E0D4; border-radius: 8px; padding: 1.5rem; cursor: pointer;" onclick="processUPIPayment(${amount}, '${transactionId}')">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">💳</div>
          <div style="font-weight: 600; margin-bottom: 0.25rem;">UPI ID Payment</div>
          <button style="width: 100%; padding: 0.5rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 0.75rem;" onclick="processUPIPayment(${amount}, '${transactionId}')">Pay via UPI</button>
        </div>
      </div>

      <button style="width: 100%; padding: 0.75rem; border: 1.5px solid #E8E0D4; background: white; color: #4A3728; border-radius: 8px; cursor: pointer; font-weight: 600;" onclick="closeModal()">Cancel</button>
    </div>
  `;
  
  document.getElementById('modalBox').innerHTML = modal;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function processQRPayment(amount, transactionId) {
  const modal = `
    <div class="modal-header">
      <div class="modal-title">📲 Scan QR Code</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="padding: 2rem; text-align: center;">
      <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 2rem; font-weight: 700; color: #D4722A;">₹${amount}</div>
      </div>
      <div id="qrCode" style="width: 250px; height: 250px; margin: 0 auto; margin-bottom: 1.5rem;"></div>
      <button style="width: 100%; padding: 0.75rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="completePayment('${transactionId}', ${amount}, 'QR')">Payment Complete</button>
    </div>
  `;
  
  document.getElementById('modalBox').innerHTML = modal;
  
  if (typeof QRCode !== 'undefined') {
    setTimeout(() => {
      new QRCode(document.getElementById('qrCode'), {
        text: `upi://pay?pa=neighbourhub@upi&am=${amount}&tr=${transactionId}`,
        width: 250,
        height: 250
      });
    }, 100);
  }
}

function processUPIPayment(amount, transactionId) {
  const modal = `
    <div class="modal-header">
      <div class="modal-title">💳 UPI Payment</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="padding: 2rem;">
      <div style="background: rgba(212,114,42,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 2rem; font-weight: 700; color: #D4722A;">₹${amount}</div>
      </div>
      <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Enter UPI ID:</label>
      <input type="text" id="upiId" placeholder="example@upi" style="width: 100%; padding: 0.75rem; border: 1.5px solid #E8E0D4; border-radius: 6px; margin-bottom: 1rem;" />
      <button style="width: 100%; padding: 0.75rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="completeUPIPayment('${transactionId}', ${amount})">Pay ₹${amount}</button>
    </div>
  `;
  
  document.getElementById('modalBox').innerHTML = modal;
}

async function completePayment(transactionId, amount, method) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId, amount, method })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showSuccess('✅ Payment Successful!');
      setTimeout(() => { closeModal(); location.reload(); }, 1500);
    }
  } catch (error) {
    console.error('Payment error:', error);
    showError('Payment failed - Check console');
  }
}

function completeUPIPayment(transactionId, amount) {
  const upiId = document.getElementById('upiId').value;
  if (!upiId) {
    showError('Please enter UPI ID');
    return;
  }
  completePayment(transactionId, amount, `UPI - ${upiId}`);
}

// ==================== MODAL & NOTIFICATION ====================
function openModal(type) {
  const modals = {
    login: `
      <div class="modal-header">
        <div class="modal-title">Welcome back</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <form id="loginForm" onsubmit="handleLogin(event)">
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input class="form-input" type="email" id="login-email" placeholder="you@example.com" required>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" type="password" id="login-password" placeholder="••••••••" required>
        </div>
        <button type="submit" class="form-submit">Log In</button>
      </form>
      <div class="modal-switch">No account? <a onclick="openModal('signup')">Sign up free</a></div>
    `,
    signup: `
      <div class="modal-header">
        <div class="modal-title">Join NeighbourHub</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <form id="signupForm" onsubmit="handleSignup(event)">
        <div class="form-row">
          <div class="form-group"><label class="form-label">First name</label><input class="form-input" type="text" id="signup-firstName" placeholder="Jane" required></div>
          <div class="form-group"><label class="form-label">Last name</label><input class="form-input" type="text" id="signup-lastName" placeholder="Doe" required></div>
        </div>
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input class="form-input" type="email" id="signup-email" placeholder="you@example.com" required>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" type="password" id="signup-password" placeholder="Create a strong password" required>
        </div>
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <input class="form-input" type="password" id="signup-confirm" placeholder="Confirm password" required>
        </div>
        <button type="submit" class="form-submit">Create Account</button>
      </form>
      <div class="modal-switch">Already a member? <a onclick="openModal('login')">Log in</a></div>
    `
  };
  
  if (modals[type]) {
    document.getElementById('modalBox').innerHTML = modals[type];
    document.getElementById('modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function showAuthModal() {
  openModal('login');
}

function closeModal() {
  document.getElementById('modal')?.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function closeModalOnBg(event) {
  if (event.target.id === 'modal') {
    closeModal();
  }
}

function showSuccess(msg) {
  const modal = `<div style="text-align: center; padding: 2rem;"><div style="font-size: 3rem; margin-bottom: 1rem;">✨</div><div style="color: #1A1208; font-weight: 600;">${msg}</div></div>`;
  document.getElementById('modalBox').innerHTML = modal;
  document.getElementById('modal').classList.add('active');
}

function showError(msg) {
  const modal = `<div style="text-align: center; padding: 2rem;"><div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div><div style="color: #d32f2f; margin-bottom: 1rem;">${msg}</div><button style="padding: 0.5rem 1rem; background: #D4722A; color: white; border: none; border-radius: 6px; cursor: pointer;" onclick="closeModal()">OK</button></div>`;
  document.getElementById('modalBox').innerHTML = modal;
  document.getElementById('modal').classList.add('active');
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #D4722A; color: white; padding: 1rem; border-radius: 6px; z-index: 10000;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Init on page load
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  const signupBtn = document.getElementById('signup-btn');
  if (signupBtn) signupBtn.addEventListener('click', handleSignup);
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) loginBtn.addEventListener('click', handleLogin);
  const bookingBtn = document.getElementById('booking-btn');
  if (bookingBtn) bookingBtn.addEventListener('click', handleBooking);
});

console.log('✅ Smart Booking System Loaded!');

