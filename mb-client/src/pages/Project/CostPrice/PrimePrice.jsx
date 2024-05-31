import { Table, Col, Typography, Form } from 'antd'
import React, { useContext, useEffect, useState, useRef } from 'react';
const EditableContext = React.createContext(null);
import { fetchEspensesByProject } from '../../../services/EspenseService'

const { Title } = Typography

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
	}, [editing])

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
	if (editable && !record.nameData) {
		childNode = editing ? (
			<Form.Item
				style={{
					margin: 0,
					width: '80px',
				}}
				name={dataIndex}
			>
				{dataIndex == 'name' ? <Input type='text' ref={inputRef} onPressEnter={save} onBlur={save} /> : <Input type='number' ref={inputRef} onPressEnter={save} onBlur={save} />}
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

const PrimePrice = ({ estimateSumm, projectId, project }) => {
	const [editState, setEditState] = useState(false)
	const [orgExpenses, setOrgExpenses] = useState([])
	const [prodExpenses, setProdExpenses] = useState([])
	const [otherExpenses, setOtherExpenses] = useState([])
	const [salaryExpenses, setSalaryExpenses] = useState([])

	useEffect(() => {
		fetchEspensesByProject(projectId).then(data => {

			let newOrgExpenses = {
				name: 'Организационные расходы',
				allCost: (data.filter(e => e.category == 'Организационные расходы').reduce((accum, item) => accum + item.allCost, 0)).toFixed(2),
				factCost: (data.filter(e => e.category == 'Организационные расходы').reduce((accum, item) => accum + item.factCost, 0)).toFixed(2),
				nameData: 'calc',
			}
			setOrgExpenses(newOrgExpenses)

			let newProdExpenses = {
				name: 'Производственные расходы',
				allCost: (data.filter(e => e.category == 'Производственные расходы').reduce((accum, item) => accum + item.allCost, 0)).toFixed(2),
				factCost: (data.filter(e => e.category == 'Производственные расходы').reduce((accum, item) => accum + item.factCost, 0)).toFixed(2),
				nameData: 'calc',
			}
			setProdExpenses(newProdExpenses)

			let newOtherExpenses = {
				name: 'Прочие расходы',
				allCost: (data.filter(e => e.category == 'Прочие расходы').reduce((accum, item) => accum + item.allCost, 0)).toFixed(2),
				factCost: (data.filter(e => e.category == 'Прочие расходы').reduce((accum, item) => accum + item.factCost, 0)).toFixed(2),
				nameData: 'calc',
			}
			setOtherExpenses(newOtherExpenses)

			let newSalaryExpenses = {
				name: 'Зарплатные расходы',
				allCost: (data.filter(e => e.category == 'Зарплатные расходы').reduce((accum, item) => accum + item.allCost, 0)).toFixed(2),
				factCost: (data.filter(e => e.category == 'Зарплатные расходы').reduce((accum, item) => accum + item.factCost, 0)).toFixed(2),
				nameData: 'calc',
			}
			setSalaryExpenses(newSalaryExpenses)
		})
	}, [editState])


	const defaultColumns = [
		{
			title: '',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'План',
			dataIndex: 'allCost',
			key: 'allCost',
		},
		{
			title: 'Факт',
			dataIndex: 'factCost',
			key: 'factCost',
		},
	]
	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	}
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
	})

	const expenses = [
		{
			key: 1,
			name: 'Договор',
			allCost: project.estimateSumm,
			factCost: '',
		},
		prodExpenses,
		salaryExpenses,
		orgExpenses,
		otherExpenses,
		{
			key: 6,
			name: 'НДС с договора',
			allCost: (project.estimateSumm * 0.2 / 1.2).toFixed(2),
			factCost: '',
		},
		{
			key: 7,
			name: 'НДС с расходов',
			allCost: (orgExpenses.allCost * 0.2 / 1.2 + prodExpenses.allCost * 0.2 / 1.2 + otherExpenses.allCost * 0.2 / 1.2 + salaryExpenses.allCost * 0.2 / 1.2).toFixed(2),
			factCost: (orgExpenses.factCost * 0.2 / 1.2 + prodExpenses.factCost * 0.2 / 1.2 + otherExpenses.factCost * 0.2 / 1.2 + salaryExpenses.factCost * 0.2 / 1.2).toFixed(2),
		},
		{
			key: 8,
			name: 'Соц. Страх',
			allCost: project.socialInsPlan,
			factCost: project.socialInsFact,
		},
		{
			key: 9,
			name: 'НДФЛ',
			allCost: project.personalIncomeTaxPlan,
			factCost: project.personalIncomeTaxFact,
		},
		{
			key: 10,
			name: 'Прибыль до НО',
			allCost: (orgExpenses.allCost * 1 + prodExpenses.allCost * 1 + otherExpenses.allCost * 1 + salaryExpenses.allCost * 1 + project.estimateSumm * 0.2 / 1.2 + orgExpenses.allCost * 0.2 / 1.2 + prodExpenses.allCost * 0.2 / 1.2 + otherExpenses.allCost * 0.2 / 1.2 + salaryExpenses.allCost * 0.2 / 1.2 + project.socialInsPlan * 1 + project.personalIncomeTaxPlan * 1).toFixed(2),
			factCost: '',
		},
		{
			key: 11,
			name: 'Налог на прибыль',
			allCost: ((orgExpenses.allCost * 1 + prodExpenses.allCost * 1 + otherExpenses.allCost * 1 + salaryExpenses.allCost * 1 + project.estimateSumm * 0.2 / 1.2 + orgExpenses.allCost * 0.2 / 1.2 + prodExpenses.allCost * 0.2 / 1.2 + otherExpenses.allCost * 0.2 / 1.2 + salaryExpenses.allCost * 0.2 / 1.2 + project.socialInsPlan * 1 + project.personalIncomeTaxPlan * 1) * 0.2 / 1.2).toFixed(2),
			factCost: '',
		},
		{
			key: 12,
			name: 'Прибыль чистая',
			allCost: ((orgExpenses.allCost * 1 + prodExpenses.allCost * 1 + otherExpenses.allCost * 1 + salaryExpenses.allCost * 1 + project.estimateSumm * 0.2 / 1.2 + orgExpenses.allCost * 0.2 / 1.2 + prodExpenses.allCost * 0.2 / 1.2 + otherExpenses.allCost * 0.2 / 1.2 + salaryExpenses.allCost * 0.2 / 1.2 + project.socialInsPlan * 1 + project.personalIncomeTaxPlan * 1) - ((orgExpenses.allCost * 1 + prodExpenses.allCost * 1 + otherExpenses.allCost * 1 + salaryExpenses.allCost * 1 + project.estimateSumm * 0.2 / 1.2 + orgExpenses.allCost * 0.2 / 1.2 + prodExpenses.allCost * 0.2 / 1.2 + otherExpenses.allCost * 0.2 / 1.2 + salaryExpenses.allCost * 0.2 / 1.2 + project.socialInsPlan * 1 + project.personalIncomeTaxPlan * 1) * 0.2 / 1.2)).toFixed(2),
			factCost: '',
		},
		{
			key: 13,
			name: 'Процент прибыли',
			allCost: (((orgExpenses.allCost * 1 + prodExpenses.allCost * 1 + otherExpenses.allCost * 1 + salaryExpenses.allCost * 1 + project.estimateSumm * 0.2 / 1.2 + orgExpenses.allCost * 0.2 / 1.2 + prodExpenses.allCost * 0.2 / 1.2 + otherExpenses.allCost * 0.2 / 1.2 + salaryExpenses.allCost * 0.2 / 1.2 + project.socialInsPlan * 1 + project.personalIncomeTaxPlan * 1) - ((orgExpenses.allCost * 1 + prodExpenses.allCost * 1 + otherExpenses.allCost * 1 + salaryExpenses.allCost * 1 + project.estimateSumm * 0.2 / 1.2 + orgExpenses.allCost * 0.2 / 1.2 + prodExpenses.allCost * 0.2 / 1.2 + otherExpenses.allCost * 0.2 / 1.2 + salaryExpenses.allCost * 0.2 / 1.2 + project.socialInsPlan * 1 + project.personalIncomeTaxPlan * 1) * 0.2 / 1.2)) / project.estimateSumm).toFixed(2),
			factCost: '',
		},
		{
			key: 14,
			name: 'Требуемая прибыль',
			allCost: '20%',
			factCost: '',
		},
	]

	useEffect(() => {
	}, [])
	return (
		<>

			<Col md={24}>
				<div className='content-container'>
					<Title level={4}>Себестоимость проекта</Title>
					<Table
						pagination={false}
						className='mt-2 mb-1'
						components={components}
						rowClassName={() => 'editable-row'}
						columns={columns}
						dataSource={expenses} />
				</div>
			</Col>
		</>
	);
}

export default PrimePrice;