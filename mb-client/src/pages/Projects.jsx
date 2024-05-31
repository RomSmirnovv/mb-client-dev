import { Row } from 'antd';
import { useContext, useEffect, useState } from 'react';
import ProjectItem from '../components/Project/ProjectItem';
import { fetchProjects } from '../services/ProjectService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import inMemoryJWT from '../services/inMemoryJWT.js';
import { jwtDecode } from 'jwt-decode'


const Projects = () => {
	const accessToken = inMemoryJWT.getToken()
	let author_id = null
	let roleId = null
	if (accessToken) {
		author_id = jwtDecode(accessToken)._id
		roleId = jwtDecode(accessToken).role
	}
	const [editState, setEditState] = useState(false)
	const { project } = useContext(AuthContext)
	const [data, setData] = useState()

	const updateProjectList = () => {
		setEditState(!editState)
	}

	useEffect(() => {
		fetchProjects().then(d => {
			project.setProjects(d)
			setData(d)
		})
	}, [editState])

	return (
		<Row gutter={16}>
			{project.projects.map(data => (<ProjectItem key={data._id} project={data} updateProjectList={updateProjectList} roleId={roleId} />))}
		</Row>
	);
}

export default Projects;