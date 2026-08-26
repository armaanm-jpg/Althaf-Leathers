// Client Session Management Utility for Althaf Leathers
// Manages User Session (Inquiries, Wishlist, Cart, Responses) and Admin Session

export interface UserInquiryLog {
  id: string;
  type: 'contact' | 'bulk_inquiry' | 'whatsapp_order';
  timestamp: string;
  referenceCode: string;
  summary: string;
  details?: Record<string, any>;
}

export interface UserSessionData {
  sessionId: string;
  createdAt: string;
  lastActiveAt: string;
  inquiries: UserInquiryLog[];
  cart?: any[];
  wishlist?: string[];
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
}

const USER_SESSION_KEY = 'althaf_user_session_v1';
const ADMIN_TOKEN_KEY = 'althaf_admin_session_token';
const ADMIN_AUTH_KEY = 'althaf_admin_auth';

// Generate a cryptographically secure random session ID
function generateSecureId(prefix = 'sess'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
}

// ----------------- User Session -----------------

export function getUserSession(): UserSessionData {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (raw) {
      const parsed: UserSessionData = JSON.parse(raw);
      if (parsed && parsed.sessionId) {
        parsed.lastActiveAt = new Date().toISOString();
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Session] Failed to read user session, creating new:', err);
  }

  // Create initial fresh session
  const newSession: UserSessionData = {
    sessionId: generateSecureId('usr'),
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    inquiries: [],
  };

  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newSession));
  } catch {
    // ignore
  }

  return newSession;
}

export function saveUserSession(session: Partial<UserSessionData>): UserSessionData {
  const current = getUserSession();
  const updated: UserSessionData = {
    ...current,
    ...session,
    lastActiveAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[Session] Failed to save session:', err);
  }

  return updated;
}

export function syncUserSession(data: Partial<UserSessionData>): UserSessionData {
  return saveUserSession(data);
}

export function trackUserAction(action: string, metadata?: Record<string, any>): void {
  // Updates user activity timestamp and optional tracking
  saveUserSession({ lastActiveAt: new Date().toISOString() });
}

export function trackUserInquiry(inquiry: Omit<UserInquiryLog, 'id' | 'timestamp'>): UserInquiryLog {
  const current = getUserSession();
  const newLog: UserInquiryLog = {
    id: generateSecureId('inq'),
    timestamp: new Date().toISOString(),
    ...inquiry,
  };

  const updatedInquiries = [newLog, ...(current.inquiries || [])].slice(0, 50); // Keep last 50
  saveUserSession({ inquiries: updatedInquiries });
  return newLog;
}

export function saveCustomerInfo(info: { name?: string; phone?: string; email?: string; address?: string }): void {
  const current = getUserSession();
  saveUserSession({
    customerInfo: {
      ...(current.customerInfo || {}),
      ...info,
    },
  });
}

// ----------------- Admin Session -----------------

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string, persist = false): void {
  try {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    if (persist) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
  } catch {
    // ignore
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function isAdminAuthenticated(): boolean {
  try {
    const token = getAdminToken();
    const isAuth = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    return Boolean(token || isAuth);
  } catch {
    return false;
  }
}
