import {
  readUsers,
  writeUsers,
  readSessions,
  writeSessions,
  hashPassword,
  verifyPassword,
  newId,
  defaultProfile,
  normalizeProfile,
} from "../utils/store.js";
import jwt from "jsonwebtoken";

function createSessionRecord(userId) {
  const sessions = readSessions();
  const sid = newId("sid");
  const now = Date.now();
  sessions.push({ sid, userId, createdAt: now, lastSeenAt: now });
  writeSessions(sessions);
  return sid;
}

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    profile: user.profile,
  };
}

export const signup = (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing name, email or password" });
  }

  const users = readUsers();
  const normalizedEmail = String(email).toLowerCase();
  const existing = users.find((user) => user.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const user = {
    id: newId("usr"),
    email: normalizedEmail,
    name: String(name),
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
    profile: defaultProfile(),
  };

  users.push(user);
  writeUsers(users);

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

  return res.status(201).json({ user: serializeUser(user), token });
};

export const login = (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const users = readUsers();
  const normalizedEmail = String(email).toLowerCase();
  const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

  return res.json({ user: serializeUser(user), token });
};

export const me = (req, res) => {
  const sid = req.cookies?.[SESSION_COOKIE];
  if (!sid) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const sessions = readSessions();
  const session = sessions.find((item) => item.sid === sid);
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const users = readUsers();
  const user = users.find((item) => item.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: "Invalid session" });
  }

  if (normalizeProfile(user)) {
    writeUsers(users);
  }
  session.lastSeenAt = Date.now();
  writeSessions(sessions);

  return res.json(serializeUser(user));
};

export const logout = (req, res) => {
  const sid = req.cookies?.[SESSION_COOKIE];
  if (sid) {
    const sessions = readSessions();
    const nextSessions = sessions.filter((item) => item.sid !== sid);
    writeSessions(nextSessions);
  }

  res.clearCookie(SESSION_COOKIE, { path: "/", sameSite: "none", secure: true });
  return res.json({ ok: true });
};
