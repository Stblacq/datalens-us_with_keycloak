import {ResourceUserRole} from '../../types/zitadel';
import {GetZitadelUserRole} from './types';

export const getZitadelUserRole: GetZitadelUserRole = (data: any): ResourceUserRole => {
    const scope = 'urn:zitadel:iam:org:project:roles';

    const roles = data[scope];

    if (!roles) {
        return ResourceUserRole.Viewer;
    }

    if (roles[ResourceUserRole.Admin]) {
        return ResourceUserRole.Admin;
    }

    if (roles[ResourceUserRole.Editor]) {
        return ResourceUserRole.Editor;
    }

    return ResourceUserRole.Viewer;
};
