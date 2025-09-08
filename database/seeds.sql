-- ============================
-- Users
-- ============================
INSERT INTO users (name, email, password, phone) VALUES
('John Doe', 'john@example.com', 'hashed_password_123', '+911234567890'),
('Alice Smith', 'alice@example.com', 'hashed_password_456', '+919876543210');

-- ============================
-- Addresses
-- ============================
INSERT INTO addresses (user_id, type, addressLine1, addressLine2, city, state, pincode, latitude, longitude) VALUES
(1, 'home', '123 Main Street', 'Apt 4B', 'Mumbai', 'Maharashtra', '400001', 19.0760, 72.8777),
(2, 'work', '45 Tech Park', 'Block C', 'Bengaluru', 'Karnataka', '560001', 12.9716, 77.5946);

-- ============================
-- Restaurants
-- ============================
INSERT INTO restaurants (name, cuisine, description, address, latitude, longitude, opening_hours, min_order_amount, delivery_fee, avg_prep_time, status, rating) VALUES
('Spice Hub', 'Indian', 'Authentic North Indian food with modern twist', '456 Food Street, Mumbai', 19.0720, 72.8800, '{"mon-sun":"11:00-23:00"}', 200, 30, 40, 'open', 4.5),
('Pasta Palace', 'Italian', 'Freshly made pasta and pizzas', '22 Church Street, Bengaluru', 12.9750, 77.5920, '{"mon-sun":"10:00-22:00"}', 300, 40, 35, 'open', 4.2);

-- ============================
-- Menu Categories
-- ============================
INSERT INTO menu_categories (restaurant_id, name, display_order) VALUES
(1, 'Starters', 1),
(1, 'Main Course', 2),
(2, 'Pasta', 1),
(2, 'Pizza', 2);

-- ============================
-- Menu Items
-- ============================
INSERT INTO menu_items (category_id, restaurant_id, name, description, price, isVeg, isAvailable) VALUES
(1, 1, 'Paneer Tikka', 'Grilled paneer with spices', 250, 1, 1),
(2, 1, 'Butter Chicken', 'Creamy tomato gravy with chicken', 350, 0, 1),
(3, 2, 'Spaghetti Alfredo', 'Spaghetti in creamy Alfredo sauce', 400, 1, 1),
(4, 2, 'Margherita Pizza', 'Classic cheese and tomato pizza', 300, 1, 1);

-- ============================
-- Cart (sample)
-- ============================
INSERT INTO cart (user_id, restaurant_id, item_id, quantity, specialInstructions) VALUES
(1, 1, 1, 2, 'Extra spicy'),
(2, 2, 4, 1, 'Add extra cheese');

-- ============================
-- Orders
-- ============================
INSERT INTO orders (user_id, restaurant_id, address_id, status, total_amount, delivery_fee, payment_method, specialInstructions) VALUES
(1, 1, 1, 'placed', 500, 30, 'card', 'Deliver fast'),
(2, 2, 2, 'delivered', 700, 40, 'cash', 'Handle with care');

-- ============================
-- Order Items
-- ============================
INSERT INTO order_items (order_id, item_id, quantity, price) VALUES
(1, 1, 2, 250),
(2, 4, 1, 300);

-- ============================
-- Delivery Partners
-- ============================
INSERT INTO delivery_partners (name, phone, status, latitude, longitude) VALUES
('Ravi Kumar', '+919999999999', 'available', 19.0750, 72.8777),
('Suresh Singh', '+918888888888', 'busy', 12.9718, 77.5940);

-- ============================
-- Order Tracking
-- ============================
INSERT INTO order_tracking (order_id, status) VALUES
(1, 'placed'),
(1, 'confirmed'),
(1, 'preparing'),
(2, 'delivered');

-- ============================
-- Payments
-- ============================
INSERT INTO payments (order_id, method, status) VALUES
(1, 'card', 'pending'),
(2, 'cash', 'completed');

-- ============================
-- Reviews
-- ============================
INSERT INTO reviews (order_id, restaurant_id, restaurantRating, foodRating, deliveryRating, comment) VALUES
(2, 2, 5, 4, 5, 'Great taste and delivery on time!');
