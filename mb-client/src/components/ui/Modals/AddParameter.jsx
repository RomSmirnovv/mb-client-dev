import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, InputNumber } from 'antd';

const AddParameter = ({ isModalAddParameterOpen, handleOk, handleCancel, addParameter }) => {


	const onFinish = (values) => {
		addParameter(values)
	}
	return (
		<Modal title='Добавить параметр в замеры' open={isModalAddParameterOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
			<Form
				name='formAddParameter'
				layout='vertical'
				onFinish={onFinish}
			>
				<Form.Item
					name="title"
					label='Заголовок'
					rules={[
						{
							required: true,
							message: 'Пожалуйста, укажите заголовок!',
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					name="value"
					label='Значение'
					rules={[
						{
							required: true,
							message: 'Пожалуйста, укажите Значение!',
						},
					]}>
					<InputNumber
						min={0}
						style={{
							width: '100%',
						}} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className='mt-1'>Добавить</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default AddParameter;