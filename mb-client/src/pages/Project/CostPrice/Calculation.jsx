import { Table, Col, Typography, Button, Form, Input } from 'antd'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useState, useRef } from 'react';
const EditableContext = React.createContext(null);
import { createEspense, deleteEspense, fetchEspensesByProject, updateEspense } from '../../../services/EspenseService'

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

const Calculation = ({ projectId }) => {
	const [editState, setEditState] = useState(false)
	const [orgExpenses, setOrgExpenses] = useState([])
	const [prodExpenses, setProdExpenses] = useState([])
	const [otherExpenses, setOtherExpenses] = useState([])
	const [salaryExpenses, setSalaryExpenses] = useState([])

	const defaultColumns = [
		{
			title: 'Расходы',
			dataIndex: 'name',
			key: 'name',
			editable: true,
		},
		{
			title: 'План',
			dataIndex: 'allCost',
			key: 'allCost',
			editable: true,
		},
		{
			title: 'НДС',
			dataIndex: 'allCostVAT',
			key: 'allCostVAT',
		},
		{
			title: 'Факт',
			dataIndex: 'factCost',
			key: 'factCost',
			editable: true,
		},
		{
			title: '',
			dataIndex: '_id',
			key: '_id',
			render: (text) => text ? <DeleteOutlined className='table__delete__icon' onClick={() => removeEspense(text)} /> : null
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

	const removeEspense = (id) => {
		deleteEspense(id).then(data => {
			setEditState(!editState)
		})
	}

	const addRowExpenses = (category) => {
		const expense = {
			projectBy: projectId,
			category: category,
			name: '',
			units: '',
			quantity: 0,
			unitCost: 0,
			allCost: 0
		}
		createEspense(expense).then(data => {
			setEditState(!editState)
		})
	}
	const handleSave = (row) => {
		console.log(row)
		updateEspense(row).then(data => {
			setEditState(!editState)
		})
	}

	useEffect(() => {
		fetchEspensesByProject(projectId).then(data => {

			let newOrgExpenses = data.filter(e => e.category == 'Организационные расходы')
			newOrgExpenses.push({
				name: 'Итого',
				allCost: (newOrgExpenses.reduce((accum, item) => accum + item.allCost, 0)).toFixed(2),
				allCostVAT: (newOrgExpenses.reduce((accum, item) => accum + item.allCostVAT, 0)).toFixed(2),
				factCost: (newOrgExpenses.reduce((accum, item) => accum + item.factCost, 0)).toFixed(2),
				nameData: 'calc',
			})
			setOrgExpenses(newOrgExpenses)

			let newProdExpenses = data.filter(e => e.category == 'Производственные расходы')
			newProdExpenses.push({
				name: 'Итого',
				allCost: (newProdExpenses.reduce((accum, item) => accum + item.allCost, 0)).toFixed(2),
				allCostVAT: (newProdExpenses.reduce((accum, item) => accum + item.allCostVAT, 0)).toFixed(2),
				factCost: (newProdExpenses.reduce((accum, item) => accum + item.factCost, 0)).toFixed(2),
				nameData: 'calc',
			})
			setProdExpenses(newProdExpenses)

			let newOtherExpenses = data.filter(e => e.category == 'Прочие расходы')
			newOtherExpenses.push({
				name: 'Итого',
				allCost: (newOtherExpenses.reduce((accum, item) => accum + item.allCost, 0)).toFixed(2),
				allCostVAT: (newOtherExpenses.reduce((accum, item) => accum + item.allCostVAT, 0)).toFixed(2),
				factCost: (newOtherExpenses.reduce((accum, item) => accum + item.factCost, 0)).toFixed(2),
				nameData: 'calc',
			})
			setOtherExpenses(newOtherExpenses)

			let newSalaryExpenses = data.filter(e => e.category == 'Зарплатные расходы')
			newSalaryExpenses.push({
				name: 'Итого',
				allCost: (newSalaryExpenses.reduce((accum, item) => accum + item.allCost, 0)).toFixed(2),
				allCostVAT: (newSalaryExpenses.reduce((accum, item) => accum + item.allCostVAT, 0)).toFixed(2),
				factCost: (newSalaryExpenses.reduce((accum, item) => accum + item.factCost, 0)).toFixed(2),
				nameData: 'calc',
			})
			setSalaryExpenses(newSalaryExpenses)
		})
	}, [editState])

	return (
		<>

			<Col md={24}>
				<div className='content-container'>
					<Title level={4}>Организационные расходы</Title>
					<Table
						pagination={false}
						className='mt-2 mb-1'
						components={components}
						rowClassName={() => 'editable-row'}
						columns={columns}
						dataSource={orgExpenses} />
					<Button type="dashed" primary icon={<PlusCircleOutlined />} onClick={() => addRowExpenses('Организационные расходы')}>Добавить строчку</Button>
				</div>
			</Col>
			<Col md={24}>
				<div className='content-container'>
					<Title level={4}>Производственные расходы</Title>
					<Table
						pagination={false}
						className='mt-2 mb-1'
						components={components}
						rowClassName={() => 'editable-row'}
						columns={columns}
						dataSource={prodExpenses} />
					<Button type="dashed" primary icon={<PlusCircleOutlined />} onClick={() => addRowExpenses('Производственные расходы')}>Добавить строчку</Button>
				</div>
			</Col>
			<Col md={24}>
				<div className='content-container'>
					<Title level={4}>Прочие расходы</Title>
					<Table
						pagination={false}
						className='mt-2 mb-1'
						components={components}
						rowClassName={() => 'editable-row'}
						columns={columns}
						dataSource={otherExpenses} />
					<Button type="dashed" primary icon={<PlusCircleOutlined />} onClick={() => addRowExpenses('Прочие расходы')}>Добавить строчку</Button>
				</div>
			</Col>
			<Col md={24}>
				<div className='content-container'>
					<Title level={4}>Зарплатные расходы</Title>
					<Table
						pagination={false}
						className='mt-2 mb-1'
						components={components}
						rowClassName={() => 'editable-row'}
						columns={columns}
						dataSource={salaryExpenses} />
					<Button type="dashed" primary icon={<PlusCircleOutlined />} onClick={() => addRowExpenses('Зарплатные расходы')}>Добавить строчку</Button>
				</div>
			</Col>
		</>

	);
}

export default Calculation;