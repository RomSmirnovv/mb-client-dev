import { useEffect, useState } from 'react'
import queryString from 'query-string'
import { Radio, Flex, Row, Col, Typography } from 'antd'
import { fetchOneProjects } from '../../services/ProjectService'
import Calculation from './CostPrice/Calculation'
import PrimePrice from './CostPrice/PrimePrice'

const { Title } = Typography

const CostPrice = () => {
	const paramsUri = queryString.parse(location.search)
	const project_id = paramsUri.project_id
	const [project, setProject] = useState()
	const [radioValue, setRadioValue] = useState('calculation')

	const onChange = (e) => {
		setRadioValue(e.target.value)
	}

	useEffect(() => {
		fetchOneProjects(project_id).then(data => {
			setProject(data)
		})
	}, [])

	return (
		<Row gutter={20}>
			<Col md={24}>
				<Title level={3}>Расчет себестоимости проекта: «{project ? project.projectName : ''}»</Title>
			</Col>
			<Col md={24}>
				<Flex vertical gap="middle">
					<Radio.Group
						value={radioValue}
						className='mt-2 mb-2'
						onChange={onChange}
						optionType="button"
						buttonStyle="solid">
						<Radio.Button value="calculation">Расчет</Radio.Button>
						<Radio.Button value="costprice">Себестоимость</Radio.Button>
					</Radio.Group>
				</Flex>
			</Col>
			{radioValue == 'calculation' ?
				<Calculation projectId={project_id} /> :
				radioValue == 'costprice' ?
					<PrimePrice projectId={project._id} project={project} /> : null
			}
		</Row>
	);
}

export default CostPrice;