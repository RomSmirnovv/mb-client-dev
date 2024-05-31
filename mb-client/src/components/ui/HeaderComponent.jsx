import { Layout } from 'antd';
const { Header } = Layout;
import inMemoryJWT from '../../services/inMemoryJWT.js';
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react';
import { fetchUserByProfile } from '../../services/UserService.js';
import Notification from './Notification.jsx'

const HeaderComponent = () => {

	return (
		<>
			<Header
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<img src="/src/assets/images/logo.png" alt="Movsbuild" width='60px' />
				{/* <Notification socket={socket} userRole={userRole} userId={authorId} userName={userName} /> */}
				<div className='user-name'>
					<span>Смирнов</span>
					<span>Роман</span>
				</div>
			</Header >
		</>
	);
}

export default HeaderComponent;