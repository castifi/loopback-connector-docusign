import { Request, Response } from 'express';

export type BuiltInTypes = 'any' | 'array' | 'boolean' | 'buffer' | 'date' | 'geopoint' | 'null' | 'number' | 'object' | 'string';
export type Verbs = 'get' | 'post' | 'patch' | 'put' | 'del' | 'all';
export type IID = number | string;
export type ObservableMethods = string | '*' | '**' | '*.*' | 'prototype.*';

export interface IFilter {
  fields?: string | any | any[];
  include?: string | any | any[];
  limit?: number;
  order?: string;
  skip?: number;
  where?: {[key: string]: any};
}

export class Conflict {
  changes (callback: (err: Error, sourceChange: IChange, targetChange: IChange) => void);
  models (callback: (err: Error, source: Model, target: Model) => void);
  resolve (callback: (err: Error) => void);
  resolveManually (data: any | void, callback: (err: Error) => void);
  resolveUsingSource (callback: (err: Error) => void);
  resolveUsingTarget (callback: (err: Error) => void);
  swapParties (): Conflict;
  type (callback: (err: Error, type: BuiltInTypes) => void);
}

export interface IRemoteMethodDefinitionArg {
  arg: any;
  description: string | string[];
  http: {
    body: any;
    form: any;
    query: any;
    path: any;
    req: Request;
    res: Response;
    context: RemoteContext;
  } | any;
  type: BuiltInTypes;
}

export interface IRemoteMethodDefinition {
  accepts?: IRemoteMethodDefinitionArg | IRemoteMethodDefinitionArg[];
  returns?: IRemoteMethodDefinitionArg | IRemoteMethodDefinitionArg[];
}

export interface IModelDefinition {
  modelBuilder: IModelBuilder;
  name: string;
  rawProperties: any;
  settings: ISettings;
  relations: any[];
  properties: {[key: string]: any};
  _ids: any[];
}

export interface ISettings {
  strict: boolean;
  base: string | 'PersistedModel';
  replaceOnPUT: boolean;
  validateUpsert: boolean;
  idInjection: boolean;
  validations: any[];
  relations: {[key: string]: any};
  acls: any[];
  methods: {[key: string]: any};
}

export interface IChangeSettings extends ISettings {
  hashAlgorithm: string;
  ignoreErrors: boolean;
}

export interface IChange {
  id: string;
  rev: string;
  prev: string;
  checkpoint: number;
  modelName: string;
  modelId: string;
  settings: IChangeSettings;
}

export interface IRegistry {
  defaultDataSources: any;
  modelBuilder: IModelBuilder;
}

export interface IModelBuilder {
  models: any[];
  definitions: any[];
  settings: ISettings;
  mixins: any[];
  defaultModelBaseClass: any[];
  _nameCount: number;
}

export interface IValidationError {
  maxPropertyStringLength: number;
}

export interface ISharedMethod {
  fn: any[];
  name: 'sharedCtor' | string;
  aliases: any[];
  isStatic: boolean;
  accepts: any[];
  returns: any[];
  errors: Error[];
  description: any | void;
  accessType: any | void;
  notes: any | void;
  documented: boolean;
  http: any[];
  rest: any;
  shared: boolean;
  sharedClass: any;
  ctor: any;
  sharedCtor: any | void;
  isSharedCtor: boolean;
  stringName: string;
}

export interface ISharedClass {
  name: string;
  ctor: any[];
  http: {path: string; };
  sharedCtor: ISharedMethod;
}

export class Model {
  static afterInitialize ();
  static checkAccess ();
  static disableRemoteMethod ();
  static getApp ();
  static nestRemoting ();
  static remoteMethod (name: string, definition: IRemoteMethodDefinition);
  static setup ();
}

export class PersistedModel extends Model {
  static bulkUpdate (updates: any[], callback: () => void);
  static changes (since: number, filter: IFilter, callback: (err: Error, changes: IChange[]) => void);
  static checkpoint (callback: () => void);
  static count (callback: (err: Error, count: number) => void);
  static count (where: IFilter, callback: (err: Error, count: number) => void);
  static create (callback: (err: Error, count: number) => void);
  static create (instance: any, callback: (err: Error, count: number) => void);
  static createChangeStream (options: {where: IFilter}, callback: (err: Error, changes: any) => void);
  static createUpdates (deltas: any[], callback: () => void);
  static currentCheckpoint (callback: (err: Error, currentCheckpointId: number) => void);
  static destroyAll (callback: (err: Error, info: {count: number}) => void);
  static destroyAll (where: IFilter, callback: (err: Error, info: {count: number}) => void);
  static destroyById (id: IID, callback: (err: Error) => void);
  static diff (since: number, remoteChanges: IChange[], callback: (err: Error, results: any) => void);
  static enableChangeTracking (): void;
  static exists (id: IID, callback: (err: Error, exists: boolean) => void);
  static find (callback: (err: Error, models: Model[]) => void);
  static find (filter: IFilter, callback: (err: Error, models: Model[]) => void);
  static findById (id: IID, callback: (err: Error, instance: Model) => void);
  static findById (id: IID, filter: IFilter, callback: (err: Error, instance: Model) => void);
  static findOne (callback: (err: Error, instance: Model) => void);
  static findOne (filter: IFilter, callback: (err: Error, instance: Model) => void);
  static findOrCreate (data: any, callback: (err: Error, instance: Model) => void);
  static findOrCreate (filter: IFilter, data: any, callback: (err: Error, instance: Model) => void);
  static getChangeModel (): IChange;
  static getIdName (): string;
  static getSourceId (callback: (err: Error, sourceId: string) => void);
  static handleChangeError (err: Error);
  static rectifyChange (id: string | number, callback: () => void);
  static replaceById (id: IID, data: any, options: {validate: boolean; }, callback: (err: Error, instance: Model) => void);
  static replaceOrCreate (data: Model, options: {validate: boolean; }, callback: (err: Error, model: Model) => void);
  static replicate (since: number, targetModel: Model, options: any, optionsFilter: any, callback: (err: Error, conflicts: Conflict[]) => void);
  static updateAll (where: IFilter, data: any, callback: (err: Error, info: {count: number; }) => void);
  static upsert (data: any, callback: (err: Error, model: Model) => void);
  static upsertWithWhere (data: any, callback: (err: Error, model: Model) => void);

  destroy (callback: () => void);
  getId (): string | number;
  getIdName (): string;
  isNewRecord (): boolean;
  reload (callback: (err: Error, instance: any) => void);
  replaceAttributes (data: any, callback: (err: Error, instance: Model) => void);
  save (options?: {validate?: boolean; throws?: boolean; }, callback?: (err: Error, obj: any) => void): Promise<Error>;
  setId (val: any);
  updateAttribute (name: string, value: any, callback: (err: Error, instance: any) => void);
  updateAttributes (data: any, callback: (err: Error, instance: any) => void);
  [propName: string]: any;
}

export class ModelConfig<Model> {
  afterRemote (methodName: ObservableMethods, observer: (ctx: RemoteContext, next: (err) => void) => void);
  afterRemote (methodName: ObservableMethods, observer: (ctx: RemoteContext, modelInstance: Model, next: (err) => void) => void);
  afterRemoteError (methodName: ObservableMethods, observer: (ctx: RemoteContext, next: (err) => void) => void);
  beforeRemote (methodName: ObservableMethods, observer: (ctx: RemoteContext, next: (err) => void) => void);
  beforeRemote (methodName: ObservableMethods, observer: (ctx: RemoteContext, modelInstance: Model, next: (err) => void) => void);
  bulkUpdate (updates: any[], callback: () => void);
  changes (since: number, filter: IFilter, callback: (err: Error, changes: IChange[]) => void);
  checkpoint (callback: () => void);
  count (callback: (err: Error, count: number) => void);
  count (where: IFilter, callback: (err: Error, count: number) => void);
  create (callback: (err: Error, count: number) => void);
  create (instance: any, callback: (err: Error, count: number) => void);
  createChangeStream (options: {where: IFilter}, callback: (err: Error, changes: any) => void);
  createUpdates (deltas: any[], callback: () => void);
  currentCheckpoint (callback: (err: Error, currentCheckpointId: number) => void);
  destroyAll (callback: (err: Error, info: {count: number}) => void);
  destroyAll (where: IFilter, callback: (err: Error, info: {count: number}) => void);
  destroyById (id: IID, callback: (err: Error) => void);
  diff (since: number, remoteChanges: IChange[], callback: (err: Error, results: any) => void);
  enableChangeTracking (): void;
  exists (id: IID, callback: (err: Error, exists: boolean) => void);
  find (callback: (err: Error, models: Model[]) => void);
  find (filter: IFilter, callback: (err: Error, models: Model[]) => void);
  findById (id: IID, callback: (err: Error, instance: Model) => void);
  findById (id: IID, filter: IFilter, callback: (err: Error, instance: Model) => void);
  findOne (callback: (err: Error, instance: Model) => void);
  findOne (filter: IFilter, callback: (err: Error, instance: Model) => void);
  findOrCreate (data: any, callback: (err: Error, instance: Model) => void);
  findOrCreate (filter: IFilter, data: any, callback: (err: Error, instance: Model) => void);
  getChangeModel (): IChange;
  getIdName (): string;
  getSourceId (callback: (err: Error, sourceId: string) => void);
  handleChangeError (err: Error);
  observe (name: string, observer: (ctx: ObserveContext<Model>, next: (err) => void) => void);
  rectifyChange (id: string | number, callback: () => void);
  remoteMethod (requestHandlerFunctionName: string, options?: RemoteMethodOptions);
  replaceById (id: IID, data: any, options: {validate: boolean; }, callback: (err: Error, instance: Model) => void);
  replaceOrCreate (data: Model, options: {validate: boolean; }, callback: (err: Error, model: Model) => void);
  replicate (since: number, targetModel: Model, options: any, optionsFilter: any, callback: (err: Error, conflicts: Conflict[]) => void);
  updateAll (where: IFilter, data: any, callback: (err: Error, info: {count: number; }) => void);
  upsert (data: any, callback: (err: Error, model: Model) => void);
  upsertWithWhere (data: any, callback: (err: Error, model: Model) => void);
}

export class RemoteMethodOptions {
  accepts: IRemoteMethodDefinitionArg | IRemoteMethodDefinitionArg[];
  description: string;
  http: {
    path: string;
    verb: Verbs;
    status: number;
    errorStatus: number;
  };
  isStatic: boolean;
  notes: string;
  returns: IRemoteMethodDefinitionArg;
}

export class RemoteContext {
  req: Request;
  results: Response;
  args: any;
}

export class ObserveContext<T> {
  isNewInstance: boolean;
  instance: T;
  currentInstance: T;
  data: T;
  hookSate: any;
  options: any;
}
