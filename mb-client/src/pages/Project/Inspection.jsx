import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Row, Col, Typography, DatePicker, Button, Form, InputNumber } from 'antd';
import { PlusOutlined, FileDoneOutlined } from '@ant-design/icons';
import { fetchOneProjects, editProject } from '../../services/ProjectService';
import { createNotification, deleteNotification, createNotificationForList } from '../../services/NotificationService';
import inMemoryJWT from '../../services/inMemoryJWT.js';
import { jwtDecode } from 'jwt-decode'
import moment from 'moment'
import dayjs from 'dayjs'
import styles from './inspection.module.css'
import AddParameter from '../../components/ui/Modals/AddParameter.jsx';
import Сutting from '../../components/Project/Сutting.jsx'
import { createCutting, fetchCuttingsByProject } from '../../services/CuttingServices.js';
const { Title, Paragraph, Text } = Typography;


const measurements = [
	{
		key: 'measurement-1',
		title: 'Длина кровли, м.п.',
		name: '["measurement-1"]',
		value: ''
	},
	{
		key: 'measurement-2',
		title: 'Ширина кровли, м.п.',
		name: '["measurement-2"]',
		value: ''
	},
	{
		key: 'measurement-3',
		title: 'Длина парапетов, м.п.',
		name: '["measurement-3"]',
		value: ''
	},
	{
		key: 'measurement-4',
		title: 'Ширина парапетов, м.п.',
		name: '["measurement-4"]',
		value: ''
	},
	{
		key: 'measurement-5',
		title: 'Высота парапетов, м.п.',
		name: '["measurement-5"]',
		value: ''
	},
	{
		key: 'measurement-6',
		title: 'Количество воронок, шт.',
		name: '["measurement-6"]',
		value: ''
	},
	{
		key: 'measurement-7',
		title: 'Расстояние между воронками, м.п.',
		name: '["measurement-7"]',
		value: ''
	},
	{
		key: 'measurement-8',
		title: 'Количество труб, шт.',
		name: '["measurement-8"]',
		value: ''
	},
	{
		key: 'measurement-9',
		title: 'Диаметр труб, мм',
		name: '["measurement-9"]',
		value: ''
	},
	{
		key: 'measurement-10',
		title: 'Размер вент шахт, м.п.',
		name: '["measurement-10"]',
		value: ''
	},
	{
		key: 'measurement-11',
		title: 'Количество стоек фахверка, шт.',
		name: '["measurement-11"]',
		value: ''
	},
	{
		key: 'measurement-12',
		title: 'Количество стоек под оборудования, шт.',
		name: '["measurement-12"]',
		value: ''
	},
	{
		key: 'measurement-13',
		title: 'Размер зенитных фонарей, м.п.',
		name: '["measurement-13"]',
		value: ''
	},
	{
		key: 'measurement-14',
		title: 'Размер выходов на кровлю, м.п.',
		name: '["measurement-14"]',
		value: ''
	},
	{
		key: 'measurement-15',
		title: 'Размер люков дымоудаления, м.п.',
		name: '["measurement-15"]',
		value: ''
	},
]

const Inspection = () => {
	const accessToken = inMemoryJWT.getToken()
	let userRole = null
	if (accessToken) {
		userRole = jwtDecode(accessToken).role
	}
	const location = useLocation();
	const paramsUri = queryString.parse(location.search)
	const project_id = paramsUri.project_id
	const [isModalAddParameterOpen, setIsModalAddParameterOpen] = useState(false)
	const [editState, setEditState] = useState(false)
	const [data, setData] = useState([])
	const [stateMeasurements, setStateMeasurements] = useState([])
	const [stateMeasurementsFields, setStateMeasurementsFields] = useState([])
	const [cuttingData, setCuttingData] = useState([])

	const editPageState = () => {
		setEditState(!editState)
	}
	const onFinish = (values) => {
		const project = {
			_id: project_id,
			inspectionDate: values.inspectionDate,
			inspectionDateAgreed: true
		}
		editProject(project).then(data => {
			const notification = {
				message: `По проекту «${data.data.projectName}» назначена дата осмотра: ${moment(data.data.inspectionDate).format("DD.MM.YYYY")}`,
				projectId: data.data._id,
				projectName: data.data.projectName,
				addressat: data.data.projectManagerId,
				date: moment(new Date()).format("DD.MM.YYYY"),
				time: moment(new Date()).format('HH:mm'),
				action: 'Провести осмотр объекта'
			}
			createNotification(notification).then(data => {
				setEditState(!editState)
			})
		})
	}
	const onFinishMeasurements = (values) => {
		console.log(values)
	}
	const handleOk = () => {
		setIsModalAddParameterOpen(false)
	}
	const handleCancel = () => {
		setIsModalAddParameterOpen(false)
	}
	const openAddParameter = () => {
		setIsModalAddParameterOpen(true)
	}
	const addParameter = (values) => {
		const newMeasurement = {
			key: `measurement-${measurements.length + 1}`,
			title: values.title,
			name: `'["measurement-${measurements.length + 1}"]'`,
			value: values.value,
		}
		const newInspectionMeasurements = [
			...stateMeasurements,
			newMeasurement
		]
		const project = {
			_id: project_id,
			inspectionMeasurements: newInspectionMeasurements
		}
		editProject(project).then(() => {
			setStateMeasurements(newInspectionMeasurements)
			setIsModalAddParameterOpen(false)
			setEditState(!editState)
		})
	}
	const saveChangeValue = (value, key) => {
		let blurStateMeasurements = stateMeasurements
		for (let i = 0; i < stateMeasurements.length; i++) {
			if (blurStateMeasurements[i].key == key) {
				blurStateMeasurements[i].value = value
			}
		}
		const project = {
			_id: project_id,
			inspectionMeasurements: blurStateMeasurements
		}
		editProject(project).then(() => {
			setStateMeasurements(blurStateMeasurements)
			setEditState(!editState)
		})
	}
	const updateCutting = () => {
		fetchCuttingsByProject(project_id).then(data => {
			setCuttingData(data)
			setEditState(!editState)
		})
	}
	const addCutting = (projectId) => {
		const cuttingNumber = cuttingData.length + 1
		const cutting = {
			name: 'Вырубка №' + (cuttingData.length + 1),
			date: moment(new Date()).format("DD.MM.YYYY"),
			layers: [],
			projectId: projectId,
			photos: []
		}
		createCutting(cutting).then(data => {
			setEditState(!editState)
		})
	}
	const endInspection = (project) => {
		project.isInspection = true
		console.log(project)
		editProject(project).then(data => {
			const notification = {
				message: `Завершен осмотр проекта «${project.projectName}»`,
				projectId: project._id,
				projectName: project.projectName,
				date: moment(new Date()).format("DD.MM.YYYY"),
				time: moment(new Date()).format('HH:mm'),
				action: 'Результаты осмотра'
			}
			createNotificationForList(notification, '!Инженеру').then(data => {
				setEditState(!editState)
			})
		})
	}
	let measurementsFields = []
	useEffect(() => {

		fetchOneProjects(project_id).then(d => {
			setData(d)
			setStateMeasurements(d.inspectionMeasurements)
			for (let i = 0; i < d.inspectionMeasurements.length; i++) {
				measurementsFields[i] = {
					name: [`${d.inspectionMeasurements[i].key}`],
					value: d.inspectionMeasurements[i].value,
				}
			}
			setStateMeasurementsFields(measurementsFields)

			fetchCuttingsByProject(project_id).then(data => {
				setCuttingData(data)
			})
		})
	}, [editState])
	return (
		<>
			<Title level={4}>Данные осмотра по проекту «{data.projectName || ''}»</Title>
			<Row gutter={20}>
				<Col md={8}>
					<div className='content-container'>
						<Title level={5}>Дата осмотра</Title>
						<Form
							name='formInspectionDate'
							onFinish={onFinish}
							fields={[
								{
									name: ["inspectionDate"],
									value: data.inspectionDate ? dayjs(data.inspectionDate) : '',
								}
							]}
							disabled={userRole.includes('1') && !data.isInspection || userRole.includes('10') && !data.isInspection ? false : true}
						>
							<Form.Item
								name="inspectionDate"
								rules={[
									{
										required: true,
										message: 'Пожалуйста, укажите дату!',
									},
								]}>
								<DatePicker />
							</Form.Item>
							<Form.Item>
								{userRole.includes('1') && !data.isInspection || userRole.includes('10') && !data.isInspection ?
									<Button type='primary' className='mt-1' htmlType='submit'>Оповестить Руководителя проекта</Button>
									: null}
							</Form.Item>
						</Form>
					</div>
					<div className='content-container'>
						<Title level={5}>Основные данные объекта</Title>
						<Paragraph><Text strong>Название:</Text> «{data.projectName}»</Paragraph>
						<Paragraph><Text strong>Расположение:</Text> {data.projectAddress}</Paragraph>
						<Paragraph><Text strong>Тип здания:</Text> {data.projectSpecification}</Paragraph>
						<Paragraph><Text strong>Площадь кровли:</Text> {data.projectRoofArea} м2</Paragraph>
						<Paragraph><Text strong>Планируемая дата начала работ:</Text> {data.startDate ? moment(dayjs(data.startDate)).format('DD.MM.YYYY') : ''}</Paragraph>
					</div>
				</Col>
				<Col md={16}>
					<div className='content-container'>
						<Title level={5}>Замеры</Title>
						<Form
							name='formMeasurements'
							layout='vertical'
							onFinish={onFinishMeasurements}
							fields={stateMeasurementsFields}
							disabled={data.isInspection ? true : false}
						>
							<Row gutter={15}>
								{stateMeasurements.map((m, i) => (
									<Col md={6} key={i}>
										<Form.Item
											label={m.title}
											name={m.key}
											className={styles.form__item}>
											<InputNumber
												min={0}
												style={{
													width: '100%',
												}} onBlur={(e) => saveChangeValue(e.target.value, m.key)} />
										</Form.Item>
									</Col>
								))}
							</Row>
						</Form>

						{!data.isInspection ?
							<Button type="primary" className='mt-1 mb-1' onClick={() => openAddParameter()} icon={<PlusOutlined />}>
								Добавить параметр
							</Button>
							: null}

					</div>
				</Col>
			</Row>
			<Row gutter={20}>
				<Col md={24}>
					<Title level={4}>Отчет по вырубкам</Title>
				</Col>
				{cuttingData ? cuttingData.map((cutting, key) => (
					<Сutting cutting={cutting} key={key} updateCutting={updateCutting} projectName={data.projectName} editPageState={editPageState} isInspection={data.isInspection} />
				)) : null}
				<Col md={24}>
					{!data.isInspection ?
						<Button type="primary" className='mt-1 mb-1' icon={<PlusOutlined />} onClick={() => addCutting(data._id)}>
							Добавить вырубку
						</Button>
						: null}
				</Col>
			</Row>
			<Row gutter={20}>
				<Col md={24}>
					{!data.isInspection ?
						<Button type="primary" className='mt-2 mb-3' icon={<FileDoneOutlined />} onClick={() => endInspection(data)}>Завершить осмотр и отправить отчет</Button>
						: null}
				</Col>
			</Row>
			<AddParameter isModalAddParameterOpen={isModalAddParameterOpen} handleOk={handleOk} handleCancel={handleCancel} addParameter={addParameter} />
		</>
	);
}

export default Inspection;