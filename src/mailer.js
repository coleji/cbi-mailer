import nodemailer from 'nodemailer';

export default function() {

  var smtpConfig = {
      host: 'localhost',
      port: 25,
      auth: {
          user: 'donotreply@community-boating-promo.org'  // TODO: pull out into config
      }
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  transporter.verify(function(error, success) {
     if (error) {
          console.log(error);
     } else {
          console.log('Server is ready to take our messages');
     }
  });

};
