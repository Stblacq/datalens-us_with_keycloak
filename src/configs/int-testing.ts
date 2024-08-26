import {AuthPolicy} from '@gravity-ui/expresskit';
import {AppConfig} from '@gravity-ui/nodekit';
import {AuthType} from '../const';

export default {
    authType: AuthType.Zitadel,
    accessServiceEnabled: true,
    appAuthPolicy: AuthPolicy.required,
} as Partial<AppConfig>;
