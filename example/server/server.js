require('source-map-support/register');

const Loopback = require('loopback');
const LoopbackBoot = require('loopback-boot');
const app = module.exports = Loopback();

const DocusignConnector = require('../../build');

app.start = () => {
  // start the web server
  return app.listen(() => {
    app.emit('started');
    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log(`Web server listening at: ${baseUrl}`);
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log(`Browse your REST API at ${baseUrl}${explorerPath}`);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
LoopbackBoot(app, {
  appRootDir: __dirname,
  dataSources: require('./datasources')
}, (err) => {
  if (err) {
    throw err;
  }

  console.log('Hello world');

  // const DataSource = require('loopback-datasource-juggler').DataSource;
  // const dsDocusign = new DataSource(DocusignConnector, {
  //   integrator_key: process.env.DOCUSIGN_INTEGRATOR_KEY,
  //   email: process.env.DOCUSIGN_EMAIL,
  //   password: process.env.DOCUSIGN_PASSWORD,
  //   env: process.env.DOCUSIGN_ENV
  // });
  // Loopback.Docusign.attachTo(dsDocusign);

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});
