import { Layout } from 'antd';
import { HeartOutlined, CopyrightOutlined } from '@ant-design/icons';

const { Footer } = Layout;

const FooterComponent = () => {
	return (
		<Footer
			style={{
				textAlign: 'center',
			}}
		>
			Movsbuild App <CopyrightOutlined /> {new Date().getFullYear()}
			{/* <br /><small>Не волнуйтесь, если что-то не работает. Если бы всё работало, вас бы уволили. </small> */}
		</Footer>
	);
}

export default FooterComponent;