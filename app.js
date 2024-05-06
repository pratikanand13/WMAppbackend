const express = require("express");
const app = express();
const bodyParser = require("body-parser"); // Corrected typo in bodyParser
const port = process.env.PORT || 3001;

const userRouter = require("./src/Routes/user");
require("./src/db/mongoose");
const User = require("./src/models/user");

app.use(express.json());

app.use(userRouter); // Router middleware

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
