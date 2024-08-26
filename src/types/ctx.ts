import {PrivatePermissions} from './models';
import {ResourceServiceUser, ResourceUserRole} from './zitadel';

export type UserCtxInfo = {
    userId: string;
    login: string;
};

export type CtxInfo = {
    requestId: string;
    tenantId: string;
    workbookId?: string;
    user: UserCtxInfo;
    isPrivateRoute: boolean;
    dlContext: string;
    onlyPublic: boolean;
    onlyMirrored?: boolean;
    privatePermissions: PrivatePermissions;
    projectId: string | null;
    serviceUser?: ResourceServiceUser;
    zitadelUserRole?: ResourceUserRole;
};
