import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { createNotification, deleteNotification, createNotificationForList, editNotification } from '../../../services/NotificationService';
const { TextArea } = Input;
import moment from 'moment'
import { editProject } from '../../../services/ProjectService';

const ApplyProjectManager = ({ isModalApplyProjectManagerOpen, handleOk, handleCancel, projectName, projectId, userName, activeNotificationId, userId }) => {
	const [editState, setEditState] = useState(false)
	const [form] = Form.useForm();

	const onFinish = (values) => {
		const notification = {
			message: `${userName.surname} ${userName.name} ${userName.patronymic} отклонил Руководителя проекта «${projectName}», причина: ${values.reason}`,
			projectId: projectId,
			projectName: projectName,
			addressat: '',
			date: moment(new Date()).format("DD.MM.YYYY"),
			time: moment(new Date()).format('HH:mm'),
			action: 'Назначить Руководителя проекта'
		}
		createNotificationForList(notification, '!Руководителю производства').then(data => {
			let updateNotification = {
				_id: activeNotificationId,
				readed: true
			}
			editNotification(updateNotification).then(d => {
				handleOk()
				setEditState(!editState)
			})
		})
	};

	const applyProjectManager = () => {
		const project = {
			_id: projectId,
			projectManager: `${userName.surname} ${userName.name} ${userName.patronymic}`,
			projectManagerId: userId
		}
		editProject(project).then(data => {
			const listNotificationArray = ['!Руководителю производства', '!Менеджеру']
			for (let i = 0; i < listNotificationArray.length; i++) {
				let notification = {
					message: `${userName.surname} ${userName.name} ${userName.patronymic} назначен Руководителем проекта «${projectName}»`,
					projectId: projectId,
					projectName: projectName,
					addressat: '',
					date: moment(new Date()).format("DD.MM.YYYY"),
					time: moment(new Date()).format('HH:mm'),
					action: listNotificationArray[i] == '!Менеджеру' ? 'Назначить дату осмотра' : ''
				}
				createNotificationForList(notification, listNotificationArray[i]).then(data => {
				})
			}
			let updateNotification = {
				_id: activeNotificationId,
				readed: true
			}
			editNotification(updateNotification).then(d => {
				handleOk()
				setEditState(!editState)
			})
		})
	}

	return (
		<Modal title={`Принять или отклонить Руководителя проекта «${projectName}»`} open={isModalApplyProjectManagerOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
			<Button type='primary' className='mt-1 mb-1' onClick={() => applyProjectManager()}>{`Принять Руководителя проекта «${projectName}»`}</Button><br />
			<Form
				form={form}
				onFinish={onFinish}
			>
				<Form.Item
					name="reason"
					rules={[
						{
							required: true,
							message: 'Пожалуйста, укажите причину!',
						},
					]}>
					<TextArea rows={2} className='mt-1' />
				</Form.Item>
				<Form.Item>
					<Button type="primary" danger htmlType="submit" className='mt-1'>{`Отклонить Руководителя проекта «${projectName}»`}</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default ApplyProjectManager;