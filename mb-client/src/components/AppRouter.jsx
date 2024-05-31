import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes } from '../routes';
import { DASHBOARD_ROUTE } from '../utils/consts';

const AppRouter = () => {

	return (
		<Routes>
			{publicRoutes.map(({ path, Component }) =>
				<Route
					key={path}
					path={path}
					element={<Component />}
				/>
			)}
			<Route path="*" element={<Navigate to={DASHBOARD_ROUTE} />} />
		</Routes>
	);
}

export default AppRouter;