import nodemailer from 'nodemailer';

const smtpConfig = {
	host: 'localhost',
	port: 25,
	useTLS: false,
	ignoreTLS: true
};

const transporter = nodemailer.createTransport(smtpConfig);

transporter.verify(function(error, success) {
   if (error) {
		console.log(error);
   } else {
		console.log('Server is ready to take our messages');
   }
});

export default function(mailData) {
//  var mailData = {
//    from: 'donotreply@community-boating-promo.org',
//    to: 'test@example.com',
//    subject: 'Message title',
//    text: 'Plaintext version of the message',
//    html: 'HTML version of the message'
//  };

  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('sent!');
    }
  })
};
