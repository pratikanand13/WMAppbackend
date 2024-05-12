const express = require("express");
const app = express();
const bodyParser = require("body-parser"); // Corrected typo in bodyParser
const port = process.env.PORT || 3001;

const userRouter = require("./src/Routes/user");
const prodRouter = require('./src/Routes/product')
require("./src/db/mongoose");
const User = require("./src/models/user");
const Product = require('./src/models/products')

app.use(express.json());

app.use(userRouter); // Router middleware
app.use(prodRouter)

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
