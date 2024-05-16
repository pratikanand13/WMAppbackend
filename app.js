const express = require("express");
const app = express();
const bodyParser = require("body-parser"); // Corrected typo in bodyParser
const port = process.env.PORT || 3001;

const userRouter = require("./src/Routes/user");
const prodRouter = require('./src/Routes/product')
const orderRouter = require('./src/Routes/order')
const wishListRouter = require('./src/Routes/wishlist')
require("./src/db/mongoose");
const User = require("./src/models/user");
const Product = require('./src/models/products')
const Order = require('./src/models/order')
const wishList = require('./src/models/wishlist')
const orderItem = require('./src/models/order-item')

app.use(express.json());

app.use(userRouter); // Router middleware
app.use(prodRouter)
app.use(orderRouter)
app.use(wishListRouter)
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
