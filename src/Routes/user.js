const express = require("express");
const NodeCache = require("node-cache");


const multer = require("multer");
const sharp = require("sharp");
const otp = require("../middleware/otp");
const auth = require("../middleware/userAuth");
const User = require("../models/user");

const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a image"));
    }
    cb(undefined, true);
  },
});

router.post("/user/signUp/userInput",upload.single("avatar"),otp.sendOtp,async (req, res) => {
    try {
      if (req.file) {
        const buffer = await sharp(req.file.buffer)
          .resize({ width: 250, height: 250 })
          .png()
          .toBuffer();
        req.body.avatar = buffer;
      }
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }
);

router.post("/user/signUp/verifyOtp", otp.verifyOtp, async (req, res) => {
  try {
    
    const { user ,token } = req.body;
    
    if (req.body.valid) {
      res.status(200).send({ user, token });
    } else {
      await User.deleteOne({ _id: req.user._id });
      res.status(200).send("User deleted succesfully");
    }
  } catch (e) {
    res.status(401).send(e.message);
  }
});
router.post("/user/login", auth, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(202).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;
