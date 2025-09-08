-- ============================
-- Users
-- ============================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    default_address_id INTEGER,
    FOREIGN KEY (default_address_id) REFERENCES addresses(id)
);

-- ============================
-- Addresses
-- ============================
CREATE TABLE addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('home', 'work', 'other')),
    addressLine1 TEXT NOT NULL,
    addressLine2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================
-- Restaurants
-- ============================
CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    opening_hours TEXT, -- JSON string {day: "open-close"}
    min_order_amount REAL NOT NULL,
    delivery_fee REAL NOT NULL,
    avg_prep_time INTEGER NOT NULL, -- in minutes
    status TEXT CHECK(status IN ('open','closed')) DEFAULT 'open',
    rating REAL DEFAULT 0
);

-- ============================
-- Menu Categories
-- ============================
CREATE TABLE menu_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    display_order INTEGER,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- ============================
-- Menu Items
-- ============================
CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    isVeg BOOLEAN DEFAULT 1,
    isAvailable BOOLEAN DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- ============================
-- Cart
-- ============================
CREATE TABLE cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    specialInstructions TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (item_id) REFERENCES menu_items(id)
);

-- ============================
-- Orders
-- ============================
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    address_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('placed','confirmed','preparing','ready','out_for_delivery','delivered','cancelled')) NOT NULL,
    total_amount REAL NOT NULL,
    delivery_fee REAL NOT NULL,
    payment_method TEXT NOT NULL,
    specialInstructions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id)
);

-- ============================
-- Order Items
-- ============================
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (item_id) REFERENCES menu_items(id)
);

-- ============================
-- Delivery Partners
-- ============================
CREATE TABLE delivery_partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT CHECK(status IN ('available','busy')) DEFAULT 'available',
    latitude REAL,
    longitude REAL
);

-- ============================
-- Order Tracking
-- ============================
CREATE TABLE order_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ============================
-- Payments
-- ============================
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    method TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending','completed','failed')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ============================
-- Reviews
-- ============================
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    restaurantRating INTEGER CHECK(restaurantRating BETWEEN 1 AND 5),
    foodRating INTEGER CHECK(foodRating BETWEEN 1 AND 5),
    deliveryRating INTEGER CHECK(deliveryRating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
