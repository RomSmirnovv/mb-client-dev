import { Row, Col, Button, Card, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddNotificationList from './Modals/AddNotificationList';
import EditNotificationList from './Modals/EditNotificationList';
import { Fragment, useEffect, useState } from 'react';
import { deleteNotificationList, fetchNotificationLists } from '../../services/NotificationListService';
const { Meta } = Card;

const NotificationListPage = () => {
	const [activeList, setActiveList] = useState('')
	const [isModalAddListOpen, setIsModalAddListOpen] = useState(false)
	const [isModalEditListOpen, setIsModalEditListOpen] = useState(false)
	const [notificationList, setNotificationList] = useState([])
	const [editState, setEditState] = useState(false)

	const deleteList = () => {
		const id = activeList._id
		deleteNotificationList(id).then(data => {
			message.success(`Список уведомлений «${activeList.name}» удален!`);
			setEditState(!editState)
		})
	};

	const handleOk = () => {
		setIsModalAddListOpen(false)
		setIsModalEditListOpen(false)
		setEditState(!editState)
	}

	const handleCancel = () => {
		setIsModalAddListOpen(false)
		setIsModalEditListOpen(false)
	}

	useEffect(() => {
		fetchNotificationLists().then(data => {
			setNotificationList(data)
		})
	}, [editState])

	return (
		<>
			<Row gutter={15}>
				<Col md={24}>
					<Button onClick={() => setIsModalAddListOpen(true)}>Добавить список уведомлений</Button>
				</Col>
			</Row>
			{notificationList ? (
				<Row gutter={15} className='mt-2'>
					{notificationList.map((list, i) => (
						<Col md={6} key={i}>
							<Card
								actions={[
									<EditOutlined key="edit" onClick={() => { setIsModalEditListOpen(true); setActiveList(list) }} />,
									<Popconfirm
										title={`Удалить список «${list.name}»`}
										description="Вы действительно хотите удалить список уведомлений?"
										onConfirm={deleteList}
										okText="Да"
										cancelText="Нет"
									>
										<DeleteOutlined key="delete" onClick={() => setActiveList(list)} />
									</Popconfirm>,
								]}
							>
								<Meta
									title={list.name}
									description="Список уведомлений"
								/>
							</Card>
						</Col>
					))}
				</Row >
			) : null}
			<AddNotificationList isModalAddListOpen={isModalAddListOpen} handleOk={handleOk} handleCancel={handleCancel} />
			<EditNotificationList isModalEditListOpen={isModalEditListOpen} handleOk={handleOk} handleCancel={handleCancel} list={activeList} />
		</>
	);
}

export default NotificationListPage;