declare module 'loopback-boot' {
  interface IBootOptions {
    appRootDir?: string;
    appConfigRootDir?: string;
    models?: any;
    modelDefinitions?: any[];
    dataSources?: any;
    modelsRootDir?: string;
    dsRootDir?: string;
    middlewareRootDir?: string;
    componentRootDir?: string;
    env?: string | 'development' | 'staging' | 'production';
    modelSources?: string[];
    middleware?: any;
    components?: any;
    mixinDirs?: string[];
    mixinSources?: string[];
    bootDirs?: string[];
    bootScripts?: string[];
    normalization?: string | boolean | any;
  }

  function BootFunc (app: any, options: IBootOptions | string, callback: (err: Error) => void): any;

  export = BootFunc;
}
