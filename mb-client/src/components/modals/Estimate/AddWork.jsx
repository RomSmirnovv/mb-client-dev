import React, { useState } from 'react';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';
import * as formik from 'formik';
import { addWorkSchema } from '../../../pages/validationSchemas.js'
import { createWork } from '../../../services/WorkService.js';
import { values } from 'mobx';

const AddWork = ({ show, onHide, authorBy, projectBy, chapterBy, subchapterBy, updateFiled }) => {
	const [nameValue, setNameValue] = useState('')
	const { Formik } = formik

	const addWork = async (values) => {
		let other = false
		let technic = false
		values.catWork == 'other' ? other = true : null
		values.catWork == 'technic' ? technic = true : null
		const { name, units, quantity, unitCost } = values
		const sign = technic ? 'ТЕХ' : 'СМР'
		const work = { name, units, quantity, unitCost, other, technic, projectBy, authorBy, chapterBy, subchapterBy, sign }
		await createWork(work).then(data => {
			updateFiled()
			onHide()
		})
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Добавить работу в раздел</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
						units: 'ед',
						quantity: 0,
						unitCost: 0,
						catWork: 'basic'

					}}
					validationSchema={addWorkSchema}
					onSubmit={(values) => addWork(values)}
				>
					{({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
						<Form onSubmit={handleSubmit} noValidate>
							<Form.Group as={Col} md="12" controlId="name">
								<Form.Label>Название работы</Form.Label>
								<Form.Control
									type="text"
									name="name"
									placeholder={"Введите название *"}
									required
									value={values.name}
									onBlur={handleBlur}
									onChange={handleChange}
									isValid={touched.name && !errors.name}
									isInvalid={!!errors.name}
								/>
								<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
							</Form.Group>
							<Form.Group as={Col} md="12" controlId="units">
								<Form.Label>Единицы измерения</Form.Label>
								<Form.Control
									type="text"
									name="units"
									required
									value={values.units}
									onBlur={handleBlur}
									onChange={handleChange}
									isValid={touched.units && !errors.units}
									isInvalid={!!errors.units}
								/>
								<Form.Control.Feedback type="invalid">{errors.units}</Form.Control.Feedback>
							</Form.Group>
							<Row>
								<Form.Group as={Col} md="6" controlId="quantity">
									<Form.Label>Количество <br />по смете</Form.Label>
									<Form.Control
										type="number"
										name="quantity"
										required
										value={values.quantity}
										onBlur={handleBlur}
										onChange={handleChange}
										isValid={touched.quantity && !errors.quantity}
										isInvalid={!!errors.quantity}
									/>
									<Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
								</Form.Group>
								<Form.Group as={Col} md="6" controlId="unitCost">
									<Form.Label>Стоимость за единицу, <br />с учетом НДС 20%</Form.Label>
									<Form.Control
										type="number"
										name="unitCost"
										required
										value={values.unitCost}
										onBlur={handleBlur}
										onChange={handleChange}
										isValid={touched.unitCost && !errors.unitCost}
										isInvalid={!!errors.unitCost}
									/>
									<Form.Control.Feedback type="invalid">{errors.unitCost}</Form.Control.Feedback>
								</Form.Group>
							</Row>
							<Form.Group as={Col} md="12" controlId="catWork" className='mt-3'>
								<Form.Check
									type="radio"
									label="Основная"
									id="basic"
									name="catWork"
									value="basic"
									checked={values.catWork === 'basic'}
									onChange={handleChange}
								/>
								<Form.Check
									type="radio"
									id="other"
									name="catWork"
									value="other"
									label="Дополнительная"
									checked={values.catWork === 'other'}
									onChange={handleChange}
								/>
								<Form.Check
									type="radio"
									id="technic"
									name="catWork"
									label="Техника"
									value="technic"
									checked={values.catWork === 'technic'}
									onChange={handleChange}
								/>
							</Form.Group>
							<Button type="submit" className='me-2 mt-3' variant={"primary"}>
								Добавить
							</Button>
							<Button variant={"outline-secondary"} className='mt-3' onClick={onHide}>
								Закрыть
							</Button>
						</Form>
					)}
				</Formik>
			</Modal.Body>
		</Modal>
	);
}

export default AddWork;