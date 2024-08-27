import {CtxInfo} from '../src/types/ctx';
import {FeaturesConfig} from '../src/components/features/types';

export interface SharedAppConfig {
    features: FeaturesConfig;
    dynamicFeaturesEndpoint?: string;

    multitenant: boolean;
    dlsEnabled: boolean;
    tenantIdOverride?: string;

    accessServiceEnabled: boolean;
    accessBindingsServiceEnabled: boolean;

    masterToken: string[];

    authType?: string;
    zitadelUri?: string;
    clientId?: string;
    clientSecret?: string;

    keycloakClientId?: string,
    keycloakSecretKey?: string,
    keycloakUri?: string,
    keycloakRealmName?: string,
    keycloakCookieSecret?: string,

}
declare module '@gravity-ui/nodekit' {
    export interface AppConfig extends SharedAppConfig {}

    interface AppDynamicConfig {
        features?: FeaturesConfig;
    }

    interface AppContextParams {
        info: CtxInfo;
    }
}

declare module '@gravity-ui/expresskit' {
    interface AppRouteParams {
        private?: boolean;
        write?: boolean;
    }
}
