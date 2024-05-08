const nodemailer = require("nodemailer");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "teamwissenmonk@gmail.com",
    pass: "epuxzoofdgvonjah",
  },
});

// Function to generate OTP
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Middleware to send OTP via email
const sendOtp = async (req, res, next) => {
  try {
    const otp = generateOTP();
    myCache.set("otp", otp, 1200);
    const { email } = req.body;

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Team Wissenmonk" <teamwissenmonk@gmail.com>',
      to: email,
      subject: "Your required OTP for signup",
      text: `Your OTP is ${otp}`,
    });

    console.log("OTP email sent successfully to:", email);
    next();
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).send("Failed to send OTP email");
  }
};

// Middleware to verify OTP
const verifyOtp = async (req, res, next) => {
  
    const { otp } = req.body;
    
    const dumped = myCache.get("otp");
    
    let valid
    if (otp == dumped) {
      valid = true
      req.body.valid =valid
      next()
    } 
    else {
      valid = false
      req.body.valid = false
    }
};

module.exports = { sendOtp, verifyOtp };
