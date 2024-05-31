import { Card, Col, Tag, Divider, Typography, message, Popconfirm } from 'antd';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { deleteProjects } from '../../services/ProjectService';
import { useContext, useEffect, useState } from 'react';
import Link from 'antd/es/typography/Link';
import { useNavigate } from 'react-router-dom';

const { Paragraph, Text } = Typography;

const { Meta } = Card;

const ProjectItem = ({ project, updateProjectList, roleId }) => {
	const navigate = useNavigate();
	const [editState, setEditState] = useState(false)

	const deleteProject = () => {
		const id = project._id
		deleteProjects(id).then(data => {
			updateProjectList()
			message.success(`Проект «${project.projectName}» удален!`)
		})
	}

	return (
		<>
			<Col md={6}>
				<Card
					title={project.projectName}
					bordered={true}
					className='mb-2'
					actions={[
						<SettingOutlined key='settings' onClick={() => navigate('/project?project_id=' + project._id)} />,
						<Popconfirm
							title={`Удалить проект «${project.projectName}»`}
							description="Вы действительно хотите удалить проект?"
							onConfirm={deleteProject}
							okText="Да"
							cancelText="Нет"
						>
							<DeleteOutlined key='delete' />
						</Popconfirm>,
					]}
					extra={<Tag color="#87d068">{project.projectStatus}</Tag>}>
					<div className='project-description'>
						<Paragraph><Text strong>Адрес:</Text> {project.projectAddress}</Paragraph>
						<Paragraph><Text strong>Площадь:</Text> {project.projectRoofArea} м²</Paragraph>
						<Paragraph><Text strong>Система:</Text> {project.projectRoofSystem}</Paragraph>
						<Paragraph><Text strong>Рук. проекта:</Text> {project.projectManager ? project.projectManager : 'Не назначен'}</Paragraph>
					</div>
					<Divider />
					<Link type={project.projectStatus == 'Входящая заявка' ? 'danger' : null} onClick={() => navigate('/analysis?project_id=' + project._id)} >Анализ привлекательности</Link><br />
					<Link onClick={() => navigate('/estimate?project_id=' + project._id)} >Предварительный расчет</Link><br />
					{project.isLoadedEstimate === true ? <><Link onClick={() => navigate('/schedule?project_id=' + project._id)} >План-график</Link><br /></> : null}
					{project.projectManager ? <><Link onClick={() => navigate('/inspection?project_id=' + project._id)} >Данные осмотра</Link><br /></> : null}
					{project.isLoadedEstimate === true ? <Link onClick={() => navigate('/costprice?project_id=' + project._id)} >Рассчет себестоимости</Link> : null}
				</Card>
			</Col>
		</>
	);
}

export default ProjectItem;