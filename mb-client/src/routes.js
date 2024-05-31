import {
	DASHBOARD_ROUTE,
	CONTRACT_ROUTE,
} from './utils/consts';
import Dashboard from './pages/Dashboard';
import Contract from './pages/Contract/Contract';

export const publicRoutes = [
	{
		path: DASHBOARD_ROUTE,
		Component: Dashboard
	},
	{
		path: CONTRACT_ROUTE,
		Component: Contract
	},
]