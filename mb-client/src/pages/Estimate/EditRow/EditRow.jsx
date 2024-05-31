import React, { useEffect, useState } from 'react';
import { Button, Switch, Form, Input, Row, Col } from 'antd';
import { deleteChapter, updateChapter } from '../../../services/ChapterService';
import { deleteSubchapter, deleteSubchaptersByChapter, updateSubchapter } from '../../../services/SubchapterService';
import { deleteWork, deleteWorksByChapter, deleteWorksBySubchapter, updateWork } from '../../../services/WorkService';
import { deleteMaterial, deleteMaterialsByChapter, deleteMaterialsBySubchapter, deleteMaterialsByWork, updateMaterial } from '../../../services/MaterialService';
import { deleteEspense, deleteEspensesByChapter, deleteEspensesBySubchapter, updateEspense } from '../../../services/EspenseService';

const EditRow = ({ row, updateTable, handleOk }) => {

	let fields = []
	if (row.sign == 'РЗЛ' || row.sign == 'ПРЗЛ') {
		fields = [
			{
				name: ['name'],
				value: row.name ? row.name : ''
			},
			{
				name: ['comment'],
				value: row.comment ? row.comment : ''
			},
		]
	}
	if (row.sign == 'СМР') {
		fields = [
			{
				name: ['name'],
				value: row.name ? row.name : ''
			},
			{
				name: ['comment'],
				value: row.comment ? row.comment : ''
			},
			{
				name: ['units'],
				value: row.units ? row.units : ''
			},
			{
				name: ['quantity'],
				value: row.quantity ? row.quantity : ''
			},
			{
				name: ['unitCost'],
				value: row.unitCost ? row.unitCost : ''
			},
			{
				name: ['ratio'],
				value: row.ratio ? row.ratio : ''
			},
		]
	}
	if (row.sign == 'МТР' || row.sign == 'ТЕХ') {
		fields = [
			{
				name: ['name'],
				value: row.name ? row.name : ''
			},
			{
				name: ['comment'],
				value: row.comment ? row.comment : ''
			},
			{
				name: ['units'],
				value: row.units ? row.units : ''
			},
			{
				name: ['quantity'],
				value: row.quantity ? row.quantity : ''
			},
			{
				name: ['unitCost'],
				value: row.unitCost ? row.unitCost : ''
			},
			{
				name: ['other'],
				value: row.other
			},
			{
				name: ['technic'],
				value: row.technic
			},
		]
	}
	if (row.sign == 'СР') {
		fields = [
			{
				name: ['name'],
				value: row.name ? row.name : ''
			},
			{
				name: ['comment'],
				value: row.comment ? row.comment : ''
			},
			{
				name: ['units'],
				value: row.units ? row.units : ''
			},
			{
				name: ['quantity'],
				value: row.quantity ? row.quantity : ''
			},
			{
				name: ['unitCost'],
				value: row.unitCost ? row.unitCost : ''
			},
		]
	}

	const onChange = (checked) => {
	}

	const saveRow = (values) => {
		if (row.sign == 'РЗЛ') {
			const newChapter = {
				_id: row._id,
				name: values.name,
				comment: values.comment
			}
			updateChapter(newChapter).then(data => {
				handleOk()
				updateTable()
			})
		}
		if (row.sign == 'ПРЗЛ') {
			const newSubchapter = {
				_id: row._id,
				name: values.name,
				comment: values.comment
			}
			updateSubchapter(newSubchapter).then(data => {
				handleOk()
				updateTable()
			})
		}
		if (row.sign == 'СМР' || row.sign == 'ТЕХ') {
			const newWork = {
				_id: row._id,
				name: values.name,
				comment: values.comment,
				units: values.units,
				quantity: values.quantity || 0,
				unitCost: values.unitCost || 0,
				technic: values.technic || false,
				other: values.other || false
			}
			updateWork(newWork).then(data => {
				handleOk()
				updateTable()
			})
		}
		if (row.sign == 'МТР') {
			const newMaterial = {
				_id: row._id,
				name: values.name,
				comment: values.comment,
				units: values.units,
				quantity: values.quantity || 0,
				unitCost: values.unitCost || 0,
				ratio: values.ratio,
			}
			updateMaterial(newMaterial).then(data => {
				handleOk()
				updateTable()
			})
		}
		if (row.sign == 'СР') {
			const newEspense = {
				_id: row._id,
				name: values.name,
				comment: values.comment,
				units: values.units,
				quantity: values.quantity || 0,
				unitCost: values.unitCost || 0,
			}
			updateEspense(newEspense).then(data => {
				handleOk()
				updateTable()
			})
		}
	}
	const deleteRow = (row) => {
		if (row.sign == 'РЗЛ') {
			deleteChapter(row._id).then(data => {
				deleteSubchaptersByChapter(row._id).then(data => {
					deleteWorksByChapter(row._id).then(data => {
						deleteMaterialsByChapter(row._id).then(data => {
							deleteEspensesByChapter(row._id).then(data => {
								handleOk()
								updateTable()
							})
						})
					})
				})
			})
		}
		if (row.sign == 'РСР') {
			deleteChapter(row._id).then(data => {
				deleteSubchaptersByChapter(row._id).then(data => {
					deleteEspensesByChapter(row._id).then(data => {
						handleOk()
						updateTable()
					})
				})
			})
		}
		if (row.sign == 'ПРЗЛ') {
			deleteSubchapter(row._id).then(data => {
				deleteWorksBySubchapter(row._id).then(data => {
					deleteMaterialsBySubchapter(row._id).then(data => {
						deleteEspensesBySubchapter(row._id).then(data => {
							handleOk()
							updateTable()
						})
					})
				})
			})
		}
		if (row.sign == 'СМР' || row.sign == 'ТЕХ') {
			deleteWork(row._id).then(data => {
				deleteMaterialsByWork(row._id).then(data => {
					handleOk()
					updateTable()
				})
			})
		}
		if (row.sign == 'СР') {
			deleteEspense(row._id).then(data => {
				handleOk()
				updateTable()
			})
		}
		if (row.sign == 'МТР') {
			deleteMaterial(row._id).then(data => {
				handleOk()
				updateTable()
			})
		}
	}
	return (
		<Form
			name="rowEdit"
			layout='vertical'
			onFinish={saveRow}
			fields={fields}
		>
			<Form.Item
				label="Название"
				name="name"
				rules={[
					{
						required: true,
						message: 'Введите название!',
					},
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="Примечание"
				name="comment"
			>
				<Input />
			</Form.Item>
			{row.sign == 'СМР' || row.sign == 'ТЕХ' ? <>
				<Form.Item
					label="Ед.измерения"
					name="units"
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Количество"
					name="quantity"
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Стоимость за ед., с учетом НДС 20%"
					name="unitCost"
				>
					<Input />
				</Form.Item>
				<Row gutter={20}>
					<Col md={12}>
						<Form.Item
							label="Дополнительная работа"
							name="other"
						>
							<Switch />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							label="Техника"
							name="technic"
						>
							<Switch />
						</Form.Item>
					</Col>
				</Row>
			</> : null}
			{row.sign == 'МТР' ? <>
				<Form.Item
					label="Ед.измерения"
					name="units"
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Количество"
					name="quantity"
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Стоимость за ед., с учетом НДС 20%"
					name="unitCost"
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="К расхода"
					name="ratio"
				>
					<Input />
				</Form.Item>
			</> : null}
			{row.sign == 'СР' ? <>
				<Form.Item
					label="Ед.измерения"
					name="units"
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Количество"
					name="quantity"
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Стоимость за ед., с учетом НДС 20%"
					name="unitCost"
				>
					<Input />
				</Form.Item>
			</> : null}
			<Form.Item>
				<Button htmlType='submit'> Сохранить</Button>
				<Button className='ml-2' danger onClick={() => deleteRow(row)}> Удалить</Button>
			</Form.Item>
		</Form >
	)
}

export default EditRow;