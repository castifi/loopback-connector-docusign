const DocusignConnector = require('../../build/');

module.exports = {
  db: {
    name: 'db',
    connector: 'memory'
  },
  docusign: {
    name: 'docusign',
    connector: DocusignConnector.DocusignConnector,
    integrator_key: process.env.DOCUSIGN_INTEGRATOR_KEY,
    email: process.env.DOCUSIGN_EMAIL,
    password: process.env.DOCUSIGN_PASSWORD,
    env: process.env.DOCUSIGN_ENV
  }
};
