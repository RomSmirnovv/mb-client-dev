import { useEffect, useRef, useState } from 'react'
import { Form, Input } from 'antd';
import { updateWork } from '../../services/WorkService';

const EditRowDate = ({ plannedExecution, actualExecution, initialDate, row, updateTable }) => {
	const [isEdit, setIsEdit] = useState(false)
	const inputRef = useRef(null);
	const [form] = Form.useForm();
	let plan
	let actual

	{
		plannedExecution && plannedExecution.length != 0 ?
			plannedExecution.filter(a => a.date == initialDate) && plannedExecution.filter(a => a.date == initialDate).length != 0 ? plan = plannedExecution.filter(a => a.date == initialDate)[0].quantity : null
			: null
	}
	{
		actualExecution && actualExecution.length != 0 ?
			actualExecution.filter(a => a.date == initialDate) && actualExecution.filter(a => a.date == initialDate).length != 0 ? actual = actualExecution.filter(a => a.date == initialDate)[0].quantity : null
			: null
	}

	const changeEdit = () => {
		setIsEdit(true)
		form.setFieldsValue({
			['editDate']: plan,
		});
	}

	const saveDate = async () => {
		setIsEdit(false)
		const values = await form.validateFields();
		if (values.editDate != '') {
			const oldQuantity = row.plannedExecution.filter(p => p.date == initialDate)[0].quantity
			row.plannedExecution.filter(p => p.date == initialDate)[0].quantity = Number(values.editDate)
			row.plannedExecutionSumm = row.plannedExecutionSumm - oldQuantity + Number(values.editDate)
		} else {
			const oldQuantity = row.plannedExecution.filter(p => p.date == initialDate)[0].quantity
			row.plannedExecutionSumm = row.plannedExecutionSumm - oldQuantity
			row.plannedExecution = row.plannedExecution.filter(p => p.date != initialDate)
		}
		updateWork(row).then(data => {
			updateTable()
		})
	}

	useEffect(() => {
		if (isEdit) {
			inputRef.current.focus();
		}
	}, [isEdit]);
	return (
		<>
			<div onClick={() => changeEdit()} >
				{isEdit ?
					<Form form={form}>
						<Form.Item
							name='editDate'
							style={{ 'width': '100px' }}
						>
							<Input
								className='edit-date-input'
								type='number'
								ref={inputRef}
								onPressEnter={saveDate}
								onBlur={saveDate} />
						</Form.Item>
					</Form>
					: <span>
						{plannedExecution && plannedExecution.length != 0 ?
							plannedExecution.filter(a => a.date == initialDate) && plannedExecution.filter(a => a.date == initialDate).length != 0 ? + plannedExecution.filter(a => a.date == initialDate)[0].quantity : null
							: null}
					</span>
				}

			</div >
			<div className={actual < plan ? 'danger' : actual > plan ? 'succsess' : null}>
				{actualExecution && actualExecution.length != 0 ?
					actualExecution.filter(a => a.date == initialDate) && actualExecution.filter(a => a.date == initialDate).length != 0 ? + actualExecution.filter(a => a.date == initialDate)[0].quantity : null
					: null}
			</div>
		</>
	);
}

export default EditRowDate;