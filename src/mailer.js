import nodemailer from 'nodemailer';
import ssl from 'ssl-root-cas/latest';

ssl.inject();
ssl.addFile('/etc/ssl/digicert/DigiCertCA.crt');
ssl.addFile('/etc/ssl/digicert/TrustedRoot.crt');

export default function() {

  var smtpConfig = {
      host: 'localhost',
      port: 25,
      useTLS: false,
      ignoreTLS: true
//      auth: {
//          user: 'donotreply@community-boating-promo.org'  // TODO: pull out into config
//      }
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  transporter.verify(function(error, success) {
     if (error) {
          console.log(error);
     } else {
          console.log('Server is ready to take our messages');
     }
  });

  console.log('made it here');

};
