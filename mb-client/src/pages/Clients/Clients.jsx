import React, { useRef, useState, useEffect } from 'react';
import { deleteClients, fetchClients } from '../../services/ClientService';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import EditClient from './Modal/EditClient';

const ClientsPage = () => {

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [idIsModalProject, setIdIsModalProject] = useState()
	const showModal = (id) => {
		setIsModalOpen(true)
		setIdIsModalProject(id)
	};
	const handleOk = () => {
		setIsModalOpen(false)
	};
	const handleCancel = () => {
		setIsModalOpen(false)
		setEditState(!editState)
	};

	const [editState, setEditState] = useState(false)
	const [client, setClient] = useState([])
	const [searchText, setSearchText] = useState('')
	const [searchedColumn, setSearchedColumn] = useState('')
	const searchInput = useRef(null)
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm()
		setSearchText(selectedKeys[0])
		setSearchedColumn(dataIndex)
	};
	const handleReset = (clearFilters) => {
		clearFilters()
		setSearchText('')
	};
	const getColumnSearchProps = (title, dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
			<div
				style={{
					padding: 8,
				}}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<Input
					ref={searchInput}
					placeholder={`Поиск ${title}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{
						marginBottom: 8,
						display: 'block',
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Поиск
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{
							width: 90,
						}}
					>
						Сбросить
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({
								closeDropdown: false,
							});
							setSearchText(selectedKeys[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						Фильтр
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						Закрыть
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? '#1677ff' : undefined,
				}}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: '#ffc069',
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	const delClient = (id) => {
		deleteClients(id).then(data => {
			setEditState(!editState)
		})
	}

	const data = []
	for (let i = 0; i < client.length; i++) {
		data[i] = client[i]
		data[i].edit = client[i]._id
		data[i].del = client[i]._id
		data[i].key = client[i]._id
	}

	const columns = [
		{
			title: 'Имя',
			dataIndex: 'name',
			key: 'name',
			width: '18%',
			...getColumnSearchProps('Имя', 'name'),
		},
		{
			title: 'Телефон',
			dataIndex: 'phone',
			key: 'phone',
			width: '18%',
			...getColumnSearchProps('Телефон', 'phone'),
		},
		{
			title: 'E-mail',
			dataIndex: 'email',
			key: 'email',
			width: '18%',
			...getColumnSearchProps('E-mail', 'email'),
		},
		{
			title: 'Компания',
			dataIndex: 'company',
			key: 'company',
			width: '18%',
			...getColumnSearchProps('Компания', 'company'),
		},
		{
			title: 'Должность',
			dataIndex: 'position',
			key: 'position',
			width: '18%',
		},
		{
			title: '',
			dataIndex: 'edit',
			key: 'edit',
			width: '3%',
			render: (text) => <div><EditOutlined onClick={() => showModal(text)} /></div>,
		},
		{
			title: '',
			dataIndex: 'del',
			key: 'del',
			width: '3%',
			render: (text) => <div><DeleteOutlined onClick={() => delClient(text)} /></div>,
		},
	];


	useEffect(() => {
		fetchClients().then(data => {
			setClient(data)
		})
	}, [editState])


	return (
		<>
			<Table columns={columns} dataSource={data} />
			<EditClient isModalOpenProp={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} idIsModalProject={idIsModalProject} />
		</>
	);
}

export default ClientsPage;