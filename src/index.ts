import { ILoopbackConnector, DataSource } from './custom-typings';
import * as Docusign from 'docusign-esign';
import { LoginAccount } from 'docusign-esign';

export interface IDataSourceSettings {
  integrator_key: string;
  email: string;
  password: string;
  env: string;
}

export interface IRecipient {
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
    return callback();
  }

  DataAccessObject = Docusign;

  sendTemplatedDocument (template: {id: string}, recipient: IRecipient, message: {subject: string}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
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

        console.log('EnvelopeSummary:');
        console.log(envelopeSummary);

        resolve();
      });
    });
  }
}
