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
