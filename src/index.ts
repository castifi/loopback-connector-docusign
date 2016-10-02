import { ILoopbackConnector, DataSource } from './custom-typings';
import * as Docusign from 'docusign-esign';
import { LoginAccount, IEnvelopeSummary } from 'docusign-esign';
import Loopback = require('loopback');

export interface IDataSourceSettings {
  integrator_key: string;
  email: string;
  password: string;
  env: string;
}

export interface IRecipient {
  id?: string;
  email: string;
  name: string;
  role: string;
}

export class DocusignConnector {
  integratorKey: string;
  email: string;
  password: string;
  env: string | 'demo';

  client: any;
  static account: LoginAccount;

  static customRoutes = {
    baseUrl: 'docusign-callback'
  };

  constructor (settings: IDataSourceSettings) {
    this.integratorKey = settings.integrator_key;
    this.email = settings.email;
    this.password = settings.password;
    this.env = settings.env;

    // initialize the api client
    this.client = new Docusign.ApiClient();
    this.client.setBasePath(`https://${this.env}.docusign.net/restapi`);

    // create JSON formatted auth header
    const creds = JSON.stringify({
      Username: this.email,
      Password: this.password,
      IntegratorKey: this.integratorKey
    });
    this.client.addDefaultHeader('X-DocuSign-Authentication', creds);

    // assign api client to the Configuration object
    Docusign.Configuration.default.setDefaultApiClient(this.client);

    // login call available off the AuthenticationApi
    let authApi = new Docusign.AuthenticationApi();

    // login has some optional parameters we can set
    let loginOps = new authApi.LoginOptions();
    loginOps.setApiPassword('true');
    loginOps.setIncludeAccountIdGuid('true');
    authApi.login(loginOps, (err, loginInfo, response) => {
      if (err) {
        throw new Error(err);
      }
      if (loginInfo) {
        // list of user account(s)
        // note that a given user may be a member of multiple accounts
        // TODO: Figure out what repurcusions multiple accounts may have
        DocusignConnector.account = loginInfo.getLoginAccounts()[0];
      }
    });
  }

  static initialize (datasource: DataSource<IDataSourceSettings>, callback: () => any) {
    datasource.connector = new DocusignConnector(datasource.settings);
    Loopback.Docusign = datasource.connector;

    // const router = Loopback().loopback.Router();
    //
    // router.get(`/${DocusignConnector.customRoutes.baseUrl}/`, (req, res) => {
    //   console.log(req);
    //   res.json({state: '👍'});
    // });
    //
    // Loopback().use(router);

    return callback();
  }

  DataAccessObject = DocusignConnector.account;

  sendTemplatedDocument (template: {id: string}, recipient: IRecipient, message: {subject: string}): Promise<IEnvelopeSummary> {
    return new Promise<IEnvelopeSummary>((resolve, reject) => {
      // create a new envelope object that we will manage the signature request through
      let envDef = new Docusign.EnvelopeDefinition();
      envDef.setEmailSubject(message.subject);
      envDef.setTemplateId(template.id);

      // create a template role with a valid templateId and roleName and assign signer info
      let tRole = new Docusign.TemplateRole();
      tRole.setRoleName(recipient.role);
      tRole.setName(recipient.name);
      tRole.setEmail(recipient.email);

      // create a list of template roles and add our newly created role
      let templateRolesList = [];
      templateRolesList.push(tRole);

      // assign template role(s) to the envelope
      envDef.setTemplateRoles(templateRolesList);

      // send the envelope by setting |status| to 'sent'. To save as a draft set to 'created'
      envDef.setStatus('sent');

      // instantiate a new EnvelopesApi object
      let envelopesApi = new Docusign.EnvelopesApi();

      // call the createEnvelope() API
      envelopesApi.createEnvelope(DocusignConnector.account.accountId, envDef, null, (err, envelopeSummary, response) => {
        if (err) {
          reject(new Error(err));
        }

        resolve(envelopeSummary);
      });
    });
  }

  getDocumentEmbedUrl (template: {id: string}, recipient: IRecipient, message: {subject: string}): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (recipient.id == null) {
        return reject(new Error('recipient.id is not defined'));
      }

      // create a new envelope object that we will manage the signature request through
      let envDef = new Docusign.EnvelopeDefinition();
      envDef.setEmailSubject(message.subject);
      console.log(template.id);
      envDef.setTemplateId(template.id);

      // create a template role with a valid templateId and roleName and assign signer info
      let tRole = new Docusign.TemplateRole();
      tRole.setRoleName(recipient.role);
      tRole.setName(recipient.name);
      tRole.setEmail(recipient.email);
      tRole.setClientUserId(recipient.id);

      // create a list of template roles and add our newly created role
      let templateRolesList: Docusign.TemplateRole[] = [];
      templateRolesList.push(tRole);

      // assign template role(s) to the envelope
      envDef.setTemplateRoles(templateRolesList);

      // const signer = new Docusign.Signer();
      // signer.setEmail(recipient.email);
      // signer.setName(recipient.name);
      // signer.setRecipientId(recipient.id);
      //
      // envDef.setRecipients(new Docusign.Recipients());
      // envDef.getRecipients().setSigners([]);
      // envDef.getRecipients().getSigners().push(signer);

      // send the envelope by setting |status| to 'sent'. To save as a draft set to 'created'
      envDef.setStatus('sent');

      // instantiate a new EnvelopesApi object
      let envelopesApi = new Docusign.EnvelopesApi();

      // call the createEnvelope() API
      envelopesApi.createEnvelope(DocusignConnector.account.accountId, envDef, null, (err, envelopeSummary, response) => {
        if (err || envelopeSummary.errorCode) {
          reject(new Error(err || envelopeSummary.errorCode));
        }

        const returnUrl = new Docusign.RecipientViewRequest();
        returnUrl.setReturnUrl(`${process.env.PROTOCOL}://${process.env.HOSTNAME}/docusign-callback`);
        returnUrl.setAuthenticationMethod('email');

        // recipient information must match embedded recipient info we provided in step #2
        returnUrl.setEmail(recipient.email);
        returnUrl.setUserName(recipient.name);
        returnUrl.setRecipientId(recipient.id);
        returnUrl.setClientUserId(recipient.id);

        envelopesApi.createRecipientView(DocusignConnector.account.accountId, envelopeSummary.envelopeId, returnUrl, (err, viewUrl, response) => {
          resolve(viewUrl.url);
        });
      });

    });
  }
}
