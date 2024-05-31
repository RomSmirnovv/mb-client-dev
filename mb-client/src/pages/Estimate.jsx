import React, { useEffect, useState } from 'react';
import { UploadOutlined, SaveOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Table, Upload, Modal, Tooltip } from 'antd';
import * as XLSX from 'xlsx';
import inMemoryJWT from '../services/inMemoryJWT.js';
import { jwtDecode } from 'jwt-decode'
import { useSearchParams } from 'react-router-dom';
import EstimateTable from './Estimate/EstimateTable.jsx';
import { editProject, fetchOneProjects } from '../services/ProjectService.js'
import { createChapter, fetchChaptersByProject, deleteChaptersByProject } from '../services/ChapterService.js'
import { createSubchapter, fetchSubchaptersByProject, deleteSubchaptersByProject } from '../services/SubchapterService.js'
import { createWork, fetchWorksByProject, deleteWorksByProject } from '../services/WorkService.js'
import { createMaterial, fetchMaterialsByProject, deleteMaterialsByProject } from '../services/MaterialService.js'
import { createEspense, fetchEspensesByProject, deleteEspensesByProject } from '../services/EspenseService.js'
import { deleteShipmentsByProject } from '../services/ShipmentService.js'
import EditRow from './Estimate/EditRow/EditRow.jsx';
import AddRow from './Estimate/AddRow/AddRow.jsx';

const Estimate = () => {
	const [rowsOpen, setRowsOpen] = useState(false)
	const [isLoad, setIsLoad] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadedEstimate, setIsLoadedEstimate] = useState(false)
	const [isData, setIsData] = useState(false)
	let authorId = null
	const accessToken = inMemoryJWT.getToken()
	if (accessToken) {
		authorId = jwtDecode(accessToken)._id
	}
	const [searchParams, setSearchParams] = useSearchParams()
	const projectId = searchParams.get("project_id")
	const [project, setProject] = useState('')
	const [chapterData, setChapterData] = useState('')
	const [editState, setEditState] = useState(false)
	const [activeRow, setActiveRow] = useState()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isAddModalOpen, setIsAddModalOpen] = useState(false)
	const [updateState, setUpdateState] = useState('')



	// state для хранения данных сметы
	// данные из БД (либо для сохранения, записи как в БД)
	const [estimate, setEstimate] = useState([])
	// данные после обработки для вывода в таблицу с развертыванием
	const [estimateTable, setEstimateTable] = useState([])

	// колонки таблицы
	const columns = [
		{
			title: 'Наименование',
			dataIndex: 'name',
			key: 'name',
			width: '54%',
			render: (text) => (
				<div className='add__row__container'>
					<span>{text}</span>
					{!text.includes('Всего') && !text.includes('НДС') && !text.includes('Итого') ?
						<>
							{activeRow && activeRow.sign != 'РСР' ?
								<span className="add__row" onClick={() => addRow()}>
									<Tooltip title={`Добавить ${activeRow.sign == 'РЗЛ' ? 'раздел' : activeRow.sign == 'ПРЗЛ' ? 'подраздел' : activeRow.sign == 'СМР' || activeRow.sign == 'ТЕХ' ? 'работу' : activeRow.sign == 'МТР' ? 'материал' : activeRow.sign == 'СР' ? 'расход'
										: null}`}>
										<PlusCircleOutlined />
									</Tooltip>
								</span> : null}
						</>
						: null}

				</div>
			)
		},
		{
			title: 'Ед. изм.',
			dataIndex: 'units',
			key: 'units',
			width: '7%',
		},
		{
			title: 'Признак',
			dataIndex: 'sign',
			key: 'sign',
			width: '7%',
		},
		{
			title: 'К расхода',
			dataIndex: 'ratio',
			key: 'ratio',
			width: '7%',
		},
		{
			title: 'Количество по смете',
			dataIndex: 'quantity',
			key: 'quantity',
			width: '7%',
		},
		{
			title: 'Стоимость за ед., с учетом НДС 20%',
			dataIndex: 'unitCost',
			key: 'unitCost',
			width: '8%',
		},
		{
			title: 'Стоимость с учетом НДС 20%',
			dataIndex: 'allCost',
			key: 'allCost',
			width: '8%',
		},
		{
			title: 'Примечания',
			dataIndex: 'comment',
			key: 'comment',
			width: '10%',
		},
		{
			dataIndex: '_id',
			key: '_id',
			render: (text) => (<span></span>)
		},
	]
	const updateTable = () => {
		setEditState(!editState)
	}
	const uploadProps = {
		name: 'file',
		accept: '.xls, .xlsx',
		beforeUpload: 'false',
		showUploadList: { showRemoveIcon: true },
		onChange(e) {
			handleFile(e)
		},
		onRemove(e) {
			console.log('onRemove', e)
		},
	}
	const getTableData = (chaptersBeforeTable) => {
		let chapters = []
		let allWorkSumm = 0
		let allTechSumm = 0
		let allMaterialSumm = 0
		let allEspenseSumm = 0
		for (let a = 0; a < chaptersBeforeTable.length; a++) {
			chapters[a] = {
				key: a,
				authorBy: chaptersBeforeTable[a].authorBy,
				comment: chaptersBeforeTable[a].comment,
				name: chaptersBeforeTable[a].name,
				projectBy: chaptersBeforeTable[a].projectBy,
				sign: chaptersBeforeTable[a].sign,
				_id: chaptersBeforeTable[a]._id || '',
			}
			chapters[a].children = []
			for (let b = 0; b < chaptersBeforeTable[a].subchapters.length; b++) {
				chapters[a].children[b] = {
					key: a + '' + b,
					authorBy: chaptersBeforeTable[a].subchapters[b].authorBy,
					comment: chaptersBeforeTable[a].subchapters[b].comment,
					name: chaptersBeforeTable[a].subchapters[b].name,
					projectBy: chaptersBeforeTable[a].subchapters[b].projectBy,
					sign: chaptersBeforeTable[a].subchapters[b].sign,
					_id: chaptersBeforeTable[a].subchapters[b]._id || '',
				}
				if (chaptersBeforeTable[a].subchapters[b].works.length != 0) {
					chapters[a].children[b].children = []
					let subchapterWorkSumm = 0
					let subchapterTechSumm = 0
					let subchapterMaterialSumm = 0
					for (let c = 0; c < chaptersBeforeTable[a].subchapters[b].works.length; c++) {
						if (chaptersBeforeTable[a].subchapters[b].works[c].technic) {
							subchapterTechSumm += chaptersBeforeTable[a].subchapters[b].works[c].allCost * 1
							allTechSumm += chaptersBeforeTable[a].subchapters[b].works[c].allCost * 1
						} else {
							subchapterWorkSumm += chaptersBeforeTable[a].subchapters[b].works[c].allCost * 1
							allWorkSumm += chaptersBeforeTable[a].subchapters[b].works[c].allCost * 1
						}
						chapters[a].children[b].children[c] = {
							key: a + '' + b + '' + c,
							authorBy: chaptersBeforeTable[a].subchapters[b].works[c].authorBy,
							comment: chaptersBeforeTable[a].subchapters[b].works[c].comment,
							name: chaptersBeforeTable[a].subchapters[b].works[c].name,
							projectBy: chaptersBeforeTable[a].subchapters[b].works[c].projectBy,
							sign: chaptersBeforeTable[a].subchapters[b].works[c].sign,
							other: chaptersBeforeTable[a].subchapters[b].works[c].other,
							technic: chaptersBeforeTable[a].subchapters[b].works[c].technic,
							quantity: chaptersBeforeTable[a].subchapters[b].works[c].quantity,
							units: chaptersBeforeTable[a].subchapters[b].works[c].units,
							unitCost: chaptersBeforeTable[a].subchapters[b].works[c].unitCost,
							allCost: chaptersBeforeTable[a].subchapters[b].works[c].allCost,
							_id: chaptersBeforeTable[a].subchapters[b].works[c]._id || '',
						}
						if (c == chaptersBeforeTable[a].subchapters[b].works.length - 1) {
							chapters[a].children[b].children[c + 1] = {
								key: a + '' + b + chaptersBeforeTable[a].subchapters[b].works.length,
								name: `Итого работы`,
								allCost: (subchapterWorkSumm).toFixed(2)
							}
							chapters[a].children[b].children[c + 2] = {
								key: a + '' + b + (Number(chaptersBeforeTable[a].subchapters[b].works.length) + 1),
								name: `Итого техника`,
								allCost: (subchapterTechSumm).toFixed(2)
							}
						}
						if (chaptersBeforeTable[a].subchapters[b].works[c].materials.length != 0) {
							chapters[a].children[b].children[c].children = []
							for (let d = 0; d < chaptersBeforeTable[a].subchapters[b].works[c].materials.length; d++) {
								subchapterMaterialSumm += chaptersBeforeTable[a].subchapters[b].works[c].materials[d].allCost * 1
								allMaterialSumm += chaptersBeforeTable[a].subchapters[b].works[c].materials[d].allCost * 1
								chapters[a].children[b].children[c].children[d] = {
									key: a + '' + b + 1 + '' + c + '' + d,
									authorBy: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].authorBy,
									comment: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].comment,
									name: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].name,
									projectBy: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].projectBy,
									sign: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].sign,
									quantity: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].quantity,
									units: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].units,
									unitCost: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].unitCost,
									allCost: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].allCost,
									ratio: chaptersBeforeTable[a].subchapters[b].works[c].materials[d].ratio,
									_id: chaptersBeforeTable[a].subchapters[b].works[c].materials[d]._id || '',
								}

							}
						}
						if (chaptersBeforeTable[a].subchapters[b].works[c].length != 0) {
							chapters[a].children[b].children[c + 3] = {
								key: a + '' + b + (Number(chaptersBeforeTable[a].subchapters[b].works.length) + 2),
								name: `Итого материалы`,
								allCost: (subchapterMaterialSumm).toFixed(2)
							}
							chapters[a].children[b].children[c + 4] = {
								key: a + '' + b + (Number(chaptersBeforeTable[a].subchapters[b].works.length) + 3),
								name: `Итого за ${chaptersBeforeTable[a].subchapters[b].name}`,
								allCost: (subchapterWorkSumm + subchapterTechSumm + subchapterMaterialSumm).toFixed(2)
							}
						}
					}
				}
				if (chaptersBeforeTable[a].subchapters[b].espense && chaptersBeforeTable[a].subchapters[b].espense.length != 0) {
					chapters[a].children[b].children = []
					let subchapterEspenseSumm = 0
					for (let f = 0; f < chaptersBeforeTable[a].subchapters[b].espense.length; f++) {
						subchapterEspenseSumm += chaptersBeforeTable[a].subchapters[b].espense[f].allCost * 1
						allEspenseSumm += chaptersBeforeTable[a].subchapters[b].espense[f].allCost * 1
						chapters[a].children[b].children[f] = {
							key: a + '' + b + '' + f,
							authorBy: chaptersBeforeTable[a].subchapters[b].espense[f].authorBy,
							category: chaptersBeforeTable[a].subchapters[b].espense[f].category,
							comment: chaptersBeforeTable[a].subchapters[b].espense[f].comment,
							name: chaptersBeforeTable[a].subchapters[b].espense[f].name,
							projectBy: chaptersBeforeTable[a].subchapters[b].espense[f].projectBy,
							sign: chaptersBeforeTable[a].subchapters[b].espense[f].sign,
							quantity: chaptersBeforeTable[a].subchapters[b].espense[f].quantity,
							units: chaptersBeforeTable[a].subchapters[b].espense[f].units,
							unitCost: chaptersBeforeTable[a].subchapters[b].espense[f].unitCost,
							allCost: chaptersBeforeTable[a].subchapters[b].espense[f].allCost,
							_id: chaptersBeforeTable[a].subchapters[b].espense[f]._id || '',
						}
						if (f == chaptersBeforeTable[a].subchapters[b].espense.length - 1) {
							chapters[a].children[b].children[f + 1] = {
								key: a + '' + b + chaptersBeforeTable[a].subchapters[b].espense.length,
								name: `Итого ${chaptersBeforeTable[a].subchapters[b].name}`,
								allCost: (subchapterEspenseSumm).toFixed(2)
							}
						}
					}
				}
			}
		}
		if (chapters.length && chapters.length != 0) {
			chapters[chaptersBeforeTable.length] = {
				key: chaptersBeforeTable.length,
				name: 'Всего по расчету',
				allCost: (allWorkSumm + allTechSumm + allMaterialSumm + allEspenseSumm).toFixed(2)
			}
			chapters[chaptersBeforeTable.length + 1] = {
				key: chaptersBeforeTable.length + 1,
				name: 'Всего работы',
				allCost: (allWorkSumm).toFixed(2)
			}
			chapters[chaptersBeforeTable.length + 2] = {
				key: chaptersBeforeTable.length + 2,
				name: 'Всего техника',
				allCost: (allTechSumm).toFixed(2)
			}
			chapters[chaptersBeforeTable.length + 3] = {
				key: chaptersBeforeTable.length + 3,
				name: 'Всего материалы',
				allCost: (allMaterialSumm).toFixed(2)
			}
			chapters[chaptersBeforeTable.length + 4] = {
				key: chaptersBeforeTable.length + 4,
				name: 'Всего сопутствующие расходы',
				allCost: (allEspenseSumm).toFixed(2)
			}
			chapters[chaptersBeforeTable.length + 5] = {
				key: chaptersBeforeTable.length + 5,
				name: 'НДС 20%',
				allCost: ((allWorkSumm + allTechSumm + allMaterialSumm + allEspenseSumm) - (allWorkSumm + allTechSumm + allMaterialSumm + allEspenseSumm) / 1.2).toFixed(2)
			}
			setEstimateTable(chapters)
		}
	}
	const showModal = (row) => {
		if (row.sign == 'РЗЛ' || row.sign == 'ПРЗЛ' || row.sign == 'МТР' || row.sign == 'СМР' || row.sign == 'СР' || row.sign == 'ТЕХ' || row.sign == 'РСР') {
			setActiveRow(row)
			setIsModalOpen(true);
		}
	}
	const handleOk = () => {
		setIsModalOpen(false)
		setIsAddModalOpen(false)
	}
	const handleCancel = () => {
		setIsModalOpen(false)
		setIsAddModalOpen(false)
	}
	const addRow = () => {
		console.log(activeRow)
		setIsAddModalOpen(true)
	}
	const handleFile = async (e) => {
		const file = e.file;
		const data = await file.arrayBuffer();
		const workbook = XLSX.read(data);
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

		let chapters = []
		let number = 0
		let index = 0
		let idx = 0
		let other = false
		let technic = false

		for (let i = 0; i < jsonData.length; i++) {
			const element = jsonData[i];
			if (jsonData[i][3] == 'РЗЛ' || jsonData[i][3] == 'РСР') {
				index = 0
				number += 1
				chapters.push({
					authorBy: authorId,
					projectBy: projectId,
					name: jsonData[i][1],
					sign: jsonData[i][3],
					subchapters: [],
					comment: jsonData[i][8] || '',
				})
			}
			let sumWorkSubchapter = 0
			if (jsonData[i][3] == 'ПРЗЛ') {
				sumWorkSubchapter = 0
				idx = 0
				other = false
				technic = false
				index += 1
				chapters[number - 1].subchapters.push({
					authorBy: authorId,
					projectBy: projectId,
					name: jsonData[i][1],
					sign: jsonData[i][3],
					works: [],
					espense: [],
					comment: jsonData[i][8] || '',
				})
			}
			if (jsonData[i][3] == 'ДР') {
				other = true
			}
			if (jsonData[i][3] == 'ТЕХ') {
				technic = true
			}
			if (jsonData[i][3] == 'СМР' || jsonData[i][3] == 'ТЕХ') {
				idx += 1
				chapters[number - 1].subchapters[index - 1].works.push({
					authorBy: authorId,
					projectBy: projectId,
					name: jsonData[i][1],
					units: jsonData[i][2] ? jsonData[i][2] : '-',
					sign: jsonData[i][3] == 'СМР' ? jsonData[i][3] : 'ТЕХ',
					quantity: (Number(jsonData[i][5])).toFixed(2),
					other: other,
					technic: technic,
					unitCost: (Number(jsonData[i][6])).toFixed(2),
					allCost: (Number(jsonData[i][5]) * Number(jsonData[i][6])).toFixed(2),
					materials: [],
					comment: jsonData[i][8] || '',
				})
			}
			if (jsonData[i][3] == 'СР') {
				idx += 1
				chapters[number - 1].subchapters[index - 1].espense.push({
					authorBy: authorId,
					projectBy: projectId,
					name: jsonData[i][1],
					units: jsonData[i][2],
					sign: jsonData[i][3],
					quantity: (Number(jsonData[i][5])).toFixed(2),
					unitCost: (Number(jsonData[i][6])).toFixed(2),
					allCost: (Number(jsonData[i][5]) * Number(jsonData[i][6])).toFixed(2),
					category: 'Сопутствующие расходы',
					comment: jsonData[i][8] || '',
				})
			}
			if (jsonData[i][3] == 'МТР') {
				chapters[number - 1].subchapters[index - 1].works[idx - 1].materials.push({
					authorBy: authorId,
					projectBy: projectId,
					name: jsonData[i][1],
					units: jsonData[i][2],
					sign: jsonData[i][3],
					ratio: jsonData[i][4],
					quantity: (Number(jsonData[i][5])).toFixed(2),
					unitCost: (Number(jsonData[i][6])).toFixed(2),
					allCost: (Number(jsonData[i][5]) * Number(jsonData[i][6])).toFixed(2),
					comment: jsonData[i][8] || '',
				})
			}
			other = false
			technic = false
		}
		setEstimate(chapters)
		getTableData(chapters)

	}
	const saveEstimate = async () => {
		setIsLoading(true)
		let chapterBy
		let subchapterBy
		let workBy
		let estimateSumm = 0
		if (estimate.length != 0) {
			for (let i = 0; i < estimate.length; i++) {
				const { name, sign, authorBy, projectBy, comment } = estimate[i]
				await createChapter({ name, sign, authorBy, projectBy, comment }).then((chapter) => {
					chapterBy = chapter.data._id
				})
				if (estimate[i].subchapters.length != 0) {
					for (let n = 0; n < estimate[i].subchapters.length; n++) {
						const { name, sign, authorBy, projectBy, comment } = estimate[i].subchapters[n]
						await createSubchapter({ name, sign, authorBy, projectBy, comment, chapterBy }).then((subchapter) => {
							subchapterBy = subchapter.data._id
						})
						if (estimate[i].subchapters[n].works.length != 0) {
							for (let m = 0; m < estimate[i].subchapters[n].works.length; m++) {
								estimateSumm += (estimate[i].subchapters[n].works[m].unitCost * estimate[i].subchapters[n].works[m].quantity)
								const { name, sign, quantity, units, other, technic, unitCost, projectBy, authorBy, comment } = estimate[i].subchapters[n].works[m]
								await createWork({ name, sign, quantity, units, other, technic, unitCost, projectBy, authorBy, comment, subchapterBy, chapterBy }).then((work) => {
									workBy = work.data._id
								})
								if (estimate[i].subchapters[n].works[m].materials.length != 0) {
									for (let k = 0; k < estimate[i].subchapters[n].works[m].materials.length; k++) {
										estimateSumm += (estimate[i].subchapters[n].works[m].materials[k].unitCost * estimate[i].subchapters[n].works[m].materials[k].quantity)
										const { name, sign, quantity, units, ratio, unitCost, projectBy, authorBy, comment } = estimate[i].subchapters[n].works[m].materials[k]
										await createMaterial({ name, sign, quantity, units, ratio, unitCost, projectBy, authorBy, comment, subchapterBy, chapterBy, workBy }).then((work) => {
										})
									}
								}
							}
						}
						if (estimate[i].subchapters[n].espense.length != 0) {
							for (let m = 0; m < estimate[i].subchapters[n].espense.length; m++) {
								estimateSumm += (estimate[i].subchapters[n].espense[m].unitCost * estimate[i].subchapters[n].espense[m].quantity)
								const { name, sign, quantity, units, category, unitCost, projectBy, authorBy, comment } = estimate[i].subchapters[n].espense[m]
								await createEspense({ name, sign, quantity, units, category, unitCost, projectBy, authorBy, comment, subchapterBy, chapterBy }).then((espense) => {
								})
							}
						}
					}
				}
			}
		}
		const newProject = {
			_id: project._id,
			isLoadedEstimate: true,
			estimateSumm: (estimateSumm).toFixed(2)
		}
		editProject(newProject).then(data => {
			setIsLoadedEstimate(true)
			setEditState(!editState)
			setIsLoading(false)
		})
	}
	const deleteEstimate = async (projectId) => {
		setIsLoading(true)
		await deleteChaptersByProject(projectId).then(data => {
			deleteSubchaptersByProject(projectId).then(data => {
				deleteWorksByProject(projectId).then(data => {
					deleteMaterialsByProject(projectId).then(data => {
						deleteShipmentsByProject(projectId).then(data => {
							setEditState(!editState)
						})
					})
				})
				deleteEspensesByProject(projectId)
			})
		})
		const newProject = {
			_id: project._id,
			isLoadedEstimate: false
		}
		editProject(newProject).then(data => {
			setIsLoadedEstimate(false)
			setEditState(!editState)
		})
		setEstimate([])
		setEstimateTable([])
		setIsLoading(false)
	}
	let open = false
	const openAll = () => {

	}
	useEffect(() => {
		const id = projectId
		setIsLoading(true)
		fetchOneProjects(id).then(data => {
			if (data) {
				setProject(data)
				setIsLoadedEstimate(data.isLoadedEstimate)
			}
		})
		const getChapters = fetchChaptersByProject(projectId)
		const getSubchapters = fetchSubchaptersByProject(projectId)
		const getWorks = fetchWorksByProject(projectId)
		const getMaterials = fetchMaterialsByProject(projectId)
		const getEspenses = fetchEspensesByProject(projectId)
		Promise.all([getChapters, getSubchapters, getWorks, getMaterials, getEspenses]).then(data => {
			let chaptersFethed = data[0]
			let subchaptersFethed = data[1]
			let worksFethed = data[2]
			let materialsFethed = data[3]
			let espenssFethed = data[4]
			let estimateData = []
			if (chaptersFethed && chaptersFethed.length != 0) {
				for (let i = 0; i < chaptersFethed.length; i++) {
					estimateData[i] = chaptersFethed[i]
					if (subchaptersFethed && subchaptersFethed.length != 0) {
						estimateData[i].subchapters = subchaptersFethed.filter(d => d.chapterBy == estimateData[i]._id)
						for (let k = 0; k < estimateData[i].subchapters.length; k++) {
							if (worksFethed && worksFethed.length != 0) {
								estimateData[i].subchapters[k].works = worksFethed.filter(d => d.subchapterBy == estimateData[i].subchapters[k]._id)
								for (let l = 0; l < estimateData[i].subchapters[k].works.length; l++) {
									if (materialsFethed && materialsFethed.length != 0) {
										estimateData[i].subchapters[k].works[l].materials = materialsFethed.filter(d => d.workBy == estimateData[i].subchapters[k].works[l]._id)
									}
								}
								if (estimateData[i].sign == 'РСР') {
									for (let r = 0; r < estimateData[i].subchapters.length; r++) {
										if (espenssFethed && espenssFethed.length != 0) {
											estimateData[i].subchapters[k].espense = espenssFethed.filter(d => d.subchapterBy == estimateData[i].subchapters[k]._id)
										}
									}
								}
							}
						}
					}
				}
			}
			setEstimate(estimateData)
			getTableData(estimateData)
		})
		setIsLoading(false)
	}, [editState])

	return (
		<>
			{isLoadedEstimate || estimateTable.length != 0 ?
				<>
					<Table
						columns={columns}
						dataSource={estimateTable}
						pagination={false}
						defaultExpandAllRows={true}
						rowClassName={() => 'estimate-table-row'}
						onRow={(record, rowIndex) => {
							return {
								onMouseEnter: (e) => { setActiveRow(record) },
								onDoubleClick: (e) => { showModal(record) },
							};
						}}
					/>
					<Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false} >
						<EditRow row={activeRow} updateTable={updateTable} handleOk={handleOk} />
					</Modal>
					<Modal
						open={isAddModalOpen}
						onOk={handleOk}
						onCancel={handleCancel}
						footer={false}
						title={`Добавить ${activeRow && activeRow.sign == 'РЗЛ' ? 'раздел' : activeRow && activeRow.sign == 'ПРЗЛ' ? 'подраздел' : activeRow && activeRow.sign == 'СМР' && activeRow && activeRow.sign == 'ТЕХ' ? 'работу' : activeRow && activeRow.sign == 'МТР' ? 'материал' : activeRow && activeRow.sign == 'СР' ? 'расход'
							: ''}`}>
						<AddRow row={activeRow} updateTable={updateTable} handleOk={handleOk} />
					</Modal>
					{!isLoadedEstimate ?
						<Button type='primary' className='mb-2 mt-2' icon={<SaveOutlined />} onClick={saveEstimate} loading={isLoading} >Сохранить смету</Button>
						: <Button icon={<DeleteOutlined />} className='mb-2 mt-2' onClick={() => deleteEstimate(projectId)}>Удалить смету</Button>}
				</>
				:
				<Upload {...uploadProps}>
					<Button icon={<UploadOutlined />}>Нажмите для загрузки сметы (Excel)</Button>
				</Upload>}
		</>
	);
}

export default Estimate;