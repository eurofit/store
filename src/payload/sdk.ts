import { PayloadSDK } from '@payloadcms/sdk';
import { site } from '../constants/site';
import type { Config } from './types';

export const payloadSDK = new PayloadSDK<Config>({
  baseURL: site.url + '/payload/api',
});
