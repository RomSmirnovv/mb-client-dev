import { Modal, Form, Input, Button, Select } from 'antd'
import { useEffect, useState } from 'react'
import { fetchAllUsers } from '../../../services/UserService'
import { createNotificationList, editNotificationList } from '../../../services/NotificationListService'



const EditNotificationList = ({ isModalEditListOpen, handleOk, handleCancel, list }) => {
	const [users, setUsers] = useState([])
	const [selectUsers, setSelectUsers] = useState([])

	const onFinish = (values) => {
		let notificationList = values
		notificationList._id = list._id
		editNotificationList(notificationList).then(data => {
			handleOk()
		})
	}
	const onFinishFailed = () => {

	}

	useEffect(() => {
		fetchAllUsers().then(data => {
			setUsers(data)
			let options = []
			for (let i = 0; i < data.length; i++) {
				options[i] = {
					label: data[i].fullname,
					value: data[i]._id,
				}
			}
			setSelectUsers(options)
		})
	}, [])

	return (<>
		<Modal title="Изменить список уведомлений" open={isModalEditListOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
			<Form
				labelCol={{
					span: 24,
				}}
				wrapperCol={{
					span: 24,
				}}
				onFinish={onFinish}
				fields={[
					{
						name: ['name'],
						value: list.name
					},
					{
						name: ['users'],
						value: list.users
					}
				]}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item
					label='Название листа'
					name='name'
					rules={[
						{
							required: true,
							message: 'Введите название листа'
						}
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='Пользователи'
					name='users'
					className='select__users'
				>
					<Select
						mode="multiple"
						allowClear
						style={{
							width: '100%',
						}}
						placeholder="Выберите пользователей"
						options={selectUsers}
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Создать список
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	</>);
}

export default EditNotificationList;