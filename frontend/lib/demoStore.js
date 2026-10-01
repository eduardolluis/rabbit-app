const USERS_KEY = "rabbit_demo_users";
const ORDERS_KEY = "rabbit_demo_orders";

const readJson = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const hashPassword = async (password) => {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    return password;
  }

  const data = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const publicUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "customer",
});

const createDemoToken = (user) => {
  const payload = JSON.stringify({
    id: user._id,
    email: user.email,
    demo: true,
    createdAt: Date.now(),
  });

  return `demo.${btoa(payload)}`;
};

export const registerDemoUser = async ({ name, email, password }) => {
  const users = readJson(USERS_KEY, []);
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);
  const user = {
    _id: `demo-user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    role: "customer",
    passwordHash,
  };

  users.push(user);
  writeJson(USERS_KEY, users);

  return {
    user: publicUser(user),
    token: createDemoToken(user),
  };
};

export const loginDemoUser = async ({ email, password }) => {
  const users = readJson(USERS_KEY, []);
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user) {
    throw new Error("Account not found. Please register first.");
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    throw new Error("Invalid credentials");
  }

  return {
    user: publicUser(user),
    token: createDemoToken(user),
  };
};

export const saveDemoOrder = ({ checkout, user, paymentDetails }) => {
  const orders = readJson(ORDERS_KEY, []);
  const orderId = checkout._id || checkout.id || `DEMO-${Date.now()}`;
  const createdAt = checkout.createdAt || new Date().toISOString();

  const order = {
    _id: orderId,
    user: user
      ? {
          _id: user._id || user.id,
          name: user.name,
          email: user.email,
        }
      : null,
    orderItems: checkout.checkoutItems || checkout.orderItems || [],
    shippingAddress: checkout.shippingAddress || {},
    paymentMethod: checkout.paymentMethod || "PayPal",
    paymentResult: paymentDetails || { status: "COMPLETED" },
    totalPrice: Number(checkout.totalPrice || 0),
    isPaid: true,
    paidAt: new Date().toISOString(),
    isDelivered: false,
    createdAt,
    demo: true,
  };

  const nextOrders = [order, ...orders.filter((item) => item._id !== orderId)];
  writeJson(ORDERS_KEY, nextOrders);
  return order;
};

export const getDemoOrdersForUser = (user) => {
  const orders = readJson(ORDERS_KEY, []);
  if (!user) return [];

  const userId = user._id || user.id;
  const email = user.email?.toLowerCase();

  return orders.filter((order) => {
    const orderUser = order.user || {};
    return (
      (userId && (orderUser._id === userId || orderUser.id === userId)) ||
      (email && orderUser.email?.toLowerCase() === email)
    );
  });
};

export const getDemoOrderById = (orderId) => {
  const orders = readJson(ORDERS_KEY, []);
  return orders.find((order) => String(order._id) === String(orderId)) || null;
};
