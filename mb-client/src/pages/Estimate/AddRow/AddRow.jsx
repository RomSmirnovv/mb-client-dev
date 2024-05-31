import React, { useEffect, useState } from 'react';
import { Button, Switch, Form, Input, Row, Col } from 'antd';
import { createChapter, fetchOneChapter } from '../../../services/ChapterService';
import { createSubchapter, fetchOneSubchapter } from '../../../services/SubchapterService';
import { createWork, fetchOneWork } from '../../../services/WorkService';
import { createMaterial, fetchOneMaterial } from '../../../services/MaterialService';
import { createEspense, fetchOneEspense } from '../../../services/EspenseService';

const AddRow = ({ row, updateTable, handleOk }) => {
	const [form] = Form.useForm();

	const addRow = (values) => {
		if (row.sign == 'РЗЛ') {
			const chapter = {
				name: values.name,
				comment: values.comment,
				sign: 'РЗЛ',
				authorBy: row.authorBy,
				projectBy: row.projectBy
			}
			createChapter(chapter).then(data => {
				form.resetFields()
				handleOk()
				updateTable()
			})
		}
		if (row.sign == 'ПРЗЛ') {
			fetchOneSubchapter(row._id).then(subchapter => {
				const newSubchapter = {
					name: values.name,
					comment: values.comment,
					sign: 'ПРЗЛ',
					authorBy: row.authorBy,
					projectBy: row.projectBy,
					chapterBy: subchapter.chapterBy
				}
				createSubchapter(newSubchapter).then(data => {
					form.resetFields()
					handleOk()
					updateTable()
				})
			})
		}
		if (row.sign == 'СМР' || row.sign == 'ТЕХ') {
			fetchOneWork(row._id).then(work => {
				const newWork = {
					name: values.name,
					comment: values.comment,
					units: values.units,
					quantity: values.quantity,
					unitCost: values.unitCost,
					other: values.other,
					technic: values.technic,
					sign: values.technic ? 'ТЕХ' : 'СМР',
					authorBy: row.authorBy,
					projectBy: row.projectBy,
					chapterBy: work.chapterBy,
					subchapterBy: work.subchapterBy
				}
				createWork(newWork).then(data => {
					form.resetFields()
					handleOk()
					updateTable()
				})
			})
		}
		if (row.sign == 'МТР') {
			fetchOneMaterial(row._id).then(material => {
				const newMaterial = {
					name: values.name,
					comment: values.comment,
					units: values.units,
					quantity: values.quantity,
					unitCost: values.unitCost,
					ratio: values.ratio,
					sign: 'МТР',
					authorBy: row.authorBy,
					projectBy: row.projectBy,
					chapterBy: material.chapterBy,
					subchapterBy: material.subchapterBy,
					workBy: material.workBy
				}
				createMaterial(newMaterial).then(data => {
					form.resetFields()
					handleOk()
					updateTable()
				})
			})
		}
		if (row.sign == 'СР') {
			fetchOneEspense(row._id).then(espense => {
				const newEspense = {
					name: values.name,
					comment: values.comment,
					units: values.units,
					quantity: values.quantity,
					unitCost: values.unitCost,
					sign: 'СР',
					authorBy: row.authorBy,
					projectBy: row.projectBy,
					chapterBy: espense.chapterBy,
					subchapterBy: espense.subchapterBy
				}
				createEspense(newEspense).then(data => {
					form.resetFields()
					handleOk()
					updateTable()
				})
			})
		}
	}

	return (
		<Form
			form={form}
			name="rowAdd"
			layout='vertical'
			onFinish={addRow}
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
				initialValue={''}
			>
				<Input />
			</Form.Item>
			{row.sign == 'СМР' || row.sign == 'ТЕХ' ? <>
				<Form.Item
					label="Ед.измерения"
					name="units"
					initialValue={''}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Количество"
					name="quantity"
					initialValue={0}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Стоимость за ед., с учетом НДС 20%"
					name="unitCost"
					initialValue={0}
				>
					<Input />
				</Form.Item>
				<Row gutter={20}>
					<Col md={12}>
						<Form.Item
							label="Дополнительная работа"
							name="other"
							initialValue={false}
						>
							<Switch />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							label="Техника"
							name="technic"
							initialValue={false}
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
					initialValue={''}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Количество"
					name="quantity"
					initialValue={0}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Стоимость за ед., с учетом НДС 20%"
					name="unitCost"
					initialValue={0}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="К расхода"
					name="ratio"
					initialValue={''}
				>
					<Input />
				</Form.Item>
			</> : null}
			{row.sign == 'СР' ? <>
				<Form.Item
					label="Ед.измерения"
					name="units"
					initialValue={''}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Количество"
					name="quantity"
					initialValue={0}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Стоимость за ед., с учетом НДС 20%"
					name="unitCost"
					initialValue={0}
				>
					<Input />
				</Form.Item>
			</> : null}
			<Form.Item>
				<Button htmlType='submit'> Добавить</Button>
			</Form.Item>
		</Form >
	)
}

export default AddRow;