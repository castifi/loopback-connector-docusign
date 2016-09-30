export class DataSource<IDataSourceSettings> {
  settings: IDataSourceSettings;
  connector: any;
  ObjectID: any;
}

export interface ILoopbackConnector<IDataSourceSettings> {
  initialize (datasource: DataSource<IDataSourceSettings>, callback: () => any): void;
}
