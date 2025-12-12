export interface ISqlCodePayload {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  SQLCode: string;
  selections?: { column: string; func?: string; alias?: string }[];
  topN?: number;
}

export interface ISqlData {
  CodeID: string;
  ClientIP: string;
  Host: string;
  Port: string;
  UserName: string;
  PWD: string;
  DBName: string;
  SQLCode: string;
}
