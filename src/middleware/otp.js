const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "teamwissenmonk@gmail.com",
    pass: "epuxzoofdgvonjah",
  },
});
function generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string
}

const otp = generateOTP();

const sendOtp = async (req,res,next) => {
    console.log(req.body)
  // send mail with defined transport object
  const { email } = req.body
  const info = await transporter.sendMail({
    from: '"Team Wissenmonk" <teamwissenmonk@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Your required otp for signup", // Subject line
    text: `your otp is ${otp}`, // plain text body
    
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}



module.exports = sendOtp
