import { Context } from 'aws-lambda';

export interface DeviceContext extends Context {
  deviceName?: string;
}
