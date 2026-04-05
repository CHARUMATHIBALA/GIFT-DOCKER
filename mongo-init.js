// MongoDB initialization script
db = db.getSiblingDB('giftshop');

// Create a user for the application
db.createUser({
  user: 'giftshop_user',
  pwd: 'giftshop_password',
  roles: [
    {
      role: 'readWrite',
      db: 'giftshop'
    }
  ]
});

// Create initial collections and indexes if needed
db.createCollection('products');
db.createCollection('orders');
db.createCollection('users');

print('Database initialized successfully');
