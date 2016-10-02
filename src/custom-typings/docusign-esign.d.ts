declare module 'docusign-esign' {
  namespace Docusign {
    class ApiClient {
      constructor ();

      setBasePath (baseUrl: string): void;
      addDefaultHeader(key: string | 'X-DocuSign-Authentication', value: string): void;
    }
    class AuthenticationApi {
      constructor ();

      LoginOptions(): void;
      login (options, callback: (err: string, loginInfo: LoginInfo, res) => void): void;
    }
    class EnvelopeDefinition {
      constructor ();

      setEmailSubject (subject: string): void;
      setTemplateId (id: string): void;
      setTemplateRoles (roles: TemplateRole[]): void;
      setStatus (status: string | 'sent'): void;
      setRecipients (recipents: Recipients): void;
      getRecipients (): Recipients;
    }
    class Recipients {
      constructor ();

      setSigners (signers: Signer[]): void;
      getSigners (): Signer[];
    }
    class Signer {
      constructor ();

      setEmail (email: string): void;
      setName (name: string): void;
      setRecipientId (id: string): void;
    }
    class TemplateRole {
      constructor ();

      setRoleName (roleName: string): void;
      setName (name: string): void;
      setEmail (email: string): void;
      setClientUserId (id: string): void;
    }
    class LoginAccount {
      name: string;
      accountId: string;
      accountIdGuid: any;
      baseUrl: string;
      isDefault: boolean;
      userName: string;
      userId: string | number;
      email: string;
      siteDescription: string;
      loginAccountSettings: any[];
      loginUserSettings: any[];

      constructFromObject (): void;
      getName (): string;
      setName (name: string): void;
      getAccountId (): string | number;
      setAccountId (accountId: string | number): void;
      getAccountIdGuid (): string | number;
      setAccountIdGuid (accountIdGuid: string | number): void;
      getBaseUrl (): string;
      setBaseUrl (baseUrl: string): void;
      getIsDefault (): boolean;
      setIsDefault (isDefault: boolean): void;
      getUserName (): string;
      setUserName (userName: string): void;
      getUserId (): string | number;
      setUserId (userId: string | number): void;
      getEmail (): string;
      setEmail (email: string): void;
      getSiteDescription (): string;
      setSiteDescription (siteDescription: string): void;
      getLoginAccountSettings (): any[];
      setLoginAccountSettings (loginAccountSettings: any[]): void;
      getLoginUserSettings (): any[];
      setLoginUserSettings (loginUserSettings: any[]): void;
      toJson (): any;

      constructor ();
    }
    class EnvelopesApi {
      constructor ();

      createEnvelope (accountId: any, envDef: EnvelopeDefinition, options: any, callback: (err: string, envelopeSummary: IEnvelopeSummary, response: any) => void): void;
      createRecipientView (accountId: string, envelopeId: string, returnUrl: RecipientViewRequest, callback: (error: Error, viewUrl: IViewUrl, response) => void): void;
    }
    class RecipientViewRequest {
      constructor ();

      setReturnUrl (url: string);
      setAuthenticationMethod (method: string | 'email');
      setEmail (email: string);
      setUserName (username: string);
      setRecipientId (id: string);
      setClientUserId (userId: string);
    }
    class Configuration {
      static default: {
        setDefaultApiClient: (apiClient: ApiClient) => void;
      };
    }
    class LoginInfo {
      getLoginAccounts (): LoginAccount[];
    }

    interface IEnvelopeSummary {
      envelopeId: string;
      errorCode?: string | 'RECIPIENTS_NOT_PROVIDED';
      message: string;
    }
    interface IViewUrl {
      constructFromObject (): void;
      getUrl (): string;
      setUrl (url: string): void;
      toJson (): {[key: string]: any};

      url: string;
      errorCode?: string | 'UNKNOWN_ENVELOPE_RECIPIENT';
      message: string;
    }
  }

  export = Docusign;
}
