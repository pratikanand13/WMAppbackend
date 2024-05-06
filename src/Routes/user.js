const express = require("express");

const multer = require("multer");
const sharp = require("sharp");
const sendOtp = require('../middleware/otp')
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

router.post("/user/signUp", upload.single("avatar"),sendOtp, async (req, res) => {
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
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
