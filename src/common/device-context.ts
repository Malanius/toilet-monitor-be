import type { Context } from 'aws-lambda';

export interface DeviceContext extends Context {
  deviceId?: string;
  deviceName?: string;
}
