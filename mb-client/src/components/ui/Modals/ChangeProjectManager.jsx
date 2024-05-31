import React, { useEffect, useState } from 'react';
import { Modal, Select, Button } from 'antd';
import { fetchUsersByRole } from '../../../services/UserService';
import moment from 'moment'
import { createNotification } from '../../../services/NotificationService';

const ChangeProjectManager = ({ isModalChangeProjectManagerOpen, handleOk, handleCancel, projectName, projectId }) => {
	const [projectManagers, setProjectManagers] = useState([])
	const [changeProjectManagerOptions, setChangeProjectManagerOptions] = useState([])
	const [editState, setEditState] = useState(false)
	const [activeUser, setActiveUser] = useState('')

	const handleChangeProjectManager = (value) => {
		setActiveUser(value)
	};

	const sendMessageByNotification = () => {
		const notification = {
			message: `Вас выбрали Руководителем проекта «${projectName}»`,
			projectId: projectId,
			projectName: projectName,
			addressat: activeUser,
			date: moment(new Date()).format("DD.MM.YYYY"),
			time: moment(new Date()).format('HH:mm'),
			readed: false,
			action: 'Принять или отклонить Руководителя проекта'
		}
		createNotification(notification).then(data => {
			handleOk()
			setEditState(!editState)
		})
	}

	useEffect(() => {
		fetchUsersByRole(6).then(data => {
			setProjectManagers(data)
			setEditState(!editState)

			let options = []
			for (let i = 0; i < data.length; i++) {
				options[i] = {
					value: data[i]._id,
					label: <div><div>{data[i].surname} {data[i].name} {data[i].patronymic}</div><div>
						{data[i].projects.length != 0 ? `(${data[i].projects.join(', ')})`
							: null}
					</div></div>
				}
			}
			setChangeProjectManagerOptions(options)
		})
	}, [isModalChangeProjectManagerOpen])


	return (
		<Modal title={`Выбрать Руководителя проекта «${projectName}»`} open={isModalChangeProjectManagerOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
			<Select
				defaultValue={changeProjectManagerOptions[0]}
				style={{
					width: 400,
				}}
				onChange={handleChangeProjectManager}
				options={changeProjectManagerOptions}
				className='mt-2'
			/>
			<Button type='primary' className='mt-1' onClick={() => sendMessageByNotification()}>Уведомить</Button>
		</Modal>
	);
}

export default ChangeProjectManager;