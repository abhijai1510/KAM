let currentKAMs = [];
let currentRestaurants = [];
let currentTab = 'dashboard';

const mainContent = document.getElementById('mainContent');
const recentActivities = document.getElementById('recentActivities');
const searchInput = document.getElementById('searchInput');

// Bootstrap Modals
const restaurantModal = new bootstrap.Modal(document.getElementById('restaurantModal'));
const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
const interactionModal = new bootstrap.Modal(document.getElementById('interactionModal'));

// Event Listeners
document.getElementById('dashboardLink').addEventListener('click', () => {
    currentTab = 'dashboard';
    loadDashboard();
});

document.getElementById('restaurantsLink').addEventListener('click', () => {
    currentTab = 'restaurants';
    loadRestaurants();
});

document.getElementById('interactionsLink').addEventListener('click', () => {
    currentTab = 'interactions';
    loadInteractions();
});

document.getElementById('addRestaurantBtn').addEventListener('click', () => {
    document.getElementById('restaurantForm').reset();
    document.getElementById('restaurantId').value = '';
    document.querySelector('#restaurantModal .modal-title').textContent = 'Add Restaurant';
    restaurantModal.show();
});

document.getElementById('saveRestaurant').addEventListener('click', saveRestaurant);
document.getElementById('saveContact').addEventListener('click', saveContact);
document.getElementById('saveInteraction').addEventListener('click', saveInteraction);

searchInput.addEventListener('input', handleSearch);

// API 
async function fetchKAMs() {
    try {
        const response = await fetch('/api/kams');
        currentKAMs = await response.json();
        populateKAMSelect();
    } catch (error) {
        console.error('Error fetching KAMs:', error);
    }
}

async function fetchRestaurants() {
    try {
        const response = await fetch('/api/restaurants');
        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        currentRestaurants = data;
        return data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
}

async function fetchInteractions() {
    try {
        const response = await fetch('/api/interactions');
        return await response.json();
    } catch (error) {
        console.error('Error fetching interactions:', error);
        return [];
    }
}

// UI Functions
function populateKAMSelect() {
    const kamSelect = document.getElementById('restaurantKam');
    kamSelect.innerHTML = currentKAMs.map(kam => 
        `<option value="${kam.id}">${kam.name}</option>`
    ).join('');
}

async function loadDashboard() {
    const restaurants = await fetchRestaurants();
    const interactions = await fetchInteractions();

    const dashboardHTML = `
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Restaurants</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">${restaurants.length}</div>
                            </div>
                            <div class="col-auto">
                                <i class='bx bx-store fa-2x text-gray-300'></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Active Restaurants</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    ${restaurants.filter(r => r.status === 'Active').length}
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class='bx bx-check-circle fa-2x text-gray-300'></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-info h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">New Leads</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    ${restaurants.filter(r => r.status === 'New').length}
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class='bx bx-plus-circle fa-2x text-gray-300'></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-warning h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Today's Follow-ups</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    ${interactions.filter(i => i.follow_up_required).length}
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class='bx bx-bell fa-2x text-gray-300'></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-primary">Recent Interactions</h6>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Restaurant</th>
                                        <th>Type</th>
                                        <th>KAM</th>
                                        <th>Follow-up</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${interactions.slice(0, 5).map(i => `
                                        <tr>
                                            <td>${new Date(i.interaction_date).toLocaleDateString()}</td>
                                            <td>${i.restaurant_name}</td>
                                            <td>${i.interaction_type}</td>
                                            <td>${i.kam_name}</td>
                                            <td>${i.follow_up_required ? '<span class="badge bg-warning">Required</span>' : ''}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = dashboardHTML;
    updateRecentActivities(interactions);
}

async function loadRestaurants() {
    const restaurants = await fetchRestaurants();
    
    const restaurantsHTML = `
        <div class="row">
            ${restaurants.map(restaurant => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card restaurant-card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="card-title mb-0">${restaurant.name}</h5>
                                <span class="status-badge status-${restaurant.status.toLowerCase()}">${restaurant.status}</span>
                            </div>
                            <p class="card-text">
                                <i class='bx bx-map'></i> ${restaurant.address}<br>
                                <i class='bx bx-phone'></i> ${restaurant.contact_number}
                            </p>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-primary" onclick="editRestaurant(${restaurant.id})">
                                    <i class='bx bx-edit'></i> Edit
                                </button>
                                <button class="btn btn-sm btn-info" onclick="showContacts(${restaurant.id})">
                                    <i class='bx bx-user'></i> Contacts
                                </button>
                                <button class="btn btn-sm btn-success" onclick="addInteraction(${restaurant.id})">
                                    <i class='bx bx-plus'></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    mainContent.innerHTML = restaurantsHTML;
}

async function loadInteractions() {
    const interactions = await fetchInteractions();
    
    const interactionsHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold text-primary">All Interactions</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Restaurant</th>
                                <th>Type</th>
                                <th>KAM</th>
                                <th>Notes</th>
                                <th>Follow-up</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${interactions.map(i => `
                                <tr>
                                    <td>${new Date(i.interaction_date).toLocaleDateString()}</td>
                                    <td>${i.restaurant_name}</td>
                                    <td>${i.interaction_type}</td>
                                    <td>${i.kam_name}</td>
                                    <td>${i.notes}</td>
                                    <td>${i.follow_up_required ? '<span class="badge bg-warning">Required</span>' : ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = interactionsHTML;
}

function updateRecentActivities(interactions) {
    const recentHTML = interactions.slice(0, 5).map(i => `
        <div class="activity-item ${i.interaction_type.toLowerCase()} fade-in">
            <div class="d-flex justify-content-between">
                <strong>${i.restaurant_name}</strong>
                <small>${new Date(i.interaction_date).toLocaleDateString()}</small>
            </div>
            <div>${i.interaction_type} - ${i.kam_name}</div>
            <small class="text-muted">${i.notes}</small>
        </div>
    `).join('');

    recentActivities.innerHTML = recentHTML;
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    if (currentTab !== 'restaurants') {
        currentTab = 'restaurants';
        document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
        document.querySelector('#restaurantsLink').parentElement.classList.add('active');
    }
    
    const filteredRestaurants = currentRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm) || 
        restaurant.address.toLowerCase().includes(searchTerm)
    );
    
    const restaurantsHTML = `
        <div class="row">
            ${filteredRestaurants.map(restaurant => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card restaurant-card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="card-title mb-0">${restaurant.name}</h5>
                                <span class="status-badge status-${restaurant.status.toLowerCase()}">${restaurant.status}</span>
                            </div>
                            <p class="card-text">
                                <i class='bx bx-map'></i> ${restaurant.address}<br>
                                <i class='bx bx-phone'></i> ${restaurant.contact_number}
                            </p>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-primary" onclick="editRestaurant(${restaurant.id})">
                                    <i class='bx bx-edit'></i> Edit
                                </button>
                                <button class="btn btn-sm btn-info" onclick="showContacts(${restaurant.id})">
                                    <i class='bx bx-user'></i> Contacts
                                </button>
                                <button class="btn btn-sm btn-success" onclick="addInteraction(${restaurant.id})">
                                    <i class='bx bx-plus'></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    mainContent.innerHTML = restaurantsHTML;

    if (!searchTerm && currentTab !== 'restaurants') {
        switch(currentTab) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'interactions':
                loadInteractions();
                break;
        }
    }
}

// CRUD
async function saveRestaurant() {
    const id = document.getElementById('restaurantId').value;
    const restaurantData = {
        name: document.getElementById('restaurantName').value,
        address: document.getElementById('restaurantAddress').value,
        contact_number: document.getElementById('restaurantContact').value,
        status: document.getElementById('restaurantStatus').value,
        kam_id: document.getElementById('restaurantKam').value
    };

    try {
        const url = id ? `/api/restaurants/${id}` : '/api/restaurants';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(restaurantData)
        });

        if (response.ok) {
            restaurantModal.hide();
            loadRestaurants();
        }
    } catch (error) {
        console.error('Error saving restaurant:', error);
    }
}

async function saveContact() {
    const contactData = {
        restaurant_id: document.getElementById('contactRestaurantId').value,
        name: document.getElementById('contactName').value,
        role: document.getElementById('contactRole').value,
        phone_number: document.getElementById('contactPhone').value,
        email: document.getElementById('contactEmail').value || null
    };

    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            throw new Error('Failed to save contact');
        }

        showContacts(contactData.restaurant_id);
    } catch (error) {
        console.error('Error saving contact:', error);
        alert('Failed to save contact. Please try again.');
    }
}

async function saveInteraction() {
    const interactionData = {
        restaurant_id: document.getElementById('interactionRestaurantId').value,
        kam_id: document.getElementById('restaurantKam').value,
        interaction_type: document.getElementById('interactionType').value,
        notes: document.getElementById('interactionNotes').value,
        follow_up_required: document.getElementById('followUpRequired').checked
    };

    try {
        const response = await fetch('/api/interactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(interactionData)
        });

        if (response.ok) {
            interactionModal.hide();
            loadDashboard();
        }
    } catch (error) {
        console.error('Error saving interaction:', error);
    }
}

// helper
async function editRestaurant(id) {
    const restaurant = currentRestaurants.find(r => r.id === id);
    if (restaurant) {
        document.getElementById('restaurantId').value = restaurant.id;
        document.getElementById('restaurantName').value = restaurant.name;
        document.getElementById('restaurantAddress').value = restaurant.address;
        document.getElementById('restaurantContact').value = restaurant.contact_number;
        document.getElementById('restaurantStatus').value = restaurant.status;
        document.getElementById('restaurantKam').value = restaurant.kam_id;
        
        document.querySelector('#restaurantModal .modal-title').textContent = 'Edit Restaurant';
        restaurantModal.show();
    }
}

async function showContacts(restaurantId) {
    try {
        const response = await fetch(`/api/restaurants/${restaurantId}/contacts`);
        const contacts = await response.json();
        
        const restaurant = currentRestaurants.find(r => r.id === restaurantId);
        
        document.querySelector('#contactModal .modal-content').innerHTML = `
            <div class="modal-header">
                <h5 class="modal-title">Contacts - ${restaurant.name}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <button class="btn btn-primary" onclick="showAddContactForm(${restaurantId})">
                        <i class='bx bx-plus'></i> Add Contact
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${contacts.map(c => `
                                <tr>
                                    <td>${c.name}</td>
                                    <td>${c.role}</td>
                                    <td>${c.phone_number}</td>
                                    <td>${c.email || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        contactModal.show();
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

function showAddContactForm(restaurantId) {
    const restaurant = currentRestaurants.find(r => r.id === restaurantId);
    
    document.querySelector('#contactModal .modal-content').innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Add Contact - ${restaurant.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="contactForm">
                <input type="hidden" id="contactRestaurantId" value="${restaurantId}">
                <div class="mb-3">
                    <label for="contactName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="contactName" required>
                </div>
                <div class="mb-3">
                    <label for="contactRole" class="form-label">Role</label>
                    <input type="text" class="form-control" id="contactRole" required>
                </div>
                <div class="mb-3">
                    <label for="contactPhone" class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="contactPhone" required>
                </div>
                <div class="mb-3">
                    <label for="contactEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" id="contactEmail">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="showContacts(${restaurantId})">Back</button>
            <button type="button" class="btn btn-primary" onclick="saveContact()">Save Contact</button>
        </div>
    `;
}

function addContact(restaurantId) {
    document.getElementById('contactRestaurantId').value = restaurantId;
    document.getElementById('contactForm').reset();
    contactModal.show();
}

function addInteraction(restaurantId) {
    document.getElementById('interactionRestaurantId').value = restaurantId;
    document.getElementById('interactionForm').reset();
    interactionModal.show();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchKAMs();
    loadDashboard();
});
