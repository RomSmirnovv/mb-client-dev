import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { editProjects, fetchOneProjects, changeProjectStatus } from '../../services/ProjectService';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Title from 'antd/es/typography/Title';
import { Form, Table, Input, Space, Button } from 'antd';
const EditableContext = React.createContext(null);
import inMemoryJWT from '../../services/inMemoryJWT.js';
import { jwtDecode } from 'jwt-decode'

const EditableRow = ({ index, ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};
const EditableCell = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef(null);
	const form = useContext(EditableContext);

	useEffect(() => {
		if (editing) {
			inputRef.current.focus();
		}
	}, [editing]);
	const toggleEdit = () => {
		setEditing(!editing);
		form.setFieldsValue({
			[dataIndex]: record[dataIndex],
		});
	};
	const save = async () => {
		try {
			const values = await form.validateFields();
			toggleEdit();
			handleSave({
				...record,
				...values,
			});
		} catch (errInfo) {
			console.log('Save failed:', errInfo);
		}
	};
	let childNode = children;
	console.log(record)
	if (editable && record.nameData && record.nameData != 'analysisSpecification' && record.nameData != 'analysisRepairType' && record.nameData != 'analysisMaterial' && record.nameData != 'analysisRoofArea') {
		childNode = editing ? (
			<Form.Item
				style={{
					margin: 0,
					width: '80px',
				}}
				name={dataIndex}
				rules={[
					{
						required: true,
						message: `${title} - обязательное поле`,
					},
				]}
			>
				<Input type='number' ref={inputRef} onPressEnter={save} onBlur={save} />
			</Form.Item>
		) : (
			<div
				className="editable-cell-value-wrap"
				style={{
					paddingRight: 24,
				}}
				onClick={toggleEdit}
			>
				{children}
			</div>
		);
	}
	return <td {...restProps}>{childNode}</td>;
};


const ProjectAnalysis = () => {
	const [isEdited, setIsEdited] = useState(false)
	const accessToken = inMemoryJWT.getToken()
	if (accessToken) {
		let userRole = jwtDecode(accessToken).role
		if (userRole.length != 0) {
			if (userRole.includes('1') && !isEdited)
				setIsEdited(true)
			else if (userRole.includes('3') && !isEdited)
				setIsEdited(true)
			else if (userRole.includes('4') && !isEdited)
				setIsEdited(true)
		}
	}
	const location = useLocation();
	const paramsUri = queryString.parse(location.search)
	const project_id = paramsUri.project_id
	const [editState, setEditState] = useState(false)
	const { project } = useContext(AuthContext)
	const [data, setData] = useState()
	const [count, setCount] = useState(2);
	const navigate = useNavigate();

	const defaultColumns = [
		{
			title: 'Параметры оценки',
			dataIndex: 'params',
			key: 'params',
			width: '50%',
			render: (html) => { return <div dangerouslySetInnerHTML={{ __html: html }} /> },
		},
		{
			title: `${project.projects.projectName}`,
			dataIndex: 'projectColums',
			key: 'projectColums',
			width: '25%',
		},
		{
			title: 'Баллы',
			dataIndex: 'projectScores',
			key: 'projectScores',
			width: '25%',
			editable: true,
		},
	];
	const dataСolumns = [
		{
			key: '1',
			params: '<span>Отдаленность по территориальным зонам<br /><small>0 - 6 баллов (по территориальным зонам)</small></span>',
			projectColums: `${project.projects.projectAddress}`,
			projectScores: `${project.projects.analysisRange}`,
			nameData: 'analysisRange',
		},
		{
			key: '2',
			params: '<span>Объем, м2 <br /><small>0 = до 200, 1 =200-1000, 2 =1000-5000, 3 =5000-10000, 4 =10000-30000, 5 = >30000</small></span>',
			projectColums: `${project.projects.projectRoofArea} м2`,
			projectScores: `${project.projects.analysisRoofArea}`,
			nameData: 'analysisRoofArea',
		},
		{
			key: '3',
			params: '<span>Тип здания<br /><small>3 = Производственное, 0 = Частное</small></span>',
			projectColums: `${project.projects.projectSpecification}`,
			projectScores: `${project.projects.analysisSpecification}`,
			nameData: 'analysisSpecification',
		},
		{
			key: '4',
			params: '<span>Вид ремонта<br /><small>2 = КР, 4 = ТР, 6 = Новое строительство</small></span>',
			projectColums: `${project.projects.projectRepairType}`,
			projectScores: `${project.projects.analysisRepairType}`,
			nameData: 'analysisRepairType',
		},
		{
			key: '5',
			params: '<span>Есть имущество и люди или нет<br /><small>0 - 6 баллов (Есть ответственность за протечки или нет)</small></span>',
			projectColums: `${project.projects.projectProperty}`,
			projectScores: `${project.projects.analysisProperty}`,
			nameData: 'analysisProperty',
		},
		{
			key: '6',
			params: '<span>Какой материал используем<br /><small>3 = Давальческий материал, 2 = Нет</small></span>',
			projectColums: `${project.projects.projectMaterial}`,
			projectScores: `${project.projects.analysisMaterial}`,
			nameData: 'analysisMaterial',
		},
		{
			key: '7',
			params: '<span>Режимжность объекта<br /><small>0 = геморой, 6 = конфетка</small></span>',
			projectColums: `${project.projects.projectMode}`,
			projectScores: `${project.projects.analysisMode}`,
			nameData: 'analysisMode',
		},
		{
			key: '8',
			params: '<span>Порядок оплаты<br /><small>0 = без аванса, 6 = 100% оплата</small></span>',
			projectColums: `${project.projects.projectPaymentProcedure}`,
			projectScores: `${project.projects.analysisPaymentProcedure}`,
			nameData: 'analysisPaymentProcedure',
		},
		{
			key: '9',
			params: '<span>Надежность заказчика<br /><small>0 - 6 баллов</small></span>',
			projectColums: `${project.projects.projectReliability}`,
			projectScores: `${project.projects.analysisReliability}`,
			nameData: 'analysisReliability',
		},
		{
			key: '10',
			params: '<span>Кровельная система<br /><small>0 - 6 баллов (по сложности монтажа)</small></span>',
			projectColums: `${project.projects.projectRoofSystem}`,
			projectScores: `${project.projects.analysisRoofSystem}`,
			nameData: 'analysisRoofSystem',
		},
		{
			key: '11',
			params: '<span>Период работы<br /><small>0 - 6 баллов</small></span>',
			projectColums: '',
			projectScores: `${project.projects.analysisWorkPeriod}`,
			nameData: 'analysisWorkPeriod',
		},
		{
			key: '12',
			params: '<span>Расположение объекта<br /><small>0 - 6 баллов (в зависимости от ТН, склада, поставщиков других материалов)</small></span>',
			projectColums: `${project.projects.projectAddress}`,
			projectScores: `${project.projects.analysisObjectLocation}`,
			nameData: 'analysisObjectLocation',
		},
		{
			key: '13',
			params: '<span>Прочая информация о заказчике<br /><small>0 - 6 баллов (бюрократия, личное общение)</small></span>',
			projectColums: `${project.projects.projectOtherInfo}`,
			projectScores: `${project.projects.analysisOtherInfo}`,
			nameData: 'analysisOtherInfo',
		},
		{
			key: '14',
			params: '<span>Ценообразование<br /><small>0 - 6 баллов</small></span>',
			projectColums: '',
			projectScores: `${project.projects.analysisPricing}`,
			nameData: 'analysisPricing',
		},
		{
			key: '15',
			params: '<span>Прибыль за месяц<br /><small>(0 = 250, 1 = 500, 2 = 750, 3 = 1000, 4 = 1250, 5 = 1500, 6 = 1750, 7 = 2000, 8 = 2250, 9 = 2500, 10 = 2750, 11 = 3000, 12 = 3250) </small></span>',
			projectColums: '',
			projectScores: `${project.projects.analysisMonthProfit}`,
			nameData: 'analysisMonthProfit',
		},
		{
			key: '16',
			params: '<span>Загрузка <br /><small>0 - 12 баллов (из плана производства)</small></span>',
			projectColums: '',
			projectScores: `${project.projects.analysisLoading}`,
			nameData: 'analysisLoading',
		},
		{
			key: '17',
			params: '<span>Средний балл</span>',
			projectColums: '',
			projectScores: '51',
		},
		{
			key: '18',
			params: '<span style="font-size: 1.2rem;">Итого</span>',
			projectColums: '',
			projectScores: `${Number(
				project.projects.analysisRange +
				project.projects.analysisRoofArea +
				project.projects.analysisSpecification +
				project.projects.analysisRepairType +
				project.projects.analysisMaterial +
				project.projects.analysisMode +
				project.projects.analysisProperty +
				project.projects.analysisPaymentProcedure +
				project.projects.analysisReliability +
				project.projects.analysisRoofSystem +
				project.projects.analysisWorkPeriod +
				project.projects.analysisObjectLocation +
				project.projects.analysisOtherInfo +
				project.projects.analysisPricing +
				project.projects.analysisMonthProfit +
				project.projects.analysisLoading
			)}`,
		},
	];
	const saveProjectStatus = (status) => {
		changeProjectStatus(project.projects._id, status).then(data => {
			navigate("/projects", { replace: true })
		})
	}
	const handleSave = (row) => {
		const updateProject = data
		updateProject[row.nameData] = Number(row.projectScores)
		const formData = new FormData();
		formData.append('project', JSON.stringify(updateProject))
		editProjects(formData).then(data => {
			setEditState(!editState)
		})
	};
	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};
	const columns = defaultColumns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave,
			}),
		};
	});

	useEffect(() => {
		fetchOneProjects(project_id).then(d => {
			project.setProjects(d)
			setData(d)
		})
	}, [editState])

	return (
		<>
			<Title level={4}>Анализ привлекательности проекта: «{project.projects.projectName}»</Title>
			<Table
				components={components}
				rowClassName={() => 'editable-row'}
				columns={columns}
				dataSource={dataСolumns}
				pagination={false}
				className='analysis-table' />

			{project.projects.projectStatus == 'Входящая заявка' && isEdited ?
				<Space className='mt-2 mb-2'>
					<Button type='primary' onClick={() => saveProjectStatus('Коммерческие переговоры')}>Проект в статус "Коммерческие переговоры"</Button>
					<Button type='default' onClick={() => saveProjectStatus('Архив')} >Проект В архив</Button>
				</Space>
				: null}
		</>
	);
}

export default ProjectAnalysis;