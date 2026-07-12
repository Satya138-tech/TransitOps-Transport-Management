const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? 'Something went wrong while contacting the API.');
  }

  return payload as T;
}

export type AuthPayload = {
  mode: 'login' | 'signup';
  email: string;
  password: string;
  role: 'user' | 'driver';
};

export type VehiclePayload = {
  registrationNumber: string;
  vehicleName: string;
  vehicleType: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: string;
  region: string;
  acquisitionDate: string;
  notes: string;
};

export type TripPayload = {
  source: string;
  destination: string;
  dispatchDate: string;
  dispatchWindow: string;
  cargoWeight: number;
  plannedDistance: number;
  vehicleType: string;
  region: string;
  priority: string;
  notes: string;
};

export function submitAuth(payload: AuthPayload) {
  return request<{
    message: string;
    user: {
      id: string;
      email: string;
      role: 'user' | 'driver';
    };
  }>('/api/auth', {
    method: 'POST',
    body: payload,
  });
}

export function getAdminDashboard() {
  return request<{
    kpiCards: Array<{ label: string; value: string; change: string }>;
    fleetOverview: Array<{ label: string; value: number; tone: string }>;
    activeTrips: Array<{
      tripId: string;
      route: string;
      vehicle: string;
      driver: string;
      status: string;
    }>;
    complianceAlerts: string[];
    costSummary: Array<{ label: string; value: string; detail: string }>;
    regionPerformance: Array<{
      region: string;
      utilization: string;
      available: string;
      trips: string;
    }>;
  }>('/api/admin/dashboard');
}

export function createVehicle(payload: VehiclePayload) {
  return request<{
    message: string;
    vehicle: {
      id: string;
      registrationNumber: string;
      vehicleName: string;
      vehicleType: string;
      maxLoadCapacity: number;
      odometer: number;
      acquisitionCost: number;
      status: string;
      region: string;
      acquisitionDate: string;
      notes: string;
    };
  }>('/api/vehicles', {
    method: 'POST',
    body: payload,
  });
}

export function createTrip(payload: TripPayload) {
  return request<{
    message: string;
    trip: {
      tripId: string;
      source: string;
      destination: string;
      status: string;
      assignedDriver: string;
      assignedVehicle: string;
      region: string;
    };
    assignment: {
      driverId: string;
      driverName: string;
      safetyScore: number;
      notification: string;
    };
  }>('/api/trips', {
    method: 'POST',
    body: payload,
  });
}

export function getDriverDashboard() {
  return request<{
    driverName: string;
    dailyMetrics: Array<{ label: string; value: string }>;
    inboxNotifications: Array<{ title: string; detail: string; tone: string }>;
    assignedTrips: Array<{
      tripId: string;
      route: string;
      vehicle: string;
      window: string;
      status: string;
    }>;
    tripChecklist: string[];
  }>('/api/drivers/dashboard');
}

export function getUserPortal() {
  return request<{
    userMetrics: Array<{ label: string; value: string }>;
    quickActions: Array<{ title: string; detail: string; to: string }>;
    requestHistory: Array<{
      tripId: string;
      route: string;
      requestedAt: string;
      status: string;
    }>;
    backendNotes: string[];
  }>('/api/users/portal');
}
