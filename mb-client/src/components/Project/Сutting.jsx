import React, { useEffect, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Input, Form, InputNumber, Image, Upload, Button, message, Popconfirm } from 'antd';
import { deleteCuttingFile, editCutting, deleteCutting, fetchOneCutting, uploadCutting } from '../../services/CuttingServices';
const { Title, Paragraph, Text } = Typography;
import moment from 'moment'




const Сutting = ({ cutting, updateCutting, projectName, editPageState, isInspection }) => {
	const [editState, setEditState] = useState(false);

	const [fileList, setFileList] = useState([]);
	const [newFileList, setNewFileList] = useState([]);
	const [activeCutting, setActiveCutting] = useState('');

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [layers, setLayers] = useState(cutting.layers)
	const handlePreview = async (file) => {
		// if (!file.url && !file.preview) {
		// 	file.preview = await getBase64(file.originFileObj);
		// }
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	}
	const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
	const uploadButton = (
		<button
			style={{
				border: 0,
				background: 'none',
			}}
			type="button"
		>
			<PlusOutlined />
			<div
				style={{
					marginTop: 8,
				}}
			>
				Upload
			</div>
		</button>
	)
	const addLayer = (cutting) => {
		const nextLayerNumber = layers.length
		let newCutting = cutting
		const layer = {
			key: nextLayerNumber,
			title: '',
			quantity: '',
			units: '',
			comment: ''
		}
		newCutting.layers.push(layer)
		editCutting(newCutting).then(data => {
			updateCutting()
			setLayers(newCutting.layers)
		})
	}
	const changeFieldLayer = (value, cutting, name, layer) => {
		layer[`${name}`] = value
		cutting.layers[`${layer.key}`] = layer
		let newCutting = cutting
		editCutting(cutting).then(data => {
			updateCutting()
			setLayers(newCutting.layers)
		})
	}
	const deleteLayer = (layer, cutting) => {
		const newLayers = cutting.layers.filter(l => l.key != layer.key)
		cutting.layers = newLayers
		editCutting(cutting).then(data => {
			updateCutting()
			setLayers(cutting.layers)
		})
	}
	const removeCutting = () => {
		console.log(activeCutting)
		deleteCutting(activeCutting._id).then(data => {
			message.success(`${activeCutting.name} удалена!`);
			updateCutting()
			setEditState(!editState)
		})
	}
	const onFinish = (value) => {
		console.log(value)
	}
	let files = []
	let newFiles = []
	const props = {
		onRemove: (file) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
			deleteCuttingFile(fileList, newFileList, file).then(data => {

			})
			// deleteProjectData(project_id, newFileList, file).then(data => {
			// 	setEditState(!editState)
			// })
		},
		beforeUpload: (file) => {
			const id = activeCutting._id
			let newFile = {
				lastModified: file.lastModified,
				lastModifiedDate: file.lastModifiedDate,
				name: file.name,
				originFileObj: file.originFileObj,
				percent: file.percent,
				size: file.size,
				type: file.type,
				uid: file.uid,
				project: projectName,
				cuttingName: activeCutting.name,
				cuttingId: id,
			}
			newFiles = newFileList
			files = fileList
			files.push(newFile)
			newFiles.push(file)
			setFileList(files)
			setNewFileList(newFiles)

			const formData = new FormData();
			newFileList.forEach((file) => {
				formData.append('files', file);
			});
			const cutting = {
				_id: id,
			}
			formData.append('cutting', JSON.stringify(cutting));
			formData.append('newFile', JSON.stringify(newFile));
			uploadCutting(id, formData).then(data => {
				editPageState
				setFileList(data.data.photos)
			})
			return false
		},
		fileList,
	}

	useEffect(() => {
		fetchOneCutting(cutting._id).then(data => {
			setFileList(data.photos)
		})
	}, [editState])
	return (
		<Col md={24}>
			<div className='content-container'>
				<Title level={5}>
					{cutting.name}
					{!isInspection ?
						<Popconfirm
							title="Удалить вырубку?"
							description={`Вы действительно хотите удалить ${cutting.name}?`}
							onConfirm={removeCutting}
							okText="Да"
							cancelText="Нет"
						>
							<span className='cutting__delete__link' onClick={() => setActiveCutting(cutting)}>Удалить вырубку</span>
						</Popconfirm>
						: null}
				</Title>
				{layers.map((layer, key) => (
					<div key={key}>
						<Form
							name={'formCutting' + cutting._id + key}
							layout='vertical'
							fields={[
								{
									name: ["title"],
									value: layer.title
								},
								{
									name: ["quantity"],
									value: layer.quantity
								},
								{
									name: ["units"],
									value: layer.units
								},
								{
									name: ["comment"],
									value: layer.comment
								},
							]}
							onFinish={onFinish}
							disabled={isInspection ? true : false}>
							<Row gutter={20}>
								<Col md={5}>
									<Form.Item
										name="title"
										label='Название слоя'>
										<Input onBlur={(e) => changeFieldLayer(e.target.value, cutting, 'title', layer)} />
									</Form.Item>
								</Col>
								<Col md={5}>
									<Form.Item
										name="quantity"
										label='Количество'>
										<InputNumber
											style={{
												width: '100%',
											}}
											onBlur={(e) => changeFieldLayer(e.target.value, cutting, 'quantity', layer)} />
									</Form.Item>
								</Col>
								<Col md={5}>
									<Form.Item
										name="units"
										label='Единицы измерения'
										onBlur={(e) => changeFieldLayer(e.target.value, cutting, 'units', layer)}>
										<Input />
									</Form.Item>
								</Col>
								<Col md={6}>
									<Form.Item
										name="comment"
										label='Примечание'>
										<Input onBlur={(e) => changeFieldLayer(e.target.value, cutting, 'comment', layer)} />
									</Form.Item></Col>
								<Col md={3}>
									{!isInspection ?
										<DeleteOutlined style={{ 'font-size': '1.5rem', 'margin-top': '37px' }} onClick={() => deleteLayer(layer, cutting)} />
										: null}
								</Col>
							</Row>
						</Form>
					</div>
				))}

				{!isInspection ?
					<Button type="primary" className='mt-1 mb-1' icon={<PlusOutlined />} onClick={() => addLayer(cutting)}>
						Добавить слой
					</Button>
					: null}
				<Upload
					onPreview={handlePreview}
					{...props}
					onChange={handleChange}
					listType="picture-card"
					onClick={() => setActiveCutting(cutting)}>

					{!isInspection ? uploadButton : null}
				</Upload>
				{previewImage && (
					<Image
						wrapperStyle={{
							display: 'none',
						}}
						preview={{
							visible: previewOpen,
							onVisibleChange: (visible) => setPreviewOpen(visible),
							afterOpenChange: (visible) => !visible && setPreviewImage(''),
						}}
						src={previewImage}
					/>
				)}
			</div>
		</Col >
	);
}

export default Сutting;