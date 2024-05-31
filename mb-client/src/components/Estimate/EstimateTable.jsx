import { Fragment, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import { Save, Trash, XSquare, NodePlus, CheckSquare, CheckSquareFill } from 'react-bootstrap-icons';
import './Estimate.css'
import { updateChapter, deleteChapter } from '../../services/ChapterService.js'
import { updateSubchapter, deleteSubchapter, deleteSubchaptersByChapter } from '../../services/SubchapterService.js';
import { updateWork, deleteWorksByChapter, deleteWorksBySubchapter, deleteWork } from '../../services/WorkService.js'
import { updateMaterial, deleteMaterialsByChapter, deleteMaterialsBySubchapter, deleteMaterialsByWork, deleteMaterial } from '../../services/MaterialService.js'
import { deleteShipmentsByChapter, deleteShipmentsBySubchapter, deleteShipmentsByWork, deleteShipmentsByMaterial } from '../../services/ShipmentService.js'
import AddChapter from '../modals/Estimate/AddChapter.jsx';
import AddSubchapter from '../modals/Estimate/AddSubchapter.jsx';
import AddEspense from '../modals/Estimate/AddEspense.jsx'
import AddWork from '../modals/Estimate/AddWork.jsx';
import AddMaterial from '../modals/Estimate/AddMaterial.jsx';
import { Number, Currency } from "react-intl-number-format"
import { deleteEspense, deleteEspensesByChapter, deleteEspensesBySubchapter, updateEspense } from '../../services/EspenseService.js';

const EstimateTable = ({ chapters, subchapters, works, espens, materials, projectId, authorBy, updateFiled }) => {
	const [isEditMode, setIsEditMode] = useState(false)
	const [rowIDToEdit, setRowIDToEdit] = useState(undefined);
	const [fieldNameToEdit, setFieldNameToEdit] = useState(undefined);
	const [editedRow, setEditedRow] = useState();
	const [isState, setIsState] = useState(false)
	const [chapterAddVisible, setChapterAddVisible] = useState(false)
	const [workAddVisible, setWorkAddVisible] = useState(false)
	const [espenseAddVisible, setEspenseAddVisible] = useState(false)
	const [subchapterAddVisible, setSubchapterAddVisible] = useState(false)
	const [materialAddVisible, setMaterialAddVisible] = useState(false)
	const [activeChapterBy, setActiveChapterBy] = useState('')
	const [activeSubchapterBy, setActiveSubchapterBy] = useState('')
	const [activeWorkBy, setActiveWorkBy] = useState('')

	const editField = (e, id, name) => {
		setIsEditMode(true)
		setRowIDToEdit(undefined);
		setRowIDToEdit(id);
		setFieldNameToEdit(undefined);
		setFieldNameToEdit(name);
	}
	const closeEditField = (id) => {
		setIsEditMode(false)
		setEditedRow(undefined);
		setRowIDToEdit(id);
	}
	const saveChapter = async (e, id) => {
		await updateChapter(editedRow).then((chapter) => {
			closeEditField(id)
			updateFiled()
		})
	}
	const saveSubchapter = async (e, id) => {
		await updateSubchapter(editedRow).then((subchapter) => {
			closeEditField(id)
			updateFiled()
		})
	}
	const saveWork = async (e, id) => {
		await updateWork(editedRow).then((work) => {
			closeEditField(id)
			updateFiled()
		})
	}
	const saveEspense = async (e, id) => {
		await updateEspense(editedRow).then((espense) => {
			closeEditField(id)
			updateFiled()
		})
	}
	const saveMaterial = async (e, id) => {
		await updateMaterial(editedRow).then((material) => {
			closeEditField(id)
			updateFiled()
		})
	}
	const handleOnChangeField = (e, id) => {
		const { name: fieldName, value } = e.target;
		setEditedRow({
			_id: id,
			[fieldName]: value
		})
	}
	const delChapter = async (id) => {
		await deleteChapter(id).then(data => {
			deleteSubchaptersByChapter(id).then(data => {
				deleteWorksByChapter(id).then(data => {
					deleteMaterialsByChapter(id).then(data => {
						deleteShipmentsByChapter(id).then(data => {
							updateFiled()
						})
					})
				})
				deleteEspensesByChapter(id)
			})
		})
	}
	const delSubchapter = async (id) => {
		await deleteSubchapter(id).then(data => {
			deleteWorksBySubchapter(id).then(data => {
				deleteMaterialsBySubchapter(id).then(data => {
					deleteShipmentsBySubchapter(id).then(data => {
						updateFiled()
					})
				})
			})
			deleteEspensesBySubchapter(id)
		})
	}
	const delWork = async (id) => {
		await deleteWork(id).then(data => {
			deleteMaterialsByWork(id).then(data => {
				deleteShipmentsByWork(id).then(data => {
					updateFiled()
				})
			})
		})
	}
	const delEspense = async (id) => {
		await deleteEspense(id).then(data => {
			updateFiled()
		})
	}
	const delMaterial = async (id) => {
		await deleteMaterial(id).then(data => {
			deleteShipmentsByMaterial(id).then(data => {
				updateFiled()
			})
		})
	}
	const openAddSubchapterModal = (chapterBy) => {
		setActiveChapterBy(chapterBy)
		setSubchapterAddVisible(true)
	}
	const openAddWorkModal = (chapterBy, subchapterBy) => {
		setActiveChapterBy(chapterBy)
		setActiveSubchapterBy(subchapterBy)
		setWorkAddVisible(true)
	}
	const openAddEspenseModal = (chapterBy, subchapterBy) => {
		setActiveChapterBy(chapterBy)
		setActiveSubchapterBy(subchapterBy)
		setEspenseAddVisible(true)
	}
	const openAddMaterialModal = (chapterBy, subchapterBy, workId) => {
		setActiveChapterBy(chapterBy)
		setActiveSubchapterBy(subchapterBy)
		setActiveWorkBy(workId)
		setMaterialAddVisible(true)
	}
	const saveOtherByWork = async (_id, other) => {
		const work = { _id, other: !other }
		await updateWork(work).then((work) => {
			updateFiled()
		})
	}

	return (
		<>
			<Table bordered hover responsive className='bs-transparent default-table'>
				<thead>
					<tr>
						<th>№</th>
						<th style={{ minWidth: '300px' }} className='name-row title-name-row'>
							Наименование
							<NodePlus title="Добавить раздел" onClick={() => setChapterAddVisible(true)} />
						</th>
						<th>Ед. изм.</th>
						<th>Признак</th>
						<th>К расхода</th>
						<th>Количество <br />по смете</th>
						<th>Стоимость за ед., <br />с учетом НДС 20%</th>
						<th>Стоимость всего., <br />с учетом НДС 20%</th>
						<th colSpan={2}>Примечания</th>
					</tr>
				</thead>
				<tbody>
					{chapters.filter(c => c.sign == 'РЗЛ').map((chapter, idx) => (
						<Fragment key={idx}>
							<tr className='table-success table-success-chapter'>
								<td>{idx + 1}</td>
								<td className='name-row'>
									{isEditMode && fieldNameToEdit === 'name' && rowIDToEdit === chapter._id
										?
										<Form.Group className='field-group'>
											<Form.Control
												as="textarea"
												rows="2"
												type='text'
												defaultValue={editedRow ? editedRow.name : chapter.name}
												id={chapter._id}
												name='name'
												onChange={(e) => handleOnChangeField(e, chapter._id)}
											/>
											<div className='field-buttons'>
												{!editedRow ? null : <Save onClick={(e) => saveChapter(e, chapter._id)} />}
												<XSquare onClick={(e) => closeEditField(e, chapter._id, 'name')} />
											</div>
										</Form.Group>
										: <>
											<b onClick={(e) => editField(e, chapter._id, 'name')}>{chapter.name}</b>
											<NodePlus title={`Добавить подраздел в "${chapter.name}"`} onClick={() => openAddSubchapterModal(chapter._id)} />
										</>
									}
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td className='name-row'>
									{isEditMode && fieldNameToEdit === 'comment' && rowIDToEdit === chapter._id
										?
										<Form.Group className='field-group'>
											<Form.Control
												as="textarea"
												rows="2"
												type='text'
												defaultValue={editedRow ? editedRow.comment : chapter.comment}
												id={chapter._id}
												name='comment'
												onChange={(e) => handleOnChangeField(e, chapter._id)}
											/>
											<div className='field-buttons'>
												{!editedRow ? null : <Save onClick={(e) => saveChapter(e, chapter._id)} />}
												<XSquare onClick={(e) => closeEditField(e, chapter._id, 'comment')} />
											</div>
										</Form.Group>
										: <>
											<b onClick={(e) => editField(e, chapter._id, 'comment')}>{chapter.comment}</b>
										</>
									}
								</td>
								<td className='delete-field'>
									{chapter.sign == 'РЗЛ'
										?
										<Trash onClick={(e) => delChapter(chapter._id)} />
										: null}
								</td>
							</tr>
							{subchapters.filter(sc => sc.chapterBy === chapter._id).map((subchapter, i) => (
								<Fragment key={i}>
									<tr className='table-success'>
										<td>{idx + 1}.{i + 1}</td>
										<td className='name-row'>
											{isEditMode && fieldNameToEdit === 'name' && rowIDToEdit === subchapter._id
												?
												<Form.Group className='field-group'>
													<Form.Control
														as="textarea"
														rows="2"
														type='text'
														defaultValue={editedRow ? editedRow.name : subchapter.name}
														id={subchapter._id}
														name='name'
														onChange={(e) => handleOnChangeField(e, subchapter._id)}
													/>
													<div className='field-buttons'>
														{!editedRow ? null : <Save onClick={(e) => saveSubchapter(e, subchapter._id)} />}
														<XSquare onClick={(e) => closeEditField(e, subchapter._id, 'name')} />
													</div>
												</Form.Group>
												: <>
													<b onClick={(e) => editField(e, subchapter._id, 'name')}>{subchapter.name}</b>
													{chapter.sign == 'РСР' ?
														<NodePlus title={`Добавить сопутствующие расход "${subchapter.name}"`} onClick={() => openAddEspenseModal(chapter._id, subchapter._id)} />
														:
														<NodePlus title={`Добавить работу в "${subchapter.name}"`} onClick={() => openAddWorkModal(chapter._id, subchapter._id)} />
													}
												</>
											}

										</td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td className='name-row'>
											{isEditMode && fieldNameToEdit === 'comment' && rowIDToEdit === subchapter._id
												?
												<Form.Group className='field-group'>
													<Form.Control
														as="textarea"
														rows="2"
														type='text'
														defaultValue={editedRow ? editedRow.comment : subchapter.comment}
														id={subchapter._id}
														name='comment'
														onChange={(e) => handleOnChangeField(e, subchapter._id)}
													/>
													<div className='field-buttons'>
														{!editedRow ? null : <Save onClick={(e) => saveSubchapter(e, subchapter._id)} />}
														<XSquare onClick={(e) => closeEditField(e, subchapter._id, 'comment')} />
													</div>
												</Form.Group>
												: <>
													<b onClick={(e) => editField(e, subchapter._id, 'comment')}>{subchapter.comment}</b>
												</>
											}

										</td>
										<td className='delete-field'>
											<Trash onClick={(e) => delSubchapter(subchapter._id)} />
										</td>
									</tr>

									{works.filter(w => w.subchapterBy === subchapter._id).map((work, с) => (
										<Fragment key={с}>
											<tr className={work.other ? 'table-warning' : work.sign === 'ТЕХ' ? 'table-technic' : 'default-row'}>
												<td>{idx + 1}.{i + 1}.{с + 1}</td>
												<td className='name-row'>
													{isEditMode && fieldNameToEdit === 'name' && rowIDToEdit === work._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																as="textarea"
																rows="2"
																type='text'
																defaultValue={editedRow ? editedRow.name : work.name}
																id={work._id}
																name='name'
																onChange={(e) => handleOnChangeField(e, work._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveWork(e, work._id)} />}
																<XSquare onClick={(e) => closeEditField(e, work._id, 'name')} />
															</div>
														</Form.Group>
														:
														<>
															<span onClick={(e) => editField(e, work._id, 'name')}>{work.name}</span>
															<NodePlus title={`Добавить материал в "${work.name}"`} onClick={() => openAddMaterialModal(chapter._id, subchapter._id, work._id)} />
															{work.sign == 'СМР' ?
																<>
																	{work.other ? <CheckSquareFill onClick={(e) => saveOtherByWork(work._id, work.other)} title='Сделать работу не дополнительной' className='other-work-icon fill-other-work-icon' /> : <CheckSquare onClick={(e) => saveOtherByWork(work._id, work.other)} title='Сделать работу дополнительной' className='other-work-icon' />}
																</>
																: null}


														</>
													}
												</td>
												<td>
													{isEditMode && fieldNameToEdit === 'units' && rowIDToEdit === work._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																type='text'
																defaultValue={editedRow ? editedRow.units : work.units}
																id={work._id}
																name='units'
																onChange={(e) => handleOnChangeField(e, work._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveWork(e, work._id)} />}
																<XSquare onClick={(e) => closeEditField(e, work._id, 'units')} />
															</div>
														</Form.Group>
														: <span onClick={(e) => editField(e, work._id, 'units')}>{work.units}</span>
													}
												</td>
												<td>{work.sign}</td>
												<td className='text-right'></td>
												<td className='text-right'>
													{isEditMode && fieldNameToEdit === 'quantity' && rowIDToEdit === work._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																type='text'
																defaultValue={editedRow ? editedRow.quantity : work.quantity}
																id={work._id}
																name='quantity'
																onChange={(e) => handleOnChangeField(e, work._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveWork(e, work._id)} />}
																<XSquare onClick={(e) => closeEditField(e, work._id, 'quantity')} />
															</div>
														</Form.Group>
														: <span onClick={(e) => editField(e, work._id, 'quantity')}>{work.quantity}</span>
													}
												</td>
												<td className='text-right'>
													{isEditMode && fieldNameToEdit === 'unitCost' && rowIDToEdit === work._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																type='text'
																defaultValue={editedRow ? editedRow.unitCost : work.unitCost}
																id={work._id}
																name='unitCost'
																onChange={(e) => handleOnChangeField(e, work._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveWork(e, work._id)} />}
																<XSquare onClick={(e) => closeEditField(e, work._id, 'unitCost')} />
															</div>
														</Form.Group>
														: <span onClick={(e) => editField(e, work._id, 'unitCost')}><Number locale="ru-RU">{work.unitCost}</Number></span>
													}
												</td>
												<td className='text-right'><Number locale="ru-RU">{work.allCost}</Number></td>
												<td className='name-row'>
													{isEditMode && fieldNameToEdit === 'comment' && rowIDToEdit === work._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																as="textarea"
																rows="2"
																type='text'
																defaultValue={editedRow ? editedRow.comment : work.comment}
																id={work._id}
																name='comment'
																onChange={(e) => handleOnChangeField(e, work._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveWork(e, work._id)} />}
																<XSquare onClick={(e) => closeEditField(e, work._id, 'comment')} />
															</div>
														</Form.Group>
														:
														<>
															<span onClick={(e) => editField(e, work._id, 'comment')}>{work.comment}</span>
														</>
													}
												</td>
												<td className='delete-field'>
													<Trash onClick={(e) => delWork(work._id)} />
												</td>
											</tr>
											{materials.filter(m => m.workBy === work._id).map((material, index) => (
												<tr key={index} className='material-row'>
													<td>{idx + 1}.{i + 1}.{с + 1}.{index + 1}</td>
													<td style={{ fontStyle: 'italic', paddingLeft: '30px' }}>
														{isEditMode && fieldNameToEdit === 'name' && rowIDToEdit === material._id
															?
															<Form.Group className='field-group'>
																<Form.Control
																	as="textarea"
																	rows="2"
																	type='text'
																	defaultValue={editedRow ? editedRow.name : material.name}
																	id={material._id}
																	name='name'
																	onChange={(e) => handleOnChangeField(e, material._id)}
																/>
																<div className='field-buttons'>
																	{!editedRow ? null : <Save onClick={(e) => saveMaterial(e, material._id)} />}
																	<XSquare onClick={(e) => closeEditField(e, material._id, 'name')} />
																</div>
															</Form.Group>
															: <span onClick={(e) => editField(e, material._id, 'name')}>{material.name}</span>
														}
													</td>
													<td>
														{isEditMode && fieldNameToEdit === 'units' && rowIDToEdit === material._id
															?
															<Form.Group className='field-group'>
																<Form.Control
																	type='text'
																	defaultValue={editedRow ? editedRow.units : material.units}
																	id={material._id}
																	name='units'
																	onChange={(e) => handleOnChangeField(e, material._id)}
																/>
																<div className='field-buttons'>
																	{!editedRow ? null : <Save onClick={(e) => saveMaterial(e, material._id)} />}
																	<XSquare onClick={(e) => closeEditField(e, material._id, 'units')} />
																</div>
															</Form.Group>
															: <span onClick={(e) => editField(e, material._id, 'units')}>{material.units}</span>
														}
													</td>
													<td>{material.sign}</td>
													<td className='text-right'>
														{isEditMode && fieldNameToEdit === 'ratio' && rowIDToEdit === material._id
															?
															<Form.Group className='field-group'>
																<Form.Control
																	type='text'
																	defaultValue={editedRow ? editedRow.ratio : material.ratio}
																	id={material._id}
																	name='ratio'
																	onChange={(e) => handleOnChangeField(e, material._id)}
																/>
																<div className='field-buttons'>
																	{!editedRow ? null : <Save onClick={(e) => saveMaterial(e, material._id)} />}
																	<XSquare onClick={(e) => closeEditField(e, material._id, 'ratio')} />
																</div>
															</Form.Group>
															: <span onClick={(e) => editField(e, material._id, 'ratio')}>{material.ratio}</span>
														}
													</td>
													<td className='text-right'>
														{isEditMode && fieldNameToEdit === 'quantity' && rowIDToEdit === material._id
															?
															<Form.Group className='field-group'>
																<Form.Control
																	type='text'
																	defaultValue={editedRow ? editedRow.quantity : material.quantity}
																	id={material._id}
																	name='quantity'
																	onChange={(e) => handleOnChangeField(e, material._id)}
																/>
																<div className='field-buttons'>
																	{!editedRow ? null : <Save onClick={(e) => saveMaterial(e, material._id)} />}
																	<XSquare onClick={(e) => closeEditField(e, material._id, 'quantity')} />
																</div>
															</Form.Group>
															: <span onClick={(e) => editField(e, material._id, 'quantity')}>{material.quantity}</span>
														}
													</td>
													<td className='text-right'>
														{isEditMode && fieldNameToEdit === 'unitCost' && rowIDToEdit === material._id
															?
															<Form.Group className='field-group'>
																<Form.Control
																	type='text'
																	defaultValue={editedRow ? editedRow.unitCost : material.unitCost}
																	id={material._id}
																	name='unitCost'
																	onChange={(e) => handleOnChangeField(e, material._id)}
																/>
																<div className='field-buttons'>
																	{!editedRow ? null : <Save onClick={(e) => saveMaterial(e, material._id)} />}
																	<XSquare onClick={(e) => closeEditField(e, material._id, 'unitCost')} />
																</div>
															</Form.Group>
															: <span onClick={(e) => editField(e, material._id, 'unitCost')}><Number locale="ru-RU">{material.unitCost}</Number></span>
														}
													</td>
													<td className='text-right'><Number locale="ru-RU">{material.allCost}</Number></td>
													<td>
														{isEditMode && fieldNameToEdit === 'comment' && rowIDToEdit === material._id
															?
															<Form.Group className='field-group'>
																<Form.Control
																	as="textarea"
																	rows="2"
																	type='text'
																	defaultValue={editedRow ? editedRow.comment : material.comment}
																	id={material._id}
																	name='comment'
																	onChange={(e) => handleOnChangeField(e, material._id)}
																/>
																<div className='field-buttons'>
																	{!editedRow ? null : <Save onClick={(e) => saveMaterial(e, material._id)} />}
																	<XSquare onClick={(e) => closeEditField(e, material._id, 'comment')} />
																</div>
															</Form.Group>
															: <span onClick={(e) => editField(e, material._id, 'comment')}>{material.comment}</span>
														}
													</td>
													<td className='delete-field'>
														<Trash onClick={(e) => delMaterial(material._id)} />
													</td>
												</tr>
											))}
										</Fragment>
									))}
									<tr>
										<th></th>
										<th colSpan={6}>Итого работы</th>
										<th className='text-right'>
											<Currency locale="ru-RU" currency="RUB">{works.filter(w => w.subchapterBy === subchapter._id).filter(w => w.sign === 'СМР').reduce((accum, item) => accum + item.allCost, 0)}</Currency >
										</th>
										<th></th>
										<th></th>
									</tr>
									<tr>
										<th></th>
										<th colSpan={6}>Итого материалы</th>
										<th className='text-right'>
											<Currency locale="ru-RU" currency="RUB">{materials.filter(m => m.subchapterBy === subchapter._id).reduce((accum, item) => accum + item.allCost, 0)}</Currency >
										</th>
										<th></th>
										<th></th>
									</tr>
									<tr>
										<th></th>
										<th colSpan={6}>Итого техника</th>
										<th className='text-right'>
											<Currency locale="ru-RU" currency="RUB">{works.filter(w => w.subchapterBy === subchapter._id).filter(w => w.sign === 'ТЕХ').reduce((accum, item) => accum + item.allCost, 0)}</Currency >
										</th>
										<th></th>
										<th></th>
									</tr>
									<tr>
										<th></th>
										<th colSpan={6}>Итого доп.работы</th>
										<th className='text-right'>
											<Currency locale="ru-RU" currency="RUB">{works.filter(w => w.subchapterBy === subchapter._id).filter(w => w.sign === 'СМР').filter(w => w.other === true).reduce((accum, item) => accum + item.allCost, 0)}</Currency >
										</th>
										<th></th>
										<th></th>
									</tr>
									<tr>
										<th></th>
										<th colSpan={6}>{`Итого ${subchapter.name}`}</th>
										<th className='text-right'>
											<Currency locale="ru-RU" currency="RUB">{(materials.filter(m => m.subchapterBy === subchapter._id).reduce((accum, item) => accum + item.allCost, 0) + works.filter(w => w.subchapterBy === subchapter._id).reduce((accum, item) => accum + item.allCost, 0))}</Currency >
										</th>
										<th></th>
										<th></th>
									</tr>
								</Fragment>
							))}
						</Fragment>
					))}

					{chapters.filter(c => c.sign == 'РСР').map((chapter, idx) => (
						<Fragment key={idx}>
							<tr className='table-success table-success-chapter'>
								<td>{idx + 1}</td>
								<td className='name-row'>
									{isEditMode && fieldNameToEdit === 'name' && rowIDToEdit === chapter._id
										?
										<Form.Group className='field-group'>
											<Form.Control
												as="textarea"
												rows="2"
												type='text'
												defaultValue={editedRow ? editedRow.name : chapter.name}
												id={chapter._id}
												name='name'
												onChange={(e) => handleOnChangeField(e, chapter._id)}
											/>
											<div className='field-buttons'>
												{!editedRow ? null : <Save onClick={(e) => saveChapter(e, chapter._id)} />}
												<XSquare onClick={(e) => closeEditField(e, chapter._id, 'name')} />
											</div>
										</Form.Group>
										: <>
											<b onClick={(e) => editField(e, chapter._id, 'name')}>{chapter.name}</b>
											<NodePlus title={`Добавить подраздел в "${chapter.name}"`} onClick={() => openAddSubchapterModal(chapter._id)} />
										</>
									}

								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td className='name-row'>
									{isEditMode && fieldNameToEdit === 'comment' && rowIDToEdit === chapter._id
										?
										<Form.Group className='field-group'>
											<Form.Control
												as="textarea"
												rows="2"
												type='text'
												defaultValue={editedRow ? editedRow.comment : chapter.comment}
												id={chapter._id}
												name='comment'
												onChange={(e) => handleOnChangeField(e, chapter._id)}
											/>
											<div className='field-buttons'>
												{!editedRow ? null : <Save onClick={(e) => saveChapter(e, chapter._id)} />}
												<XSquare onClick={(e) => closeEditField(e, chapter._id, 'comment')} />
											</div>
										</Form.Group>
										: <>
											<b onClick={(e) => editField(e, chapter._id, 'comment')}>{chapter.comment}</b>
										</>
									}

								</td>
								<td className='delete-field'>
									{chapter.sign == 'РЗЛ'
										?
										<Trash onClick={(e) => delChapter(chapter._id)} />
										: null}
								</td>
							</tr>
							{subchapters.filter(sc => sc.chapterBy === chapter._id).map((subchapter, i) => (
								<Fragment key={i}>
									<tr className='table-success'>
										<td>{idx + 1}.{i + 1}</td>
										<td className='name-row'>
											{isEditMode && fieldNameToEdit === 'name' && rowIDToEdit === subchapter._id
												?
												<Form.Group className='field-group'>
													<Form.Control
														as="textarea"
														rows="2"
														type='text'
														defaultValue={editedRow ? editedRow.name : subchapter.name}
														id={subchapter._id}
														name='name'
														onChange={(e) => handleOnChangeField(e, subchapter._id)}
													/>
													<div className='field-buttons'>
														{!editedRow ? null : <Save onClick={(e) => saveSubchapter(e, subchapter._id)} />}
														<XSquare onClick={(e) => closeEditField(e, subchapter._id, 'name')} />
													</div>
												</Form.Group>
												: <>
													<b onClick={(e) => editField(e, subchapter._id, 'name')}>{subchapter.name}</b>
													{chapter.sign == 'РСР' ?
														<NodePlus title={`Добавить сопутствующие расход "${subchapter.name}"`} onClick={() => openAddEspenseModal(chapter._id, subchapter._id)} />
														:
														<NodePlus title={`Добавить работу в "${subchapter.name}"`} onClick={() => openAddWorkModal(chapter._id, subchapter._id)} />
													}
												</>
											}

										</td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td className='name-row'>
											{isEditMode && fieldNameToEdit === 'comment' && rowIDToEdit === subchapter._id
												?
												<Form.Group className='field-group'>
													<Form.Control
														as="textarea"
														rows="2"
														type='text'
														defaultValue={editedRow ? editedRow.comment : subchapter.comment}
														id={subchapter._id}
														name='comment'
														onChange={(e) => handleOnChangeField(e, subchapter._id)}
													/>
													<div className='field-buttons'>
														{!editedRow ? null : <Save onClick={(e) => saveSubchapter(e, subchapter._id)} />}
														<XSquare onClick={(e) => closeEditField(e, subchapter._id, 'comment')} />
													</div>
												</Form.Group>
												: <>
													<b onClick={(e) => editField(e, subchapter._id, 'comment')}>{subchapter.comment}</b>
												</>
											}

										</td>
										<td className='delete-field'>
											<Trash onClick={(e) => delSubchapter(subchapter._id)} />
										</td>
									</tr>

									{espens.filter(e => e.subchapterBy === subchapter._id).map((espen, k) => (
										<Fragment key={k}>
											<tr className='default-row'>
												<td>{idx + 1}.{k + 1}</td>
												<td className='name-row'>
													{isEditMode && fieldNameToEdit === 'name' && rowIDToEdit === espen._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																as="textarea"
																rows="2"
																type='text'
																defaultValue={editedRow ? editedRow.name : espen.name}
																id={espen._id}
																name='name'
																onChange={(e) => handleOnChangeField(e, espen._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveEspense(e, espen._id)} />}
																<XSquare onClick={(e) => closeEditField(e, espen._id, 'name')} />
															</div>
														</Form.Group>
														:
														<>
															<span onClick={(e) => editField(e, espen._id, 'name')}>{espen.name}</span>
														</>
													}
												</td>
												<td>
													{isEditMode && fieldNameToEdit === 'units' && rowIDToEdit === espen._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																type='text'
																defaultValue={editedRow ? editedRow.units : espen.units}
																id={espen._id}
																name='units'
																onChange={(e) => handleOnChangeField(e, espen._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveEspense(e, espen._id)} />}
																<XSquare onClick={(e) => closeEditField(e, espen._id, 'units')} />
															</div>
														</Form.Group>
														: <span onClick={(e) => editField(e, espen._id, 'units')}>{espen.units}</span>
													}
												</td>
												<td>{espen.sign}</td>
												<td className='text-right'></td>
												<td className='text-right'>
													{isEditMode && fieldNameToEdit === 'quantity' && rowIDToEdit === espen._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																type='number'
																defaultValue={editedRow ? editedRow.quantity : espen.quantity}
																id={espen._id}
																name='quantity'
																onChange={(e) => handleOnChangeField(e, espen._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveEspense(e, espen._id)} />}
																<XSquare onClick={(e) => closeEditField(e, espen._id, 'quantity')} />
															</div>
														</Form.Group>
														: <span onClick={(e) => editField(e, espen._id, 'quantity')}>{espen.quantity}</span>
													}
												</td>
												<td className='text-right'>
													{isEditMode && fieldNameToEdit === 'unitCost' && rowIDToEdit === espen._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																type='number'
																defaultValue={editedRow ? editedRow.unitCost : espen.unitCost}
																id={espen._id}
																name='unitCost'
																onChange={(e) => handleOnChangeField(e, espen._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveEspense(e, espen._id)} />}
																<XSquare onClick={(e) => closeEditField(e, espen._id, 'unitCost')} />
															</div>
														</Form.Group>
														: <span onClick={(e) => editField(e, espen._id, 'unitCost')}><Number locale="ru-RU">{espen.unitCost}</Number></span>
													}
												</td>
												<td className='text-right'><Number locale="ru-RU">{espen.allCost}</Number></td>
												<td className='name-row'>
													{isEditMode && fieldNameToEdit === 'comment' && rowIDToEdit === espen._id
														?
														<Form.Group className='field-group'>
															<Form.Control
																as="textarea"
																rows="2"
																type='text'
																defaultValue={editedRow ? editedRow.comment : espen.comment}
																id={espen._id}
																name='comment'
																onChange={(e) => handleOnChangeField(e, espen._id)}
															/>
															<div className='field-buttons'>
																{!editedRow ? null : <Save onClick={(e) => saveEspense(e, espen._id)} />}
																<XSquare onClick={(e) => closeEditField(e, espen._id, 'comment')} />
															</div>
														</Form.Group>
														:
														<>
															<span onClick={(e) => editField(e, espen._id, 'comment')}>{espen.comment}</span>
														</>
													}
												</td>
												<td className='delete-field'>
													<Trash onClick={(e) => delEspense(espen._id)} />
												</td>
											</tr>
										</Fragment>
									))}

									<tr>
										<th></th>
										<th colSpan={6}>{`Итого ${subchapter.name}`}</th>
										<th className='text-right'>
											<Currency locale="ru-RU" currency="RUB">{(espens.filter(m => m.subchapterBy === subchapter._id).reduce((accum, item) => accum + item.allCost, 0))}</Currency >
										</th>
										<th></th>
										<th></th>
									</tr>
								</Fragment>
							))}
						</Fragment>
					))}
				</tbody>
				<tfoot>
					<tr className='tfoot-price'>
						<th></th>
						<th colSpan={6}>Всего по расчету</th>
						<th className='text-right'><Currency locale="ru-RU" currency="RUB">{(materials.reduce((accum, item) => accum + item.allCost, 0) + works.reduce((accum, item) => accum + item.allCost, 0)) + espens.reduce((accum, item) => accum + item.allCost, 0)}</Currency></th>
						<th></th>
						<th></th>
					</tr>
					<tr className='tfoot-price'>
						<th></th>
						<th colSpan={8}>В том числе</th>
						<th></th>
					</tr>
					<tr>
						<th></th>
						<th colSpan={6}>Всего работы</th>
						<th className='text-right'><Currency locale="ru-RU" currency="RUB">{works.filter(w => w.sign === 'СМР').reduce((accum, item) => accum + item.allCost, 0)}</Currency></th>
						<th></th>
						<th></th>
					</tr>
					<tr className='tfoot-price'>
						<th></th>
						<th colSpan={6}>Всего материалы</th>
						<th className='text-right'><Currency locale="ru-RU" currency="RUB">{materials.reduce((accum, item) => accum + item.allCost, 0)}</Currency ></th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th></th>
						<th colSpan={6}>Всего техника</th>
						<th className='text-right'><Currency locale="ru-RU" currency="RUB">{works.filter(w => w.sign === 'ТЕХ').reduce((accum, item) => accum + item.allCost, 0)}</Currency></th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th></th>
						<th colSpan={6}>Всего доп.работы</th>
						<th className='text-right'><Currency locale="ru-RU" currency="RUB">{works.filter(w => w.sign === 'СМР').filter(w => w.other === true).reduce((accum, item) => accum + item.allCost, 0)}</Currency></th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th></th>
						<th colSpan={6}>Всего сопутствующие расходы</th>
						<th className='text-right'><Currency locale="ru-RU" currency="RUB">{espens.reduce((accum, item) => accum + item.allCost, 0)}</Currency></th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th></th>
						<th colSpan={6}>НДС 20%</th>
						<th className='text-right'><Currency locale="ru-RU" currency="RUB">{(materials.reduce((accum, item) => accum + item.allCost, 0) + works.reduce((accum, item) => accum + item.allCost, 0) + espens.reduce((accum, item) => accum + item.allCost, 0)) - (materials.reduce((accum, item) => accum + item.allCost, 0) + works.reduce((accum, item) => accum + item.allCost, 0) + espens.reduce((accum, item) => accum + item.allCost, 0)) / 1.2}</Currency></th>
						<th></th>
						<th></th>
					</tr>
				</tfoot>
			</Table>
			<AddChapter show={chapterAddVisible} onHide={() => setChapterAddVisible(false)} authorBy={authorBy} projectBy={projectId} updateFiled={updateFiled} />
			<AddSubchapter show={subchapterAddVisible} onHide={() => setSubchapterAddVisible(false)} authorBy={authorBy} projectBy={projectId} updateFiled={updateFiled} chapterBy={activeChapterBy} />
			<AddWork show={workAddVisible} onHide={() => setWorkAddVisible(false)} authorBy={authorBy} projectBy={projectId} updateFiled={updateFiled} chapterBy={activeChapterBy} subchapterBy={activeSubchapterBy} />
			<AddEspense show={espenseAddVisible} onHide={() => setEspenseAddVisible(false)} authorBy={authorBy} projectBy={projectId} updateFiled={updateFiled} chapterBy={activeChapterBy} subchapterBy={activeSubchapterBy} />
			<AddMaterial show={materialAddVisible} onHide={() => setMaterialAddVisible(false)} authorBy={authorBy} projectBy={projectId} updateFiled={updateFiled} chapterBy={activeChapterBy} workBy={activeWorkBy} subchapterBy={activeSubchapterBy} />
		</>
	);
}

export default EstimateTable;