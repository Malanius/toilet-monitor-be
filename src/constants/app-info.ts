export const PROJECT = 'toimo';

export enum AppEnv {
  'DEV' = 'dev',
  'PROD' = 'prod',
}

// This can be changed to a  Map<AppEnv, cdk.Environment> to support multiple AWS accounts
export const supportedEnvs = Object.values(AppEnv);

export interface AppInfo {
  appName: string;
  appEnv: AppEnv;
}
