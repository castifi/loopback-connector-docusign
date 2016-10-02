const Loopback = require('loopback');

module.exports = (FormTemplate) => {
  FormTemplate.prototype.send = (to) => {
    console.log(to);
    return new Promise((resolve, reject) => {
      console.log(Loopback.Docusign);

      Loopback.Docusign.sendTemplatedDocument({
          id: this.id
        },
        {
          email: 'louis@orleans.io',
          name: 'louis orleans',
          role: 'Signer'
        },
        {subject: 'Docusign Test'}).then((res) => {
          console.log(res);
          resolve();
        });
    });
  };
};
