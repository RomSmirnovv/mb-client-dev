import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const onFinish = (values) => {
	console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
	console.log('Failed:', errorInfo);
};

const SignIn = () => {
	const { handleSignIn } = useContext(AuthContext)

	return (
		<Row>
			<Col md={8} offset={6} className='mt-4'>
				<h2 className='text-center mb-3'>Вход в аккаунт</h2>
				<Form
					name="basic"
					labelCol={{
						span: 8,
					}}
					wrapperCol={{
						span: 16,
					}}
					style={{
						maxWidth: 600,
					}}
					initialValues={{
						remember: true,
					}}
					onFinish={handleSignIn}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item
						label="Логин (89099990909)"
						name="login"
						rules={[
							{
								required: true,
								message: 'Пожалуйста введите Ваш логин!',
								whitespace: true,
							},
							{
								min: 11,
								message: 'Логин должен быть не менее 11 символов'
							},
							{
								max: 11,
								message: 'Логин должен быть не более 11 символов'
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Пароль"
						name="password"
						rules={[
							{
								required: true,
								message: 'Пожалуйста введите Ваш пароль!',
							},
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						name="remember"
						valuePropName="checked"
						wrapperCol={{
							offset: 8,
							span: 16,
						}}
					>
						<Checkbox>Запомнить меня</Checkbox>
					</Form.Item>

					<Form.Item
						wrapperCol={{
							offset: 8,
							span: 16,
						}}
					>
						<Button type="primary" htmlType="submit">
							Войти
						</Button>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
}

export default SignIn;