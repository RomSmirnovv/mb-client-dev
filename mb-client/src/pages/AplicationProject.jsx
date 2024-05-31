import { Form, DatePicker, Input, Row, Col, Typography, message, Upload, Button, Select, Modal } from 'antd';
import { UploadOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import moment from "moment";
import { createProjects, deleteProjectData, uploadProjectData } from '../services/ProjectService';
import { createClient, fetchClients } from '../services/ClientService.js'
import inMemoryJWT from '../services/inMemoryJWT.js';
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

const AplicationProject = () => {
	const [uploading, setUploading] = useState(false);
	const [fileList, setFileList] = useState([]);
	const [newFileList, setNewFileList] = useState([]);
	const [editState, setEditState] = useState(false)
	const [clients, setClients] = useState([])
	const dateFormat = 'YYYY/MM/DD';
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();
	const accessToken = inMemoryJWT.getToken()
	let author_id = null
	if (accessToken) {
		author_id = jwtDecode(accessToken)._id
	}
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const onChange = (date, dateString) => {
		console.log(date, dateString);
	};
	const onFinish = (values) => {
		let project = { author_id, ...values }
		const formData = new FormData();
		project.fillingDate = moment(project.fillingDate).format(dateFormat)
		if (values.startDate) {
			project.startDate = dayjs(values.startDate).format(dateFormat)
		} else {
			project.startDate = ''
		}
		if (values.offerDate) {
			project.offerDate = dayjs(values.offerDate).format(dateFormat)
		} else {
			project.offerDate = ''
		}
		formData.append('project', JSON.stringify(project));
		newFileList.forEach((file) => {
			formData.append('files', file);
		});
		createProjects(formData).then(data => {
			navigate("/projects", { replace: true })
		})
	};
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};
	const handleChange = (value) => {
		console.log(`selected ${value}`);
	};
	const onSubmitAddClient = (values) => {
		const client = values
		createClient({ client }).then(data => {
			setIsModalOpen(false);
			setEditState(!editState)
		})
	}
	const onFailedAddClient = (errorInfo) => {
		console.log('Failed', errorInfo)
	}
	let files = []
	let newFiles = []
	const props = {
		onRemove: (file) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
		},
		beforeUpload: (file) => {
			let newFile = {
				lastModified: file.lastModified,
				lastModifiedDate: file.lastModifiedDate,
				name: file.name,
				originFileObj: file.originFileObj,
				percent: file.percent,
				size: file.size,
				type: file.type,
				uid: file.uid,
			}
			newFiles = newFileList
			files = fileList
			files.push(newFile)
			newFiles.push(file)
			setFileList(files)
			setNewFileList(newFiles)
			return false
		},
		fileList,
		multiple: true,
	};
	const techProps = {

	}

	const filterOption = (input, option) =>
		(option?.label ?? '').toLowerCase().includes(input.toLowerCase());
	useEffect(() => {
		fetchClients().then(data => {
			let clientsData = []
			for (let i = 0; i < data.length; i++) {
				clientsData[i] = {
					value: `${data[i]._id}`,
					label: `${data[i].name} (${data[i].company})`,
				}
			}
			setClients(clientsData)
		})
	}, [editState])

	return (
		<>
			<Title level={3}>Входящая заявка</Title>
			<Form
				name="aplication"
				labelCol={{
					span: 24,
				}}
				wrapperCol={{
					span: 24,
				}}
				initialValues={{
					fillingDate: dayjs(),
					projectSpecification: '',
					projectRepairType: '',
					projectRoofSystem: '',
					projectMaterial: '',
					projectContact: '',
					projectAddress: '',
					startDate: '',
					offerDate: '',
					projectSpecificationText: '',
					projectMode: '',
					projectWorkHours: '',
					projectProperty: '',
					projectPaymentProcedure: '',
					projectOtherInfo: '',
					projectReliability: '',
				}}
				onFinish={onFinish}
				autoComplete="off"
			>
				<Row gutter={20}>
					<Col md={6}>
						<div className='content-container'>
							<Title level={4}>Основные данные</Title>
							<Form.Item
								label="Дата заполнения"
								name="fillingDate"
							>
								<DatePicker disabled />
							</Form.Item>
							<Form.Item
								label="Рабочее название проекта"
								name="projectName"
								rules={[
									{
										required: true,
										message: 'Введите название проекта'
									}
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Адрес"
								name="projectAddress"
								rules={[
									{
										required: true,
										message: 'Введите адрес объекта'
									}
								]}
							>
								<Input />
							</Form.Item>
							<div className='contact-select-container'>
								<Form.Item
									label="Контактное лицо"
									name="projectContact"
								>
									<Select
										showSearch
										placeholder="Поиск..."
										optionFilterProp="children"
										style={{
											width: 300,
										}}
										onChange={handleChange}
										filterOption={filterOption}
										options={clients}
									/>
								</Form.Item>
								<UsergroupAddOutlined className='add-client-icon' title='Добавить новый контакт' onClick={showModal} />
							</div>
							<Form.Item
								label="Планируемая дата начала работ"
								name="startDate"
							>
								<DatePicker onChange={onChange} />
							</Form.Item>
							<Form.Item
								label="Дата подачи КП"
								name="offerDate"
							>
								<DatePicker onChange={onChange} />
							</Form.Item>
						</div>
					</Col>
					<Col md={18}>
						<div className='content-container'>
							<Title level={4}>Данные об объекте</Title>
							<Row gutter={20}>
								<Col md={24}>
									<Form.Item
										label="Документация (pdf, word, excel, images, zip, rar)"
										name="projectDocs"
									>
										<Upload {...props}>
											<Button icon={<UploadOutlined />}>Выберите файл</Button>
										</Upload>
									</Form.Item>
								</Col>
								{/* <Col md={8}>
									<Form.Item
										label="Тех. задание заказчика (pdf, word, excel, images, zip, rar)"
										name="projectSpecification"
									>
										<Upload {...techProps}>
											<Button icon={<UploadOutlined />}>Выберите файл</Button>
										</Upload>
									</Form.Item>
								</Col> */}

							</Row>
							<Row gutter={20}>
								<Col md={24}>
									<Form.Item
										label="Тех. задание на словах, если нет файла"
										name="projectSpecificationText"
									>
										<TextArea rows={4} />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={20}>
								<Col md={8}>
									<Form.Item
										label="Площадь кровли (м²)"
										name="projectRoofArea"
										rules={[
											{
												required: true,
												message: 'Укажите площадь кровли'
											}
										]}
									>
										<Input type='number' />
									</Form.Item>
								</Col>
								<Col md={8}>
									<Form.Item
										label="Назначение здания"
										name="projectSpecification"
									>
										<Select
											onChange={handleChange}
											options={[
												{
													value: 'Промышленное',
													label: 'Промышленное',
												},
												{
													value: 'Частное',
													label: 'Частное',
												},
											]}
										/>
									</Form.Item>
								</Col>
								<Col md={8}>
									<Form.Item
										label="Вид ремонта"
										name="projectRepairType"
									>
										<Select
											onChange={handleChange}
											options={[
												{
													value: 'Капитальный',
													label: 'Капитальный',
												},
												{
													value: 'Текущий',
													label: 'Текущий',
												},
												{
													value: 'Новое строительство',
													label: 'Новое строительство',
												},
											]}
										/>
									</Form.Item>
								</Col>
								<Col md={8}>
									<Form.Item
										label="Режимность объекта"
										name="projectMode"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col md={8}>
									<Form.Item
										label="Кровельная система"
										name="projectRoofSystem"
									>
										<Select
											onChange={handleChange}
											options={[
												{
													value: 'ТН-КРОВЛЯ Смарт PIR',
													label: 'ТН-КРОВЛЯ Смарт PIR',
												},
												{
													value: 'ТН-КРОВЛЯ Мастер',
													label: 'ТН-КРОВЛЯ Мастер',
												},
												{
													value: 'ТН-КРОВЛЯ Стандарт',
													label: 'ТН-КРОВЛЯ Стандарт',
												},
												{
													value: 'ТН-КРОВЛЯ Эксперт PIR',
													label: 'ТН-КРОВЛЯ Эксперт PIR',
												},
												{
													value: 'ТН-КРОВЛЯ Лайт',
													label: 'ТН-КРОВЛЯ Лайт',
												},
												{
													value: 'ТН-КРОВЛЯ Лайт ПМ',
													label: 'ТН-КРОВЛЯ Лайт ПМ',
												},
												{
													value: 'ТН-КРОВЛЯ Балласт',
													label: 'ТН-КРОВЛЯ Балласт',
												},
												{
													value: 'ТН-КРОВЛЯ Универсал',
													label: 'ТН-КРОВЛЯ Универсал',
												},
												{
													value: 'ТН-КРОВЛЯ Классик',
													label: 'ТН-КРОВЛЯ Классик',
												},
												{
													value: 'ТН-КРОВЛЯ Солид Проф',
													label: 'ТН-КРОВЛЯ Солид Проф',
												},
												{
													value: 'ТН-КРОВЛЯ Стандарт КВ',
													label: 'ТН-КРОВЛЯ Стандарт КВ',
												},
												{
													value: 'ТН-КРОВЛЯ Проф',
													label: 'ТН-КРОВЛЯ Проф',
												},
												{
													value: 'ТН-КРОВЛЯ Оптима',
													label: 'ТН-КРОВЛЯ Оптима',
												},
												{
													value: 'ТН-КРОВЛЯ Универсал КВ',
													label: 'ТН-КРОВЛЯ Универсал КВ',
												},
											]}
										/>
									</Form.Item>
								</Col>
								<Col md={8}>
									<Form.Item
										label="Часы работы на объекте"
										name="projectWorkHours"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col md={8}>
									<Form.Item
										label="Что находится под крышей?"
										name="projectProperty"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col md={8}>
									<Form.Item
										label="Чей материал?"
										name="projectMaterial"
									>
										<Select
											onChange={handleChange}
											options={[
												{
													value: 'Свой',
													label: 'Свой',
												},
												{
													value: 'Давальческий',
													label: 'Давальческий',
												},
											]}
										/>
									</Form.Item>
								</Col>
							</Row>
						</div>
					</Col>
					<Col md={24}>
						<div className='content-container'>
							<Title level={4}>Прочая информация</Title>
							<Row gutter={20}>
								<Col md={6}>
									<Form.Item
										label="Порядок оплаты"
										name="projectPaymentProcedure"
									>
										<Input />
									</Form.Item>
									<Form.Item
										label="Прочее (общается ли он с ЛПР, и т.д.)"
										name="projectOtherInfo"
									>
										<Input />
									</Form.Item>
									<Form.Item
									>
										<Button type="primary" htmlType="submit">
											Сохранить данные
										</Button>
									</Form.Item>
								</Col>

								<Col md={18}>
									<Form.Item
										label="Надежность заказчика (ИНН, активы, деловая репутация, численность сотрудников, упалченные налоги, судебная практика)"
										name="projectReliability"
									>
										<TextArea rows={4} />
									</Form.Item>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
			</Form >
			<Modal title="Добавить новый контакт" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
				<Form
					labelCol={{
						span: 24,
					}}
					wrapperCol={{
						span: 24,
					}}
					initialValues={{
						name: '',
						phone: '',
						email: '',
						company: '',
						position: '',
					}}
					onFinish={onSubmitAddClient}
					onFinishFailed={onFailedAddClient}
					autoComplete="on"
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
		</>
	);
}

export default AplicationProject;