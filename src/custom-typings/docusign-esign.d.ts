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
    }
    class TemplateRole {
      constructor ();

      setRoleName (roleName: string): void;
      setName (name: string): void;
      setEmail (email: string): void;
    }
    class LoginAccount {
      name: string;
      accountId: string | number;
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

      createEnvelope (accountId: any, envDef: EnvelopeDefinition, unknown: any, callback: (err: string, envelopeSummary: any, response: any) => void): void;
    }
    class Configuration {
      static default: {
        setDefaultApiClient: (apiClient: ApiClient) => void;
      };
    }
    class LoginInfo {
      getLoginAccounts (): LoginAccount[];
    }
  }

  export = Docusign;
}
