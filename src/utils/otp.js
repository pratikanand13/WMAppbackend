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
const sendOtp = async (email) => {
  
    const otp = generateOTP();
    myCache.set("otp", otp, 1200);

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Team Wissenmonk" <teamwissenmonk@gmail.com>',
      to: email,
      subject: "Your required OTP for signup",
      text: `Your OTP is ${otp}`,
    });

    console.log("OTP email sent successfully to:", email);
    
  
};


const verifyOtp = async (otp) => {
  
    const cachedOTP = myCache.get("otp");
    if (otp === cachedOTP) {
      
      console.log("OTP verified successfully");
      return true
    } else {
      
      console.log("Invalid OTP");
      return false;
    }

    
  
};

module.exports = { sendOtp, verifyOtp };
