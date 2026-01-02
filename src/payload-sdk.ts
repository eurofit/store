import type { Config } from '@/payload-types';
import { PayloadSDK } from '@payloadcms/sdk';
import { site } from './constants/site';

export const payloadSDK = new PayloadSDK<Config>({
  baseURL: site.url + '/payload/api',
});
