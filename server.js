import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from './src/routers/auth.route.js';
import categoryRouter from './src/routers/category.route.js';
import productRouter from './src/routers/product.route.js';
import panierRouter from './src/routers/panier.route.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World modifier!");
});

// Routes API
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/cart",panierRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Categories API: http://localhost:${PORT}/api/categories`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
});
