import type { User } from "@/types";

export const AUTH_STORAGE_KEY = "ecora-auth-user";
export const USERS_STORAGE_KEY = "ecora-users";
const USERS_SEED_URL = "/users.json";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  authenticatedAt: string;
}

interface RegisteredUser extends User {
  password: string;
}

let cachedUsers: RegisteredUser[] | null = null;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePassword(password: string) {
  return password.trim();
}

function readStoredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as RegisteredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistUsers(users: RegisteredUser[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

function mergeUsers(baseUsers: RegisteredUser[], additionalUsers: RegisteredUser[]) {
  const merged = [...baseUsers];

  additionalUsers.forEach((user) => {
    const alreadyExists = merged.some(
      (entry) => entry.email.toLowerCase() === user.email.toLowerCase(),
    );

    if (!alreadyExists) {
      merged.push(user);
    }
  });

  return merged;
}

async function loadRegisteredUsers(): Promise<RegisteredUser[]> {
  if (cachedUsers) {
    return cachedUsers;
  }

  if (typeof window === "undefined") {
    return [];
  }

  try {
    const response = await fetch(USERS_SEED_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Falha ao carregar usuários");
    }

    const seedUsers = (await response.json()) as RegisteredUser[];
    const mergedUsers = mergeUsers(seedUsers, readStoredUsers());
    cachedUsers = mergedUsers;
    persistUsers(mergedUsers);
    return mergedUsers;
  } catch {
    const storedUsers = readStoredUsers();
    cachedUsers = storedUsers;
    return storedUsers;
  }
}

export async function getRegisteredUsers(): Promise<RegisteredUser[]> {
  return loadRegisteredUsers();
}

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed?.email || !parsed?.id || !parsed?.name) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed as AuthUser;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = normalizePassword(password);
  const users = await loadRegisteredUsers();

  const user = users.find(
    (registeredUser) =>
      registeredUser.email.toLowerCase() === normalizedEmail &&
      registeredUser.password === normalizedPassword,
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    authenticatedAt: new Date().toISOString(),
  };
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  phone = "",
): Promise<AuthUser> {
  const normalizedEmail = normalizeEmail(email);
  const users = await loadRegisteredUsers();

  const alreadyExists = users.some(
    (registeredUser) => registeredUser.email.toLowerCase() === normalizedEmail,
  );

  if (alreadyExists) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  const newUser: RegisteredUser = {
    id: `u_${Date.now()}`,
    name: name.trim() || "Cliente",
    email: normalizedEmail,
    phone: phone.trim(),
    password: normalizePassword(password),
  };

  const nextUsers = [...users, newUser];
  cachedUsers = nextUsers;
  persistUsers(nextUsers);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    authenticatedAt: new Date().toISOString(),
  };
}

export async function saveAuthUser(email: string, password: string): Promise<AuthUser> {
  const user = await authenticateUser(email, password);

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

export function clearAuthUser() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function isAuthenticated() {
  return Boolean(getStoredAuthUser());
}
