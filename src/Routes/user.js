const express = require("express");
const NodeCache = require("node-cache");
const bcrypt = require('bcrypt')

const multer = require("multer");
const sharp = require("sharp");
const otp = require("../utils/otp");
const userAuth = require("../middleware/userAuth");
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

router.post("/user/signUp/userInput",async (req, res) => {
    try {
      otp.sendOtp(req.body.email)
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(200).send({ user });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }
);

router.post("/user/signUp/verifyOtp",  async (req, res) => {
  try {
    const check = otp.verifyOtp(req.body.otp)
    const { user ,token } = req.body;
    
    if (check) {
      res.status(200).send({ user, token });
    } else {
      await User.deleteOne({ _id: req.user._id });
      res.status(202).send("User deleted succesfully");
    }
  } catch (e) {
    res.status(401).send(e.message);
  }
});
router.post("/user/login",  async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/user/update',userAuth,upload.single('avatar'),async(req,res)=>{
  const updates = Object.keys(req.body)
  const allowedUpdates = ['userName','avatar','location','phoneNumber']
  const isValidOperation = updates.every((update)=>{
      return allowedUpdates.includes(update)
  }) 
  if(!isValidOperation) return res.status(408).send({ error: "Invalid update" })
  try{
      updates.forEach((update)=>{
          req.user[update] = req.body[update]
      })
      if(req.file){
          req.user.avatar = req.file.buffer
      }

      await req.user.save()
      res.send(req.user)
} catch (e){
  res.status(422).send(e)
}
}) 

router.delete('/user/delete',userAuth,async(req,res)=>{
  try{
      
      await User.deleteOne({_id:req.user._id})
      res.send(req.user)
  } catch(e) { 
      res.status(401).send("user deleted")
  }
})

router.post('/user/logout',userAuth,async(req,res)=>{
  try{
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token //filter function craetes an array containg tokens except the auth one
      })
      await req.user.save();
      res.status(203).send('logout success')
  }catch (e) {
    res.status(500).send()
  }
})

router.post('/user/forgotPassword/sendotp' , async (req,res) => {
  otp.sendOtp(req.body.email)
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(200).send('Change otp for password sent');
  } else {
    res.status(404).send('User not registered');
  }
  
} )

router.patch('/user/forgotPassword/finalchange' ,  async (req,res)=> {
      const check = otp.verifyOtp(req.body.email)
      if(check){
      const { email, newPassword } = req.body
      try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
  else res.staus(404).send('wrong otp entered')
})
module.exports = router;
