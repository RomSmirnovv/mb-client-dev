import React, { useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import * as formik from 'formik';
import { addChapterSchema } from '../../../pages/validationSchemas.js'
import { createChapter } from '../../../services/ChapterService.js';

const AddChapter = ({ show, onHide, authorBy, projectBy, updateFiled }) => {
	const [nameValue, setNameValue] = useState('')
	const { Formik } = formik

	const addChapter = async (name) => {
		const chapter = { name, projectBy, authorBy, sign: 'РЗЛ' }
		console.log(chapter)
		await createChapter(chapter).then(data => {
			updateFiled()
			onHide()
		})
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Добавить раздел</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
					}}
					validationSchema={addChapterSchema}
					onSubmit={(values) => addChapter(values.name)}
				>
					{({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
						<Form onSubmit={handleSubmit} noValidate>
							<Form.Group as={Col} md="12" controlId="name">
								<Form.Label>Название раздела</Form.Label>
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

export default AddChapter;