import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  confirmSignIn,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth';
import { USE_MOCK_AUTH as USE_MOCK } from '../config/aws-config';

const MOCK_AUTH_KEY = 'stridelux_mock_auth';

const MOCK_USERS = [
  {
    userId: 'mock-cust-001',
    username: 'customer@test.com',
    password: 'Test1234!',
    attributes: { email: 'customer@test.com', name: 'Demo Customer', phone_number: '+14165550001' },
    group: 'Customers',
  },
  {
    userId: 'mock-admin-001',
    username: 'admin@test.com',
    password: 'Admin1234!',
    attributes: { email: 'admin@test.com', name: 'Admin User', phone_number: '+14165559999' },
    group: 'Admins',
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]                     = useState(null);
  const [userAttributes, setUserAttributes] = useState(null);
  const [userGroup, setUserGroup]           = useState(null);
  const [loading, setLoading]               = useState(true);

  useEffect(() => { checkCurrentUser(); }, []);

  async function checkCurrentUser() {
    console.log('[Auth] checkCurrentUser — USE_MOCK:', USE_MOCK);
    try {
      if (USE_MOCK) {
        const stored = localStorage.getItem(MOCK_AUTH_KEY);
        if (!stored) throw new Error('no session');
        const session = JSON.parse(stored);
        setUser({ userId: session.userId, username: session.username });
        setUserAttributes(session.attributes);
        setUserGroup(session.group);
        return session.group;
      }

      const currentUser = await getCurrentUser();
      console.log('[Auth] getCurrentUser OK:', currentUser?.username);

      const attributes  = await fetchUserAttributes();
      console.log('[Auth] attributes:', JSON.stringify(attributes));

      const session     = await fetchAuthSession();
      const idPayload   = session.tokens?.idToken?.payload;
      console.log('[Auth] idToken payload:', JSON.stringify(idPayload));

      const groups     = idPayload?.['cognito:groups'] || [];
      const customRole = attributes?.['custom:role'] || '';
      console.log('[Auth] groups:', groups, '| custom:role:', customRole);

      const isAdminUser =
        groups.some((g) => g.toLowerCase() === 'admins') ||
        customRole.toLowerCase() === 'admin';
      const group = isAdminUser ? 'Admins' : 'Customers';
      console.log('[Auth] resolved group:', group);

      setUser(currentUser);
      setUserAttributes(attributes);
      setUserGroup(group);
      return group;
    } catch (err) {
      console.log('[Auth] checkCurrentUser caught error:', err?.message || err);
      setUser(null);
      setUserAttributes(null);
      setUserGroup(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(username, password) {
    if (USE_MOCK) {
      const mockUser = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
      );
      if (!mockUser) throw new Error('Incorrect username or password.');
      const session = {
        userId:     mockUser.userId,
        username:   mockUser.username,
        attributes: mockUser.attributes,
        group:      mockUser.group,
      };
      localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(session));
      setUser({ userId: mockUser.userId, username: mockUser.username });
      setUserAttributes(mockUser.attributes);
      setUserGroup(mockUser.group);
      return { isSignedIn: true, group: mockUser.group };
    }

    const result = await signIn({ username, password });
    console.log('[Auth] signIn result — isSignedIn:', result.isSignedIn, '| nextStep:', JSON.stringify(result.nextStep));

    if (!result.isSignedIn) {
      // Return the challenge step so Login UI can handle it
      return { isSignedIn: false, nextStep: result.nextStep };
    }

    const group = await checkCurrentUser();
    return { isSignedIn: true, group };
  }

  async function handleConfirmNewPassword(newPassword) {
    const result = await confirmSignIn({ challengeResponse: newPassword });
    if (!result.isSignedIn) {
      throw new Error(`Unexpected sign-in step: ${result.nextStep?.signInStep}`);
    }
    const group = await checkCurrentUser();
    return { isSignedIn: true, group };
  }

  async function handleSignOut() {
    if (USE_MOCK) {
      localStorage.removeItem(MOCK_AUTH_KEY);
      setUser(null);
      setUserAttributes(null);
      setUserGroup(null);
      return;
    }
    await signOut();
    setUser(null);
    setUserAttributes(null);
    setUserGroup(null);
  }

  async function handleSignUp({ username, password, email, name, phoneNumber }) {
    if (USE_MOCK) {
      return { isSignUpComplete: false, userId: `mock-${Date.now()}` };
    }
    return await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
          name,
          phone_number: phoneNumber,
          'custom:role': 'customer',
        },
      },
    });
  }

  async function handleConfirmSignUp(username, confirmationCode) {
    if (USE_MOCK) return { isSignUpComplete: true };
    return await confirmSignUp({ username, confirmationCode });
  }

  async function handleForgotPassword(username) {
    if (USE_MOCK) return { nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' } };
    return await resetPassword({ username });
  }

  async function handleConfirmForgotPassword(username, confirmationCode, newPassword) {
    if (USE_MOCK) return;
    return await confirmResetPassword({ username, confirmationCode, newPassword });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userAttributes,
        userGroup,
        loading,
        isAdmin:               userGroup === 'Admins',
        isCustomer:            userGroup === 'Customers',
        isGuest:               !user,
        signIn:                handleSignIn,
        signOut:               handleSignOut,
        signUp:                handleSignUp,
        confirmSignUp:         handleConfirmSignUp,
        confirmNewPassword:    handleConfirmNewPassword,
        forgotPassword:        handleForgotPassword,
        confirmForgotPassword: handleConfirmForgotPassword,
        refreshUser:           checkCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
