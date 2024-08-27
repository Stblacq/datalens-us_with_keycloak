import {AppConfig} from '@gravity-ui/nodekit';
import {AuthPolicy} from '@gravity-ui/expresskit';
import {AuthType, US_MASTER_TOKEN_HEADER} from '../const';
import Utils from '../utils';

export default {
    appName: 'united-storage',

    appSocket: 'dist/run/server.sock',

    expressTrustProxyNumber: 3,
    expressBodyParserJSONConfig: {
        limit: '50mb',
    },
    expressBodyParserURLEncodedConfig: {
        limit: '50mb',
        extended: false,
    },
    authType: Object.values(AuthType).includes(Utils.getEnvVariable('AUTH_TYPE') as AuthType)
        ? (Utils.getEnvVariable('AUTH_TYPE') as AuthType)
        : AuthType.None,

    appAuthPolicy: (Utils.getEnvVariable('AUTH_TYPE') &&
                    Object.values(AuthType).includes(Utils.getEnvVariable('AUTH_TYPE') as AuthType) &&
                    Utils.getEnvVariable('AUTH_TYPE') !== AuthType.None)
        ? AuthPolicy.required : AuthPolicy.disabled,

    accessServiceEnabled: (Utils.getEnvVariable('AUTH_TYPE') &&
                    Object.values(AuthType).includes(Utils.getEnvVariable('AUTH_TYPE') as AuthType) &&
                    Utils.getEnvVariable('AUTH_TYPE') !== AuthType.None)
        ? true : false,

    keycloakClientId: Utils.getEnvVariable('KEYCLOAK_CLIENT_ID') || '',
    keycloakSecretKey: Utils.getEnvVariable('KEYCLOAK_SECRET_KEY') || '',
    keycloakUri: Utils.getEnvVariable('KEYCLOAK_URI') || '',
    keycloakRealmName: Utils.getEnvVariable('KEYCLOAK_REALM_NAME') || '',
    keycloakCookieSecret: Utils.getEnvVariable('KEYCLOAK_COOKIE_SECRET') || '',

    appSensitiveKeys: [US_MASTER_TOKEN_HEADER],

    zitadelUri: Utils.getEnvVariable('ZITADEL_URI') || 'http://localhost:8080',

    clientId: Utils.getEnvVariable('CLIENT_ID') || '',
    clientSecret: Utils.getEnvVariable('CLIENT_SECRET') || '',

    multitenant: false,
    tenantIdOverride: 'common',

    dlsEnabled: false,
    accessBindingsServiceEnabled: false,

    masterToken: Utils.getEnvTokenVariable('MASTER_TOKEN'),

    features: {},

    debug: Utils.isTrueArg(Utils.getEnvVariable('DEBUG')),
} as Partial<AppConfig>;
