/**
 * API Integration Layer
 * Connects the frontend to Express backend
 * Base URL: http://localhost:5000 (update for production)
 */

const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('token') || null;

// ══════════════════════════════════════════════════════════════
// AUTH API
// ══════════════════════════════════════════════════════════════
async function apiRegister(name, email, password, role = 'manager') {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    authToken = data.token;
    localStorage.setItem('token', authToken);
    return data;
  } catch (err) {
    console.error('Register error:', err);
    throw err;
  }
}

async function apiLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    authToken = data.token;
    localStorage.setItem('token', authToken);
    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

async function apiGetMe() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  } catch (err) {
    console.error('Get user error:', err);
    authToken = null;
    localStorage.removeItem('token');
    throw err;
  }
}

function apiLogout() {
  authToken = null;
  localStorage.removeItem('token');
}

// ══════════════════════════════════════════════════════════════
// ROOMS API
// ══════════════════════════════════════════════════════════════
async function apiGetRooms() {
  try {
    const res = await fetch(`${API_BASE}/rooms`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return await res.json();
  } catch (err) {
    console.error('Get rooms error:', err);
    throw err;
  }
}

async function apiGetRoom(id) {
  try {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch room');
    return await res.json();
  } catch (err) {
    console.error('Get room error:', err);
    throw err;
  }
}

async function apiCreateRoom(roomData) {
  try {
    const res = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error('Failed to create room');
    return await res.json();
  } catch (err) {
    console.error('Create room error:', err);
    throw err;
  }
}

async function apiUpdateRoom(id, roomData) {
  try {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error('Failed to update room');
    return await res.json();
  } catch (err) {
    console.error('Update room error:', err);
    throw err;
  }
}

async function apiDeleteRoom(id) {
  try {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to delete room');
    return await res.json();
  } catch (err) {
    console.error('Delete room error:', err);
    throw err;
  }
}

async function apiGetRoomStats() {
  try {
    const res = await fetch(`${API_BASE}/rooms/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch room stats');
    return await res.json();
  } catch (err) {
    console.error('Get room stats error:', err);
    throw err;
  }
}

// ══════════════════════════════════════════════════════════════
// TENANTS API
// ══════════════════════════════════════════════════════════════
async function apiGetTenants() {
  try {
    const res = await fetch(`${API_BASE}/tenants`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch tenants');
    return await res.json();
  } catch (err) {
    console.error('Get tenants error:', err);
    throw err;
  }
}

async function apiGetTenant(id) {
  try {
    const res = await fetch(`${API_BASE}/tenants/${id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch tenant');
    return await res.json();
  } catch (err) {
    console.error('Get tenant error:', err);
    throw err;
  }
}

async function apiCreateTenant(tenantData) {
  try {
    const res = await fetch(`${API_BASE}/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(tenantData),
    });
    if (!res.ok) throw new Error('Failed to create tenant');
    return await res.json();
  } catch (err) {
    console.error('Create tenant error:', err);
    throw err;
  }
}

async function apiUpdateTenant(id, tenantData) {
  try {
    const res = await fetch(`${API_BASE}/tenants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(tenantData),
    });
    if (!res.ok) throw new Error('Failed to update tenant');
    return await res.json();
  } catch (err) {
    console.error('Update tenant error:', err);
    throw err;
  }
}

async function apiDeleteTenant(id) {
  try {
    const res = await fetch(`${API_BASE}/tenants/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to delete tenant');
    return await res.json();
  } catch (err) {
    console.error('Delete tenant error:', err);
    throw err;
  }
}

// ══════════════════════════════════════════════════════════════
// TRANSACTIONS API
// ══════════════════════════════════════════════════════════════
async function apiGetTransactions(type = null) {
  try {
    let url = `${API_BASE}/transactions`;
    if (type) url += `?type=${type}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return await res.json();
  } catch (err) {
    console.error('Get transactions error:', err);
    throw err;
  }
}

async function apiGetTransaction(id) {
  try {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch transaction');
    return await res.json();
  } catch (err) {
    console.error('Get transaction error:', err);
    throw err;
  }
}

async function apiCreateTransaction(txData) {
  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(txData),
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return await res.json();
  } catch (err) {
    console.error('Create transaction error:', err);
    throw err;
  }
}

async function apiUpdateTransaction(id, txData) {
  try {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(txData),
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return await res.json();
  } catch (err) {
    console.error('Update transaction error:', err);
    throw err;
  }
}

async function apiDeleteTransaction(id) {
  try {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
    return await res.json();
  } catch (err) {
    console.error('Delete transaction error:', err);
    throw err;
  }
}

async function apiGetFinancialSummary() {
  try {
    const res = await fetch(`${API_BASE}/transactions/summary/financial`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch financial summary');
    return await res.json();
  } catch (err) {
    console.error('Get financial summary error:', err);
    throw err;
  }
}

// ══════════════════════════════════════════════════════════════
// MAINTENANCE API
// ══════════════════════════════════════════════════════════════
async function apiGetMaintenance() {
  try {
    const res = await fetch(`${API_BASE}/maintenance`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch maintenance requests');
    return await res.json();
  } catch (err) {
    console.error('Get maintenance error:', err);
    throw err;
  }
}

async function apiGetMaintenanceRequest(id) {
  try {
    const res = await fetch(`${API_BASE}/maintenance/${id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch maintenance request');
    return await res.json();
  } catch (err) {
    console.error('Get maintenance request error:', err);
    throw err;
  }
}

async function apiCreateMaintenance(mxData) {
  try {
    const res = await fetch(`${API_BASE}/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(mxData),
    });
    if (!res.ok) throw new Error('Failed to create maintenance request');
    return await res.json();
  } catch (err) {
    console.error('Create maintenance error:', err);
    throw err;
  }
}

async function apiUpdateMaintenance(id, mxData) {
  try {
    const res = await fetch(`${API_BASE}/maintenance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(mxData),
    });
    if (!res.ok) throw new Error('Failed to update maintenance request');
    return await res.json();
  } catch (err) {
    console.error('Update maintenance error:', err);
    throw err;
  }
}

async function apiDeleteMaintenance(id) {
  try {
    const res = await fetch(`${API_BASE}/maintenance/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to delete maintenance request');
    return await res.json();
  } catch (err) {
    console.error('Delete maintenance error:', err);
    throw err;
  }
}

async function apiGetMaintenanceStats() {
  try {
    const res = await fetch(`${API_BASE}/maintenance/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch maintenance stats');
    return await res.json();
  } catch (err) {
    console.error('Get maintenance stats error:', err);
    throw err;
  }
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD API
// ══════════════════════════════════════════════════════════════
async function apiGetDashboardOverview() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/overview`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard overview');
    return await res.json();
  } catch (err) {
    console.error('Get dashboard overview error:', err);
    throw err;
  }
}

async function apiGetRevenueHistory() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/revenue-history`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch revenue history');
    return await res.json();
  } catch (err) {
    console.error('Get revenue history error:', err);
    throw err;
  }
}

// Export for use in HTML script tags
window.API = {
  // Auth
  register: apiRegister,
  login: apiLogin,
  getMe: apiGetMe,
  logout: apiLogout,
  // Rooms
  getRooms: apiGetRooms,
  getRoom: apiGetRoom,
  createRoom: apiCreateRoom,
  updateRoom: apiUpdateRoom,
  deleteRoom: apiDeleteRoom,
  getRoomStats: apiGetRoomStats,
  // Tenants
  getTenants: apiGetTenants,
  getTenant: apiGetTenant,
  createTenant: apiCreateTenant,
  updateTenant: apiUpdateTenant,
  deleteTenant: apiDeleteTenant,
  // Transactions
  getTransactions: apiGetTransactions,
  getTransaction: apiGetTransaction,
  createTransaction: apiCreateTransaction,
  updateTransaction: apiUpdateTransaction,
  deleteTransaction: apiDeleteTransaction,
  getFinancialSummary: apiGetFinancialSummary,
  // Maintenance
  getMaintenance: apiGetMaintenance,
  getMaintenanceRequest: apiGetMaintenanceRequest,
  createMaintenance: apiCreateMaintenance,
  updateMaintenance: apiUpdateMaintenance,
  deleteMaintenance: apiDeleteMaintenance,
  getMaintenanceStats: apiGetMaintenanceStats,
  // Dashboard
  getDashboardOverview: apiGetDashboardOverview,
  getRevenueHistory: apiGetRevenueHistory,
};
