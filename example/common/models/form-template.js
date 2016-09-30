const Loopback = require('loopback');

module.exports = (FormTemplate) => {
  FormTemplate.prototype.send = function (to) {
    return new Promise((resolve, reject) => {
      console.log(Loopback.Docusign);
      resolve();
      // (Loopback.Docusign as DocusignConnector).sendTemplatedDocument({
      //     to: this.email,
      //     from: senderAddress,
      //     subject: subject,
      //     html: html,
      //     text: text
      //   },
      //   (err, result) => {
      //     if (err) {
      //       console.error(err);
      //       reject(err);
      //     }
      //     console.log('sent email through sendgrid');
      //     console.log(result);
      //
      //     resolve();
      //   }
      // );
    });
  };
};
