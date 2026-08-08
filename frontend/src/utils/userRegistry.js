/**
 * NyayaSetu — Real Registered User Sync Manager
 * Captures real Clerk authentication sign-ups and logs them for Admin Portal oversight.
 */

const STORAGE_KEY = 'nyaysetu_real_registered_users';

export function getRealRegisteredUsers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function syncRealUserToRegistry(clerkUser, role = 'USER') {
  if (!clerkUser || !clerkUser.id) return getRealRegisteredUsers();

  const email = clerkUser.primaryEmailAddress?.emailAddress || '';
  const fullName = clerkUser.fullName || clerkUser.firstName || email.split('@')[0] || 'Registered User';
  const clerkUserId = clerkUser.id;

  // Determine role based on email if not explicitly passed
  let userRole = role;
  if (email.toLowerCase().includes('priyamsingh504')) {
    userRole = 'ADMIN';
  } else if (
    email.toLowerCase().includes('shruti') ||
    email.toLowerCase().includes('singhshruti') ||
    email.toLowerCase().includes('prince')
  ) {
    userRole = 'LAWYER';
  }

  const existingUsers = getRealRegisteredUsers();
  const existingIndex = existingUsers.findIndex(
    (u) => u.clerkUserId === clerkUserId || (u.email && email && u.email.toLowerCase() === email.toLowerCase())
  );

  const timestamp = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  let updatedUsers;
  if (existingIndex >= 0) {
    // Preserve existing role if modified by Admin
    const currentRole = existingUsers[existingIndex].role || userRole;
    updatedUsers = [...existingUsers];
    updatedUsers[existingIndex] = {
      ...updatedUsers[existingIndex],
      fullName,
      email,
      clerkUserId,
      role: currentRole,
      lastActive: timestamp,
    };
  } else {
    // New user registration
    const newUser = {
      id: clerkUserId,
      fullName,
      email,
      clerkUserId,
      role: userRole,
      createdAt: timestamp,
      lastActive: timestamp,
    };
    updatedUsers = [newUser, ...existingUsers];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  } catch (err) {
    console.error('Failed to sync user to local registry:', err);
  }

  return updatedUsers;
}

export function updateRealUserRoleInRegistry(userId, newRole) {
  const users = getRealRegisteredUsers();
  const updated = users.map((u) => (u.id === userId || u.clerkUserId === userId ? { ...u, role: newRole } : u));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update user role in registry:', err);
  }
  return updated;
}
