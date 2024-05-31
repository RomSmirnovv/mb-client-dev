import React, { useState } from 'react';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';
import * as formik from 'formik';
import { addMaterialSchema } from '../../../pages/validationSchemas.js'
import { createMaterial } from '../../../services/MaterialService.js';

const AddMaterial = ({ show, onHide, authorBy, projectBy, chapterBy, subchapterBy, workBy, updateFiled }) => {
	const { Formik } = formik

	const addMaterial = async (values) => {
		const { name, units, quantity, unitCost, ratio } = values
		const material = { name, units, quantity, unitCost, ratio, projectBy, authorBy, workBy, chapterBy, subchapterBy, sign: 'МТР' }
		await createMaterial(material).then(data => {
			updateFiled()
			onHide()
		})
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Добавить материал в работе</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
						units: 'ед',
						quantity: 0,
						unitCost: 0,
						ratio: 0,
					}}
					validationSchema={addMaterialSchema}
					onSubmit={(values) => addMaterial(values)}
				>
					{({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
						<Form onSubmit={handleSubmit} noValidate>
							<Form.Group as={Col} md="12" controlId="name">
								<Form.Label>Название материала</Form.Label>
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
							<Row className='mt-2'>
								<Form.Group as={Col} md="6" controlId="units" className='mt-2'>
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
								<Form.Group as={Col} md="6" controlId="ratio" className='mt-2'>
									<Form.Label>K расхода </Form.Label>
									<Form.Control
										type="number"
										name="ratio"
										required
										value={values.ratio}
										onBlur={handleBlur}
										onChange={handleChange}
										isValid={touched.ratio && !errors.ratio}
										isInvalid={!!errors.ratio}
									/>
									<Form.Control.Feedback type="invalid">{errors.ratio}</Form.Control.Feedback>
								</Form.Group>
								<Form.Group as={Col} md="6" controlId="quantity" className='mt-2'>
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
								<Form.Group as={Col} md="6" controlId="unitCost" className='mt-2'>
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

export default AddMaterial;