INSERT INTO product (name, brand, category, description, image_url, price, stock)
SELECT 'Mechanical Keyboard', 'Keychron', 'Accessories',
       'Compact mechanical keyboard with hot-swappable switches.',
       'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
       89.99, 12
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Mechanical Keyboard');

INSERT INTO product (name, brand, category, description, image_url, price, stock)
SELECT 'Wireless Headphones', 'Sony', 'Audio',
       'Wireless headphones with noise cancellation and long battery life.',
       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
       199.99, 8
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Wireless Headphones');

INSERT INTO product (name, brand, category, description, image_url, price, stock)
SELECT 'Gaming Monitor', 'LG', 'Displays',
       '27-inch monitor with a sharp image and a fast refresh rate.',
       'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
       299.99, 5
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Gaming Monitor');

INSERT INTO product (name, brand, category, description, image_url, price, stock)
SELECT 'Wireless Mouse', 'Logitech', 'Accessories',
       'Comfortable wireless mouse with programmable buttons.',
       'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80',
       39.99, 18
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Wireless Mouse');

INSERT INTO product (name, brand, category, description, image_url, price, stock)
SELECT 'USB-C Docking Station', 'Anker', 'Accessories',
       'A compact dock with multiple ports for a modern workstation.',
       'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80',
       79.99, 9
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'USB-C Docking Station');

INSERT INTO product (name, brand, category, description, image_url, price, stock)
SELECT 'Portable SSD', 'Samsung', 'Storage',
       'Fast external solid-state drive for backups and file transfers.',
       'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
       119.99, 14
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Portable SSD');

INSERT INTO product (name, brand, category, description, image_url, price, stock)
SELECT 'Webcam', 'Logitech', 'Cameras',
       'Full HD webcam for video calls, streaming, and online classes.',
       'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
       69.99, 11
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Webcam');

INSERT INTO product (name, brand, category, description, image_url, price, stock)
SELECT 'Laptop Stand', 'Rain Design', 'Office',
       'Adjustable aluminum stand that improves desk ergonomics.',
       'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=800&q=80',
       54.99, 7
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = 'Laptop Stand');
