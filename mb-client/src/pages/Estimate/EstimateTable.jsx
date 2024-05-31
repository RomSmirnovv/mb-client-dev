import React, { useEffect, useState } from 'react';
import { Modal, Space, Switch, Table } from 'antd';
import Chapter from './EditRow/EditRow';
import EditRow from './EditRow/EditRow';


const EstimateTable = ({ chapterData, updateTable }) => {
	const [activeRow, setActiveRow] = useState()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const showModal = (row, rowIndex) => {
		if (row.sign == 'РЗЛ' || row.sign == 'ПРЗЛ' || row.sign == 'МТР' || row.sign == 'СМР' || row.sign == 'СР' || row.sign == 'ТЕХ' || row.sign == 'РСР') {
			setActiveRow(row)
			setIsModalOpen(true);
		}
	};

	let chapters = []
	// Перебираем Разделы
	let allWorkSumm = 0
	let allTechSumm = 0
	let allMaterialSumm = 0
	let allEspenseSumm = 0
	for (let a = 0; a < chapterData.length; a++) {
		chapters[a] = {
			key: a,
			authorBy: chapterData[a].authorBy,
			comment: chapterData[a].comment,
			name: chapterData[a].name,
			projectBy: chapterData[a].projectBy,
			sign: chapterData[a].sign,
			_id: chapterData[a]._id,
		}
		chapters[a].children = []
		for (let b = 0; b < chapterData[a].subchapters.length; b++) {
			chapters[a].children[b] = {
				key: a + '' + b,
				authorBy: chapterData[a].subchapters[b].authorBy,
				comment: chapterData[a].subchapters[b].comment,
				name: chapterData[a].subchapters[b].name,
				projectBy: chapterData[a].subchapters[b].projectBy,
				sign: chapterData[a].subchapters[b].sign,
				_id: chapterData[a].subchapters[b]._id,
			}
			if (chapterData[a].subchapters[b].works.length != 0) {
				chapters[a].children[b].children = []
				let subchapterWorkSumm = 0
				let subchapterTechSumm = 0
				let subchapterMaterialSumm = 0
				for (let c = 0; c < chapterData[a].subchapters[b].works.length; c++) {
					if (chapterData[a].subchapters[b].works[c].technic) {
						subchapterTechSumm += chapterData[a].subchapters[b].works[c].allCost * 1
						allTechSumm += chapterData[a].subchapters[b].works[c].allCost * 1
					} else {
						subchapterWorkSumm += chapterData[a].subchapters[b].works[c].allCost * 1
						allWorkSumm += chapterData[a].subchapters[b].works[c].allCost * 1
					}
					chapters[a].children[b].children[c] = {
						key: a + '' + b + '' + c,
						authorBy: chapterData[a].subchapters[b].works[c].authorBy,
						comment: chapterData[a].subchapters[b].works[c].comment,
						name: chapterData[a].subchapters[b].works[c].name,
						projectBy: chapterData[a].subchapters[b].works[c].projectBy,
						sign: chapterData[a].subchapters[b].works[c].sign,
						other: chapterData[a].subchapters[b].works[c].other,
						technic: chapterData[a].subchapters[b].works[c].technic,
						quantity: chapterData[a].subchapters[b].works[c].quantity,
						units: chapterData[a].subchapters[b].works[c].units,
						unitCost: chapterData[a].subchapters[b].works[c].unitCost,
						allCost: chapterData[a].subchapters[b].works[c].allCost,
						_id: chapterData[a].subchapters[b].works[c]._id,
					}
					if (c == chapterData[a].subchapters[b].works.length - 1) {
						chapters[a].children[b].children[c + 1] = {
							key: a + '' + b + chapterData[a].subchapters[b].works.length,
							name: `Итого работы`,
							allCost: (subchapterWorkSumm).toFixed(2)
						}
						chapters[a].children[b].children[c + 2] = {
							key: a + '' + b + chapterData[a].subchapters[b].works.length + 1,
							name: `Итого техника`,
							allCost: (subchapterTechSumm).toFixed(2)
						}
					}
					if (chapterData[a].subchapters[b].works[c].materials.length != 0) {
						chapters[a].children[b].children[c].children = []
						for (let d = 0; d < chapterData[a].subchapters[b].works[c].materials.length; d++) {
							subchapterMaterialSumm += chapterData[a].subchapters[b].works[c].materials[d].allCost * 1
							allMaterialSumm += chapterData[a].subchapters[b].works[c].materials[d].allCost * 1
							chapters[a].children[b].children[c].children[d] = {
								key: a + '' + b + 1 + '' + c + '' + d,
								authorBy: chapterData[a].subchapters[b].works[c].materials[d].authorBy,
								comment: chapterData[a].subchapters[b].works[c].materials[d].comment,
								name: chapterData[a].subchapters[b].works[c].materials[d].name,
								projectBy: chapterData[a].subchapters[b].works[c].materials[d].projectBy,
								sign: chapterData[a].subchapters[b].works[c].materials[d].sign,
								quantity: chapterData[a].subchapters[b].works[c].materials[d].quantity,
								units: chapterData[a].subchapters[b].works[c].materials[d].units,
								unitCost: chapterData[a].subchapters[b].works[c].materials[d].unitCost,
								allCost: chapterData[a].subchapters[b].works[c].materials[d].allCost,
								ratio: chapterData[a].subchapters[b].works[c].materials[d].ratio,
								_id: chapterData[a].subchapters[b].works[c].materials[d]._id,
							}

						}
					}
					if (chapterData[a].subchapters[b].works[c].length != 0) {
						chapters[a].children[b].children[c + 3] = {
							key: a + '' + b + chapterData[a].subchapters[b].works.length + 2,
							name: `Итого материалы`,
							allCost: (subchapterMaterialSumm).toFixed(2)
						}
						chapters[a].children[b].children[c + 4] = {
							key: a + '' + b + chapterData[a].subchapters[b].works.length + 3,
							name: `Итого за ${chapterData[a].subchapters[b].name}`,
							allCost: (subchapterWorkSumm + subchapterTechSumm + subchapterMaterialSumm).toFixed(2)
						}
					}
				}
			}
			if (chapterData[a].subchapters[b].espense && chapterData[a].subchapters[b].espense.length != 0) {
				chapters[a].children[b].children = []
				let subchapterEspenseSumm = 0
				for (let f = 0; f < chapterData[a].subchapters[b].espense.length; f++) {
					subchapterEspenseSumm += chapterData[a].subchapters[b].espense[f].allCost * 1
					allEspenseSumm += chapterData[a].subchapters[b].espense[f].allCost * 1
					chapters[a].children[b].children[f] = {
						key: a + '' + b + '' + f,
						authorBy: chapterData[a].subchapters[b].espense[f].authorBy,
						category: chapterData[a].subchapters[b].espense[f].category,
						comment: chapterData[a].subchapters[b].espense[f].comment,
						name: chapterData[a].subchapters[b].espense[f].name,
						projectBy: chapterData[a].subchapters[b].espense[f].projectBy,
						sign: chapterData[a].subchapters[b].espense[f].sign,
						quantity: chapterData[a].subchapters[b].espense[f].quantity,
						units: chapterData[a].subchapters[b].espense[f].units,
						unitCost: chapterData[a].subchapters[b].espense[f].unitCost,
						allCost: chapterData[a].subchapters[b].espense[f].allCost,
						_id: chapterData[a].subchapters[b].espense[f]._id,
					}
					if (f == chapterData[a].subchapters[b].espense.length - 1) {
						chapters[a].children[b].children[f + 1] = {
							key: a + '' + b + chapterData[a].subchapters[b].espense.length,
							name: `Итого ${chapterData[a].subchapters[b].name}`,
							allCost: (subchapterEspenseSumm).toFixed(2)
						}
					}
				}
			}
		}
	}
	chapters[chapterData.length + 1] = {
		key: chapterData.length + 1,
		name: 'Всего по расчету',
		allCost: (allWorkSumm + allTechSumm + allMaterialSumm + allEspenseSumm).toFixed(2)
	}
	chapters[chapterData.length + 2] = {
		key: chapterData.length + 2,
		name: 'Всего работы',
		allCost: (allWorkSumm).toFixed(2)
	}
	chapters[chapterData.length + 3] = {
		key: chapterData.length + 3,
		name: 'Всего техника',
		allCost: (allTechSumm).toFixed(2)
	}
	chapters[chapterData.length + 4] = {
		key: chapterData.length + 4,
		name: 'Всего материалы',
		allCost: (allMaterialSumm).toFixed(2)
	}
	chapters[chapterData.length + 5] = {
		key: chapterData.length + 5,
		name: 'Всего сопутствующие расходы',
		allCost: (allEspenseSumm).toFixed(2)
	}
	chapters[chapterData.length + 6] = {
		key: chapterData.length + 6,
		name: 'НДС 20%',
		allCost: ((allWorkSumm + allTechSumm + allMaterialSumm + allEspenseSumm) - (allWorkSumm + allTechSumm + allMaterialSumm + allEspenseSumm) / 1.2).toFixed(2)
	}

	const handleOk = () => {
		setIsModalOpen(false)
	}
	const handleCancel = () => {
		setIsModalOpen(false)
	}

	const columns = [
		{
			title: 'Наименование',
			dataIndex: 'name',
			key: 'name',
			width: '54%',
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
	];

	return (
		<>
			<Table
				columns={columns}
				dataSource={chapters}
				pagination={false}
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (e) => { showModal(record, rowIndex) },
					};
				}}
			/>
			<Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false} >
				<EditRow row={activeRow} updateTable={updateTable} handleOk={handleOk} />
			</Modal>
		</>
	);
}

export default EstimateTable;