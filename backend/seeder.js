const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Products");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

// Function to seed data

const seedData = async () => {
  try {
    // clear    existing    data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create default admin User;
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@create.com",
      password: "123456",
      role: "admin",
    });

    // Asign the default user ID to each product
    const userID = createdUser._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    // Insert the products to the database
    await Product.insertMany(sampleProducts);

    console.log("Product Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.log("Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();
