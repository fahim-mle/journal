// MongoDB initialization script
db = db.getSiblingDB('mern_boilerplate');

// Create a test user
db.users.insertOne({
  name: "Test User",
  email: "test@example.com",
  password: "$2b$10$dummy.hash.for.initial.user", // This would be properly hashed in real app
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

print("Database initialized successfully!");