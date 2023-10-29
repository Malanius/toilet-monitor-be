import { AppEnv } from '../constants/app-info';

export const powertoolsConfig = (
  appName: string,
  appEnv: AppEnv,
  serviceName: string
): { [key: string]: string } => {
  return {
    APP_NAME: appName,
    APP_ENV: appEnv,
    POWERTOOLS_SERVICE_NAME: `${appName}-${appEnv}-${serviceName}`,
    POWERTOOLS_LOGGER_LOG_EVENT: appEnv === AppEnv.PROD ? 'false' : 'true',
    LOG_LEVEL: appEnv === AppEnv.PROD ? 'WARN' : 'DEBUG',
  };
};

export const powertoolsLayerArn = (region: string): string => {
  return `arn:aws:lambda:${region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:21`;
};
