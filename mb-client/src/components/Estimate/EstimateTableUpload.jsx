import { Fragment } from 'react';
import { Table, Button } from 'react-bootstrap';
import { PencilFill, Save, Trash, XSquare } from 'react-bootstrap-icons';

const EstimateTableUpload = ({ chapterData }) => {
	return (
		<Table bordered hover className='bs-transparent table-estimate'>
			<thead>
				<tr>
					<th>№</th>
					<th>Наименование</th>
					<th>Ед. изм.</th>
					<th>Признак</th>
					<th>К расхода</th>
					<th>Количество <br />по смете</th>
					<th>Стоимость за ед., <br />с учетом НДС 20%</th>
					<th>Примечания</th>
				</tr>
			</thead>
			<tbody>
				{chapterData.map((chapter, idx) => (
					<Fragment key={idx}>
						<tr className='table-success'>
							<td>{idx + 1}</td>
							<td><b>{chapter.name}</b></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td>{chapter.comment}</td>
						</tr>
						{chapter.subchapters.map((subchapter, i) => (
							<Fragment key={i}>
								<tr className='table-success'>
									<td>{idx + 1}.{i + 1}</td>
									<td><b>{subchapter.name}</b></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td>{subchapter.comment}</td>
								</tr>

								{subchapter.works.map((work, n) => (
									<Fragment key={n}>
										<tr className={work.other ? 'table-warning' : 'table-secondary'}>
											<td>{idx + 1}.{i + 1}.{n + 1}</td>
											<td>{work.name}</td>
											<td>{work.units}</td>
											<td>{work.sign}</td>
											<td></td>
											<td>{work.quantity}</td>
											<td>{work.unitCost}</td>
											<td>{work.comment}</td>
										</tr>
										{work.materials.map((material, index) => (
											<tr key={index}>
												<td>{idx + 1}.{i + 1}.{n + 1}.{index + 1}</td>
												<td style={{ textAlign: 'right' }}>{material.name}</td>
												<td>{material.units}</td>
												<td>{material.sign}</td>
												<td>{material.ratio}</td>
												<td>{material.quantity}</td>
												<td>{material.unitCost}</td>
												<td>{material.comment}</td>
											</tr>
										))}
									</Fragment>
								))}
								{subchapter.espense.map((espense, n) => (
									<Fragment key={n}>
										<tr>
											<td>{idx + 1}.{i + 1}.{n + 1}</td>
											<td>{espense.name}</td>
											<td>{espense.units}</td>
											<td>{espense.sign}</td>
											<td></td>
											<td>{espense.quantity}</td>
											<td>{espense.unitCost}</td>
											<td>{espense.comment}</td>
										</tr>
									</Fragment>
								))}
							</Fragment>
						))}
					</Fragment>
				))}
			</tbody>
		</Table>
	);
}

export default EstimateTableUpload;