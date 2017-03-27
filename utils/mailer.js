const nodemailer = require('nodemailer')
// let emailObject = {
//   to: abc@xyz.com,
//   subject: 'Testing mail',
//   body: 'This is a simple silly testing mail sent from MCKVCC'
// }
exports = module.exports = function(emailObject) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: '50daysofcode@gmail.com',
      pass: 'joysa000'
    }
  });
  const mailOptions = {
    from: 'MCKVCC',
    to: emailObject.to,
    subject: emailObject.subject,
    html: emailObject.body
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error)
      return
    }
    console.log('Message sent: ' + info.response)
  });
};
