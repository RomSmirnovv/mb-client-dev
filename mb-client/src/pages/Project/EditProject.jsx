import { Form, DatePicker, Input, Row, Col, Typography, message, Upload, Button, Select, Modal } from 'antd';
import { UploadOutlined, UsergroupAddOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from "moment";
import { createProjects, deleteProjectData, editProjects } from '../../services/ProjectService';
import inMemoryJWT from '../../services/inMemoryJWT.js';
import { jwtDecode } from 'jwt-decode'
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { fetchOneProjects } from '../../services/ProjectService';
import queryString from 'query-string';
import dayjs from 'dayjs'
import { fetchClients } from '../../services/ClientService.js';

const { Title } = Typography;
const { TextArea } = Input;

const EditProject = () => {
	const [fileList, setFileList] = useState([]);
	const [newFileList, setNewFileList] = useState([]);
	const dateFormat = 'YYYY/MM/DD';
	const [isModalOpen, setIsModalOpen] = useState(false);
	const location = useLocation();
	const paramsUri = queryString.parse(location.search)
	const project_id = paramsUri.project_id
	const navigate = useNavigate();
	const accessToken = inMemoryJWT.getToken()
	let author_id = null
	if (accessToken) {
		author_id = jwtDecode(accessToken)._id
	}
	const [editState, setEditState] = useState(false)
	const { project } = useContext(AuthContext)
	const [data, setData] = useState()
	const [clients, setClients] = useState([])

	const onChange = (date, dateString) => {
		console.log(date, dateString);
	};
	const onFinish = (values) => {
		const project = { _id: project_id, author_id, ...values }
		const formData = new FormData();

		if (values.startDate) {
			project.startDate = values.startDate
		} else if (values.startDate == null) {
			project.startDate = ''
		} else {
			project.startDate = ''
		}

		if (values.offerDate) {
			project.offerDate = values.offerDate
		} else if (values.offerDate == null) {
			project.offerDate = ''
		} else {
			project.offerDate = ''
		}

		project.projectDocs = fileList
		formData.append('project', JSON.stringify(project));
		newFileList.forEach((file) => {
			formData.append('files', file);
		});
		editProjects(formData).then(data => {
			navigate("/projects", { replace: true })
		})
	};
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};
	const handleChange = (value) => {
		console.log(`selected ${value}`);
	};
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
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
			deleteProjectData(project_id, newFileList, file).then(data => {
				setEditState(!editState)
			})
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
		showUploadList: {
			showDownloadIcon: true,
			downloadIcon: 'Скачать файл',
			showRemoveIcon: true,
			removeIcon: <DeleteOutlined />,
		},
		fileList,
		multiple: true,
	};

	const filterOption = (input, option) =>
		(option?.label ?? '').toLowerCase().includes(input.toLowerCase());


	useEffect(() => {
		fetchOneProjects(project_id).then(d => {
			project.setProjects(d)
			setData(d)
			for (let n = 0; n < d.projectDocs.length; n++) {
				d.projectDocs[n].url = '/public/uploads/' + project_id + '/' + d.projectDocs[n].name
			}
			setFileList(d.projectDocs)
		})

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
			<Title level={3}>Данные проекта</Title>
			<Form
				name="basic"
				labelCol={{
					span: 24,
				}}
				wrapperCol={{
					span: 24,
				}}
				fields={[
					{
						name: ["fillingDate"],
						value: dayjs(`${project.projects.fillingDate}`),
					},
					{
						name: ["projectName"],
						value: project.projects.projectName,
					},
					{
						name: ["projectAddress"],
						value: project.projects.projectAddress,
					},
					{
						name: ["projectContact"],
						value: project.projects.projectContact,
					},
					{
						name: ["projectContact"],
						value: project.projects.projectContact,
					},
					{
						name: ["projectSpecificationText"],
						value: project.projects.projectSpecificationText,
					},
					{
						name: ["projectRoofArea"],
						value: project.projects.projectRoofArea,
					},
					{
						name: ["projectSpecification"],
						value: project.projects.projectSpecification,
					},
					{
						name: ["projectRepairType"],
						value: project.projects.projectRepairType,
					},
					{
						name: ["projectMode"],
						value: project.projects.projectMode,
					},
					{
						name: ["projectRoofSystem"],
						value: project.projects.projectRoofSystem,
					},
					{
						name: ["projectWorkHours"],
						value: project.projects.projectWorkHours,
					},
					{
						name: ["projectProperty"],
						value: project.projects.projectProperty,
					},
					{
						name: ["projectMaterial"],
						value: project.projects.projectMaterial,
					},
					{
						name: ["projectPaymentProcedure"],
						value: project.projects.projectPaymentProcedure,
					},
					{
						name: ["projectOtherInfo"],
						value: project.projects.projectOtherInfo,
					},
					{
						name: ["projectReliability"],
						value: project.projects.projectReliability,
					},
					{
						name: ["startDate"],
						value: project.projects.startDate ? dayjs(project.projects.startDate) : '',
					},
					{
						name: ["offerDate"],
						value: project.projects.offerDate ? dayjs(project.projects.offerDate) : '',
					},
					{
						name: ["projectReliability"],
						value: project.projects.projectReliability,
					},

				]}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
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
								<Col md={12}>
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
										<Upload {...props}>
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
													value: 'ТН-КРОВЛЯ ЭКСПЕРТ PIR',
													label: 'ТН-КРОВЛЯ ЭКСПЕРТ PIR',
												},
												{
													value: 'ТН-КРОВЛЯ БАЛЛАСТ',
													label: 'ТН-КРОВЛЯ БАЛЛАСТ',
												},
												{
													value: 'ТН-КРОВЛЯ ТРОТУАР КМС',
													label: 'ТН-КРОВЛЯ ТРОТУАР КМС',
												},
												{
													value: 'ТН-КРОВЛЯ УНИВЕРСАЛ КМС',
													label: 'ТН-КРОВЛЯ УНИВЕРСАЛ КМС',
												},
												{
													value: 'ТН-КРОВЛЯ СТАНДАРТ ТРОТУАР КМС',
													label: 'ТН-КРОВЛЯ СТАНДАРТ ТРОТУАР КМС',
												},
												{
													value: 'ТН-КРОВЛЯ ПРАКТИК',
													label: 'ТН-КРОВЛЯ ПРАКТИК',
												},
												{
													value: 'ТН-КРОВЛЯ ПРАКТИК КЛЕЙ',
													label: 'ТН-КРОВЛЯ ПРАКТИК КЛЕЙ',
												},
												{
													value: 'ТН-КРОВЛЯ ТЕРРАСА PIR',
													label: 'ТН-КРОВЛЯ ТЕРРАСА PIR',
												},
												{
													value: 'ТН-КРОВЛЯ ГРИН PIR',
													label: 'ТН-КРОВЛЯ ГРИН PIR',
												},
												{
													value: 'ТН-КРОВЛЯ БАЛЛАСТ PIR',
													label: 'ТН-КРОВЛЯ БАЛЛАСТ PIR',
												},
												{
													value: 'ТН-КРОВЛЯ МАСТ',
													label: 'ТН-КРОВЛЯ МАСТ',
												},
												{
													value: 'ТН-КРОВЛЯ ТЕРРАСА',
													label: 'ТН-КРОВЛЯ ТЕРРАСА',
												},
												{
													value: 'ТН-КРОВЛЯ СТАНДАРТ КМС',
													label: 'ТН-КРОВЛЯ СТАНДАРТ КМС',
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
								</Col>

								<Col md={18}>
									<Form.Item
										label="Надежность заказчика (ИНН, активы, деловая репутация, численность сотрудников, упалченные налоги, судебная практика)"
										name="projectReliability"
									>
										<TextArea rows={4} />
									</Form.Item>
								</Col>
								<Col md={24}>
									<Form.Item
									>
										<Button type="primary" htmlType="submit">
											Сохранить данные
										</Button>
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
						label='Имя'
						name='name'
						rules={[
							{
								required: true,
								message: 'Введите имя клиента'
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

export default EditProject;