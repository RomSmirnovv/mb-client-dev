import { Modal, Form, Input, Button } from 'antd'
import { useEffect, useState } from 'react';
import { editClients, fetchOneClients } from '../../../services/ClientService';



const EditClient = ({ isModalOpenProp, handleOk, handleCancel, idIsModalProject }) => {
	const [client, setClient] = useState([])

	const onSubmitEditClient = (values) => {
		const editClient = { _id: idIsModalProject, ...values }
		editClients(editClient).then(data => {
			handleCancel()
		})
	}
	const onFailedEditClient = (values) => {
		console.log('Failed', values)
	}

	useEffect(() => {
		if (idIsModalProject) {
			fetchOneClients(idIsModalProject).then(data => {
				setClient(data)
			})
		}
	}, [isModalOpenProp])

	return (<>
		<Modal title="Изменить контакт" open={isModalOpenProp} onOk={handleOk} onCancel={handleCancel} footer={null}>
			<Form
				labelCol={{
					span: 24,
				}}
				wrapperCol={{
					span: 24,
				}}
				fields={[
					{
						name: ["name"],
						value: client.name,
					},
					{
						name: ["phone"],
						value: client.phone,
					},
					{
						name: ["email"],
						value: client.email,
					},
					{
						name: ["company"],
						value: client.company,
					},
					{
						name: ["position"],
						value: client.position,
					},
				]}
				onFinish={onSubmitEditClient}
				onFinishFailed={onFailedEditClient}
				autoComplete="off"
			>
				<Form.Item
					label='Имя Фамилия'
					name='name'
					rules={[
						{
							required: true,
							message: 'Введите имя, фамилию клиента'
						}
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='Телефон'
					name='phone'
					rules={[
						{
							required: true,
							message: 'Введите телефон клиента'
						}
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='E-mail'
					name='email'
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='Название компании'
					name='company'
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='Должность'
					name='position'
				>
					<Input />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Добавить контакт
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	</>);
}

export default EditClient;