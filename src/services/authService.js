import { USE_MOCK } from '../config/aws-config';

// ─── Mock users for development (REACT_APP_USE_MOCK=true) ────────────────────
const MOCK_USERS = [
  { sub: 'mock-cust-001', email: 'customer@test.com', password: 'Test1234!', name: 'Alex Carter', phone: '+14165550192', group: 'Customers' },
  { sub: 'mock-admin-001', email: 'admin@test.com', password: 'Admin1234!', name: 'Admin User', phone: '+14165559999', group: 'Admins' },
];

const getMockUser = () => {
  try { return JSON.parse(localStorage.getItem('mock_user') || 'null'); } catch { return null; }
};

// ─── Cognito helpers (lazy-imported only when mock is off) ───────────────────
async function cognitoSignIn(email, password) {
  const { signIn } = await import('aws-amplify/auth');
  const result = await signIn({ username: email, password });
  if (result.nextStep?.signInStep !== 'DONE') throw new Error(result.nextStep?.signInStep);
  return result;
}

async function cognitoSignUp({ email, password, name, phone }) {
  const { signUp } = await import('aws-amplify/auth');
  return signUp({
    username: email,
    password,
    options: { userAttributes: { email, name, phone_number: phone } },
  });
}

async function cognitoConfirmSignUp(email, code) {
  const { confirmSignUp } = await import('aws-amplify/auth');
  return confirmSignUp({ username: email, confirmationCode: code });
}

async function cognitoSignOut() {
  const { signOut } = await import('aws-amplify/auth');
  return signOut();
}

async function cognitoGetCurrentUser() {
  const { getCurrentUser, fetchAuthSession } = await import('aws-amplify/auth');
  const user = await getCurrentUser();
  const session = await fetchAuthSession();
  const payload = session.tokens?.idToken?.payload || {};
  const groups = payload['cognito:groups'] || [];
  return {
    sub: user.userId,
    email: payload.email,
    name: payload.name,
    phone: payload.phone_number,
    group: groups.includes('Admins') ? 'Admins' : 'Customers',
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────
export const authService = {
  async login(email, password) {
    if (USE_MOCK) {
      const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
      if (!user) throw new Error('Incorrect username or password.');
      const { password: _pw, ...safe } = user;
      localStorage.setItem('mock_user', JSON.stringify(safe));
      return safe;
    }
    return cognitoSignIn(email, password);
  },

  async register({ email, password, name, phone }) {
    if (USE_MOCK) {
      if (MOCK_USERS.find((u) => u.email === email)) {
        throw new Error('An account with the given email already exists.');
      }
      const newUser = { sub: `mock-${Date.now()}`, email, name, phone, group: 'Customers' };
      MOCK_USERS.push({ ...newUser, password });
      localStorage.setItem('mock_user', JSON.stringify(newUser));
      return newUser;
    }
    return cognitoSignUp({ email, password, name, phone });
  },

  async confirmEmail(email, code) {
    if (USE_MOCK) return true;
    return cognitoConfirmSignUp(email, code);
  },

  async logout() {
    if (USE_MOCK) { localStorage.removeItem('mock_user'); return; }
    return cognitoSignOut();
  },

  async getCurrentUser() {
    if (USE_MOCK) return getMockUser();
    try { return await cognitoGetCurrentUser(); } catch { return null; }
  },
};
