import React, { useState } from 'react';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';
import * as formik from 'formik';
import { addSubchapterSchema } from '../../../pages/validationSchemas.js'
import { createSubchapter } from '../../../services/SubchapterService.js';

const AddSubchapter = ({ show, onHide, authorBy, projectBy, chapterBy, updateFiled }) => {
	const [nameValue, setNameValue] = useState('')
	const { Formik } = formik

	const addSubchapter = async (name) => {
		const subchapter = { name, projectBy, authorBy, chapterBy, sign: 'ПРЗЛ' }
		await createSubchapter(subchapter).then(data => {
			updateFiled()
			onHide()
		})
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Добавить подраздел</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
					}}
					validationSchema={addSubchapterSchema}
					onSubmit={(values) => addSubchapter(values.name)}
				>
					{({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
						<Form onSubmit={handleSubmit} noValidate>
							<Form.Group as={Col} md="12" controlId="name">
								<Form.Label>Название подраздела</Form.Label>
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

export default AddSubchapter;