const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'popovskyi.python@gmail.com',
      pass: 'pythonlabkr'
    }
  },
  {
    from: "Test api <popovskyi.python@gmail.com>"
  });

const mailer = async(message) => {
  try {
    const res = await transporter.sendMail(message)

    // remove this line in PROD
    console.log(res)

  } catch (err) {
    console.error(err);
    throw new Error('err in mailer')
  }
}

//use export default
module.exports = mailer;
