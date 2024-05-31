import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UploadOutlined, SaveOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Table, DatePicker, Row, Col, Select } from 'antd';
const { RangePicker } = DatePicker;
import moment from 'moment'
import { fetchOneProjects } from '../../services/ProjectService';
import { fetchChaptersByProject } from '../../services/ChapterService';
import { fetchSubchaptersByProject } from '../../services/SubchapterService';
import { fetchWorksByProject } from '../../services/WorkService';
import { fetchMaterialsByProject } from '../../services/MaterialService';
import { fetchEspensesByProject } from '../../services/EspenseService';
import EditRowDate from './EditRowDate';



// исходные колонки таблицы
const defaultColumns = [
	{
		title: 'Наименование',
		dataIndex: '',
		key: 'name',
		fixed: true,
		className: 'name__column',
		render: (_) => (
			<div className={_.sign == 'СМР' || _.sign == 'ТЕХ' ? 'work__item work__item__margin' : 'work__item'}>
				<div className='work__title'><span>{_.name}</span></div>
				{_.sign == 'СМР' || _.sign == 'ТЕХ' ?
					<>
						<div><span className='font__cursive'>По плану</span></div>
						<div><span className='font__cursive'>По факту</span></div>
					</>
					: null}
			</div>
		)
	},
	{
		title: 'Ед. изм.',
		dataIndex: 'units',
		key: 'units',
	},
	{
		title: 'Количество по смете',
		dataIndex: '',
		key: 'quantity',
		render: (_) => (
			<>
				{_.sign == 'СМР' || _.sign == 'ТЕХ' ?
					<>
						{_.quantity} / {_.plannedExecutionSumm}
					</>
					: null}
			</>
		)
	},
]
const initialDates = Array.from(Array(8).keys()).map((idx) => {
	const d = new Date()
	d.setDate(d.getDate() - d.getDay() + idx + 1)
	const startDates = [d[1], d[7]]
	return moment(d).format('DD.MM.YYYY')
})

const Schedule = () => {
	const [editState, setEditState] = useState(false)
	const [columns, setColumns] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [scheduleTable, setScheduleTable] = useState([])
	const [searchParams, setSearchParams] = useSearchParams()
	const projectId = searchParams.get("project_id")
	const [project, setProject] = useState('')
	const updateTable = () => {
		setEditState(!editState)
	}
	// исходные колонки дат
	let defaultDatesColumn = []
	for (let i = 0; i < initialDates.length; i++) {
		defaultDatesColumn[i] = {
			title: initialDates[i],
			dataIndex: '',
			key: initialDates[i].replace(/^\./, ""),
			width: '6%',
			render: (_) => (
				_.sign == 'СМР' ?
					<div className='work__item'>
						<div className='work__title work__data__title'><span>_</span></div>
						{_.sign == 'СМР' || _.sign == 'ТЕХ' ?
							<EditRowDate updateTable={updateTable} key={initialDates[i].replace(/^\./, "")} row={_} plannedExecution={_.plannedExecution} actualExecution={_.actualExecution} initialDate={initialDates[i]} />
							: null}
					</div>
					: null
			)
		}
	}
	const [dateColumns, setDateColumns] = useState(defaultDatesColumn)

	const createDatesData = (startDate, endDate) => {
		for (var arr = [], dt = new Date(startDate); dt <= new Date(endDate); dt.setDate(dt.getDate() + 1)) {
			arr.push(moment(new Date(dt)).format('DD.MM.YYYY'));
		}
		// исходные колонки дат
		let defaultDatesColumn = []
		for (let i = 0; i < arr.length; i++) {
			defaultDatesColumn[i] = {
				title: arr[i],
				dataIndex: '',
				key: arr[i].replace(/^\./, ""),
				width: '6%',
				render: (_) => (
					_.sign == 'СМР' || _.sign == 'ТЕХ' ?
						<div className='work__item'>
							{console.log(_)}
							<div className='work__title work__data__title'><span>_</span></div>
							{_.sign == 'СМР' || _.sign == 'ТЕХ' ?
								<>
									<EditRowDate updateTable={updateTable} key={arr[i].replace(/^\./, "")} row={_} plannedExecution={_.plannedExecution} actualExecution={_.actualExecution} initialDate={initialDates[i]} />
								</>
								: null}
						</div>
						: null
				)
			}
		}
		setDateColumns(defaultDatesColumn)
	}
	const onChange = (date, dateString) => {
		createDatesData(dateString[0], dateString[1])
	}
	const getTableData = (chaptersBeforeTable) => {
		let chapters = []
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
					for (let c = 0; c < chaptersBeforeTable[a].subchapters[b].works.length; c++) {
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
							plannedExecution: chaptersBeforeTable[a].subchapters[b].works[c].plannedExecution || [],
							actualExecution: chaptersBeforeTable[a].subchapters[b].works[c].actualExecution || [],
							plannedExecutionSumm: chaptersBeforeTable[a].subchapters[b].works[c].plannedExecutionSumm,
						}
					}
				}
			}
		}
		setScheduleTable(chapters)
	}

	useEffect(() => {
		setColumns([...defaultColumns, ...dateColumns])
		const id = projectId
		setIsLoading(true)
		fetchOneProjects(id).then(data => {
			if (data) {
				setProject(data)
			}
		})
		const getChapters = fetchChaptersByProject(projectId)
		const getSubchapters = fetchSubchaptersByProject(projectId)
		const getWorks = fetchWorksByProject(projectId)
		const getMaterials = fetchMaterialsByProject(projectId)
		Promise.all([getChapters, getSubchapters, getWorks, getMaterials]).then(data => {
			let chaptersFethed = data[0].filter(d => d.name != 'Расходы')
			let subchaptersFethed = data[1]
			let worksFethed = data[2]
			let materialsFethed = data[3]
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
										estimateData[i].subchapters[k].works[l].materials = []
									}
								}
							}
						}
					}
				}
			}
			getTableData(estimateData)
		})
		setIsLoading(false)
	}, [editState, dateColumns])
	return (
		<>
			<Row gutter={20}>
				<RangePicker
					className='mb-2'
					onChange={onChange} />

				{project.isSavedPlan ?
					<>
						<Select
							style={{ 'width': '300px', 'height': '41px' }}
							className='mb-2 ml-2'
							defaultValue={'Рабочий'}>
							<Option value='Утвержденный'>Утвержденный</Option>
							<Option value='Рабочий'>Рабочий</Option>
						</Select>
					</> :
					<>
						<Button
							style={{ 'height': '41px' }}
							type='primary'
							className='mb-2 ml-2'>Сохранить План-график</Button>
					</>}
				<Col md={24}>
					<Table
						columns={columns}
						dataSource={scheduleTable}
						className='schedule__table'
						pagination={false}
					/>
				</Col>
			</Row>
		</>
	);
}

export default Schedule;