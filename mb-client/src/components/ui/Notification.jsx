import React, { useEffect, useState } from 'react';
import { Col, Dropdown, Row, notification } from 'antd';
import { BellOutlined } from '@ant-design/icons'
import styles from './notification.module.css'
import { editNotification, fetchNotifications } from '../../services/NotificationService.js';
import { Howl, Howler } from "howler";
import notificationVoice from '/main/voices/notification.mp3'
import { useNavigate } from 'react-router-dom';
import ChangeProjectManager from './Modals/ChangeProjectManager.jsx'
import ApplyProjectManager from './Modals/ApplyProjectManager.jsx';

// const items = [
// 	{
// 		key: '1',
// 		label: (
// 			<div className={styles.notification__item}>
// 				<Row gutter={10}>
// 					<Col md={7} className={styles.datetime}>
// 						<div className={styles.date}><b>07.03.2024</b></div>
// 						<div className={styles.time}>12:00</div>
// 					</Col>
// 					<Col md={15}>
// 						<div className={styles.message}>Проект "Коллаж" передан в работу</div>
// 						<div className={styles.action}>Выберите Руководителя проекта</div>
// 					</Col>
// 					<Col md={2}>
// 						<div className={styles.read_notification}></div>
// 					</Col>
// 				</Row>
// 			</div>
// 		),
// 	},
// 	{
// 		key: '2',
// 		label: (
// 			<div className={styles.notification__item}>
// 				<Row gutter={10}>
// 					<Col md={7} className={styles.datetime}>
// 						<div className={styles.date}><b>07.03.2024</b></div>
// 						<div className={styles.time}>12:00</div>
// 					</Col>
// 					<Col md={15}>
// 						<div className={styles.message}>Проект "Коллаж" передан в работу</div>
// 						<div className={styles.action}>Выберите Руководителя проекта</div>
// 					</Col>
// 					<Col md={2}>
// 						<div className={styles.read_notification}></div>
// 					</Col>
// 				</Row>
// 			</div>
// 		),
// 	},
// ];

const Notification = ({ socket, userRole, userId, userName }) => {
	const navigate = useNavigate();
	const [notifications, setNotifications] = useState([])
	const [items, setItems] = useState([])
	const [editState, setEditState] = useState(false)
	const [isModalChangeProjectManagerOpen, setIsModalChangeProjectManagerOpen] = useState(false);
	const [isModalApplyProjectManagerOpen, setIsModalApplyProjectManagerOpen] = useState(false);
	const [activeProjectName, setActiveProjectName] = useState('')
	const [activeProjectId, setActiveProjectId] = useState('')
	const [activeNotificationId, setActiveNotificationId] = useState('')

	const handleOk = () => {
		setIsModalChangeProjectManagerOpen(false)
		setIsModalApplyProjectManagerOpen(false)
	};
	const handleCancel = () => {
		setIsModalChangeProjectManagerOpen(false)
		setIsModalApplyProjectManagerOpen(false)
	};

	const readNotification = (notification) => {
		notification.readed = true
		editNotification(notification)
	}

	const navigateAction = (notificationData) => {
		if (notificationData.action == 'Анализ привлекательности') {
			let urlAction = '/analysis?project_id=' + notificationData.projectId
			navigate(urlAction)
		}
		if (notificationData.action == 'Назначить Руководителя проекта') {
			setActiveProjectName(notificationData.projectName)
			setActiveProjectId(notificationData.projectId)
			setIsModalChangeProjectManagerOpen(true)
		}
		if (notificationData.action == 'Принять или отклонить Руководителя проекта') {
			setActiveNotificationId(notificationData._id)
			setActiveProjectName(notificationData.projectName)
			setActiveProjectId(notificationData.projectId)
			setIsModalApplyProjectManagerOpen(true)
		}
		if (notificationData.action == 'Назначить дату осмотра' || notificationData.action == 'Провести осмотр объекта' || notificationData.action == 'Результаты осмотра') {
			let urlAction = '/inspection?project_id=' + notificationData.projectId
			navigate(urlAction)
		}
		if (notificationData.action == 'Произвести предварительный расчет') {
			let urlAction = '/estimate?project_id=' + notificationData.projectId
			navigate(urlAction)
		}
	}

	const Sound = new Howl({
		src: [notificationVoice],
		html5: true,
		ctx: new (window.AudioContext || window.webkitAudioContext)(),
	});

	let dataitems = []
	useEffect(() => {
		socket?.on('getNotification', (data) => {
			let filterData = data.filter(fd => fd.addressat == userId)
			for (let i = 0; i < filterData.length; i++) {
				dataitems[i] = {
					key: i + 1,
					label: (
						<div className={`${styles.notification__item} ${!filterData[i].readed ? styles.notification__active : null}`} key={i}>
							<Row gutter={10}>
								<Col md={7} className={styles.datetime}>
									<div className={styles.date}><b>{filterData[i].date}</b></div>
									<div className={styles.time}>{filterData[i].time}</div>
								</Col>
								<Col md={15}>
									<div className={styles.message}>{filterData[i].message}</div>
									<div className={styles.action} onClick={() => navigateAction(filterData[i])}>{filterData[i].action}</div>
								</Col>
								<Col md={2}>
									{!filterData[i].readed ? <div className={styles.read_notification} onClick={() => readNotification(filterData[i])} ></div> : null}
								</Col>
							</Row>
						</div>
					),
				}
			}
			setNotifications(filterData)
			setItems(dataitems.sort((a, b) => b.key - a.key))
			setEditState(!editState)
		})

	}, [socket, editState])

	useEffect(() => {
		socket?.on('receive_notification', (data) => {
			setEditState(!editState)
			if (data.addressat == userId) {
				setNotifications((state) => [
					...state,
					data
				])
				setItems((state) => [
					...state,
					{
						key: items.length + 1,
						label: (
							<div className={`${styles.notification__item} ${!data.readed ? styles.notification__active : null}`} key={items.length}>
								<Row gutter={10}>
									<Col md={7} className={styles.datetime}>
										<div className={styles.date}><b>{data.date}</b></div>
										<div className={styles.time}>{data.time}</div>
									</Col>
									<Col md={15}>
										<div className={styles.message}>{data.message}</div>
										<div className={styles.action} onClick={() => navigateAction(data)}>{data.action}</div>
									</Col>
									<Col md={2}>
										{!data.readed ? <div className={styles.read_notification} onClick={() => readNotification(data)} ></div> : null}
									</Col>
								</Row>
							</div>
						),
					},
				]);
				Sound.play();
				Howler.ctx.resume();
			}
		});

		return () => socket?.off('receive_notification');
	}, [socket]);


	return (
		<div className={styles.notifications}>
			<Dropdown
				menu={{ items }}
				placement="bottomRight">
				<div className={styles.notification__icon} onClick={(e) => e.preventDefault()}>
					<BellOutlined className={styles.notifications__button} />
					{notifications.filter(n => n.readed === false).length != 0 ?
						<div className={styles.notification__counter}>{notifications.filter(n => n.readed === false).length}</div>
						: null}
				</div>
			</Dropdown>
			<ChangeProjectManager isModalChangeProjectManagerOpen={isModalChangeProjectManagerOpen} handleOk={handleOk} handleCancel={handleCancel} projectName={activeProjectName} projectId={activeProjectId} />
			<ApplyProjectManager isModalApplyProjectManagerOpen={isModalApplyProjectManagerOpen} handleOk={handleOk} handleCancel={handleCancel} projectName={activeProjectName} projectId={activeProjectId} userId={userId} userName={userName} activeNotificationId={activeNotificationId} />
		</div>
	);
}

export default Notification;