import axios from 'axios';

import { ENVS } from 'src/constants';

export const apiClient = axios.create();

apiClient.defaults.baseURL = ENVS.server;
