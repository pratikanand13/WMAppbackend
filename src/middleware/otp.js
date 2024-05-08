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

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

const otp = generateOTP();
myCache.set("otp", otp, 120);

const sendOtp = async (req, res, next) => {
  try {
    const otp = myCache.get("otp");
    if (!otp) {
      throw new Error("OTP not found in cache");
    }
    // req.body.otp = otp;
    const { email } = req.body;

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Team Wissenmonk" <teamwissenmonk@gmail.com>',
      to: email,
      subject: "Your required otp for signup",
      text: `Your otp is ${otp}`,
    });

    console.log("Message sent: %s", info.messageId);
    next();
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send("Failed to send OTP");
  }
};

const verifyOtp = async (req, res, next) => {
  const { checkOtp } = req.body;
  const otp = myCache.get("otp");
  if (checkOtp === otp) {
    return true;
  }
};

module.exports = { sendOtp, verifyOtp };
