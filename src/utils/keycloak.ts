import {AppContext} from '@gravity-ui/nodekit';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {ResourceUserRole} from '../types/zitadel';

type IntrospectionResult = {
    active: boolean;
    userId?: string;
    username?: string;
    role?: ResourceUserRole;
};

const axiosInstance = axios.create();
axiosRetry(axiosInstance, {retries: 3});

export const introspect = async (ctx: AppContext, token?: string): Promise<IntrospectionResult> => {
    ctx.log('Token introspection');

    const {keycloakClientId, keycloakSecretKey, keycloakUri, keycloakRealmName} = ctx.config;

    try {
        if (!token) {
            throw new Error('Token not provided');
        }

        const response = await axiosInstance({
            method: 'post',
            url: `${keycloakUri}/realms/${keycloakRealmName}/protocol/openid-connect/token/introspect`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: new URLSearchParams({
                token,
                client_id: `${keycloakClientId}`,
                client_secret: `${keycloakSecretKey}`,
            }).toString(),
        });
        const {active, username, sub} = response.data;
        const role = getKeycloakUserRole(response.data);

        return {active: Boolean(active), userId: sub, username,role};
    } catch (e) {
        ctx.logError('Failed to introspect token', e);
        return {active: false};
    }
};


function getKeycloakUserRole(data: any): ResourceUserRole{
    const roles: string[] = data?.realm_access?.roles || [];

    if (roles.includes("datalens.admin")) {
        return ResourceUserRole.Admin;
    } else if (roles.includes("datalens.editor")) {
        return ResourceUserRole.Editor;
    } else {
        return ResourceUserRole.Viewer;
    }
}
