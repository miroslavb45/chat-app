import * as dotenv from 'dotenv';
import * as findUp from 'find-up';
import * as fs from 'fs';
// import * as path from 'path';

export let env = {};

try {
  const envFilePath = findUp.sync('.env', {
    type: 'file'
  });

  env = dotenv.parse(fs.readFileSync(envFilePath));
} catch (e) {
  console.error(`Cannot read ENV variable: ${e.message}`, e.stack, 'EnvReader');
  process.exit(1);
}

/**
 * Extract the ENV variable with the provided ENV variable name.
 * @param {string} name
 * @returns {string}
 */
function getEnv(name: string): string {
  // eslint-disable-next-line no-prototype-builtins
  if (process.env.hasOwnProperty(name)) {
    return process.env[name];
  } else {
    return env[name];
  }
}

// Export global configuration object
export const CONFIG = {

  isDevelopment: getEnv('NODE_ENV') === 'development',

  redis: {
    connectionString: `redis://:${getEnv('REDIS_PASSWORD') || 'redisPassword123'}@${getEnv('REDIS_HOST') || 'redis'}:${parseInt(getEnv('REDIS_PORT'), 10) || 6379}`,
    host: getEnv('REDIS_HOST'),
    port: parseInt(getEnv('REDIS_PORT'), 10) || 6379,
    password: getEnv('REDIS_PASSWORD') || 'r3d1s',
    database: parseInt(getEnv('REDIS_DATABASE'), 10) || 0,
    connectTimeout: 2000
  },
  mongo: {
    url: getEnv('MONGODB_CONNECTION_STRING'),
    connectionOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      // poolSize: 10
    }
  },
  firebase: {
    type: getEnv('FIREBASE_TYPE'),
    projectId: getEnv('FIREBASE_PROJECT_ID'),
    privateKeyId: getEnv('FIREBASE_PRIVATE_KEY_ID'),
    privateKey: getEnv('FIREBASE_PRIVATE_KEY'),
    clientEmail: getEnv('FIREBASE_CLIENT_EMAIL'),
    clientId: getEnv('FIREBASE_CLIENT_ID'),
    authUri: getEnv('FIREBASE_AUTH_URI'),
    tokenUri: getEnv('FIREBASE_TOKEN_URI'),
    authProviderX509CertUrl: getEnv('FIREBASE_AUTH_PROVIDER_X508_CERT_URL'),
    clientX509CertUrl: getEnv('FIREBASE_CLIENT_X509_CERT_URL'),
  },
  port: 80
};
