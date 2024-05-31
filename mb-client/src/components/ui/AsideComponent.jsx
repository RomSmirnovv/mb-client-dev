import { Layout, Menu, theme } from 'antd';
import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
	FolderAddOutlined,
	ContactsOutlined,
} from '@ant-design/icons';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import inMemoryJWT from '../../services/inMemoryJWT';
import { jwtDecode } from 'jwt-decode'
import { isMobile } from 'react-device-detect'

const { Sider } = Layout;
function getItem(label, key, icon, children) {
	return {
		key,
		icon,
		children,
		label,
	};
}

const AsideComponent = () => {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(isMobile ? true : false)
	const items = [
		getItem('Главная', '1', <DesktopOutlined />),
		getItem('Договор', '13', <PieChartOutlined />),
		getItem('Проекты', '2', <PieChartOutlined />),
		getItem('Команда', 'sub2', <TeamOutlined />, [getItem('Бригады', '6'), getItem('Орг. структура', '8')]),
		getItem('Клиенты', '11', <ContactsOutlined />),
		getItem('Файлы', '9', <FileOutlined />),
		getItem('Добавить заявку', '10', <FolderAddOutlined />),
	];



	const onClick = (e) => {
		switch (e.key) {
			case '1': navigate("/", { replace: true })
				break;
			case '2': navigate("/projects", { replace: true })
				break;
			case '10': navigate("/aplication", { replace: true })
				break;
			case '11': navigate("/clients", { replace: true })
				break;
			case '12': navigate("/notification-list", { replace: true })
				break;
			case '13': navigate("/contract", { replace: true })
				break;
			case '4': handleLogOut()
				break;
		}
	};

	return (
		<>
			<Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
				<Menu onClick={onClick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
			</Sider>
		</>
	);
}

export default AsideComponent;