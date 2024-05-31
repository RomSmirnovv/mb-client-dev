import { Button, Select, Col, Form, Input, Row } from 'antd';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const onFinishFailed = (errorInfo) => {
	console.log('Failed:', errorInfo);
};

const SignUp = () => {
	const { handleSignUp } = useContext(AuthContext)

	const onFinish = (values) => {
		let user = values
		user.role = [user.role]
		handleSignUp(user)
	}

	return (
		<Row>
			<Col md={8} offset={6} className='mt-4'>
				<h2 className='text-center mb-3'>Регистрация пользователя</h2>
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
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item
						label="Роль пользователя"
						name="role" >
						<Select>
							<Select.Option value="2">Генеральный директор</Select.Option>
							<Select.Option value="3">Операционный директор</Select.Option>
							<Select.Option value="4">Инженер ПТО</Select.Option>
							<Select.Option value="5">Руководитель производства</Select.Option>
							<Select.Option value="6">Руководитель проекта</Select.Option>
							<Select.Option value="7">Бригадир</Select.Option>
							<Select.Option value="8">Мастер</Select.Option>
							<Select.Option value="9">Разнорабочий</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="Фамилия"
						name="surname"
						rules={[
							{
								required: true,
								message: 'Пожалуйста введите Фамилию!',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Имя"
						name="name"
						rules={[
							{
								required: true,
								message: 'Пожалуйста введите Имя!',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Отчество"
						name="patronymic"
						rules={[
							{
								required: true,
								message: 'Пожалуйста введите Отчество!',
							},
						]}
					>
						<Input />
					</Form.Item>
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
						wrapperCol={{
							offset: 8,
							span: 16,
						}}
					>
						<Button type="primary" htmlType="submit">
							Зарегистрировать
						</Button>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
}

export default SignUp;