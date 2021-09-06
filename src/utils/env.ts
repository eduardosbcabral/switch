// for details see https://github.com/motdotla/dotenv/blob/master/examples/typescript/
import { resolve } from 'path'
import { config } from 'dotenv'

const pathToConfig = '../../.env';
config({ path: resolve(__dirname, pathToConfig) });


process.env.AZURE_DNS = process.env.AZURE_DNS_OPTIONAL || process.env.AZURE_DNS

console.log('Azure dns: ', process.env.AZURE_DNS);
