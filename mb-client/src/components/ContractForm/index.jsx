import { useCallback, useState } from "react";
import { useFormik } from "formik";
import { Button, Form, Input, Select, Space, Typography } from "antd";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

import { contractValidationSchema } from "../../pages/validationSchemas";
import {
  contractInitials,
  contractFormItems,
} from "../../constants/contractFormItems";
import { contractTypes } from "../../constants/contractTypes";

import template from "../../template.docx";
import "./contractForm.css";

const DOCUMENT_NAME = "Договор.docx";

const FORM_STYLES_FOR_LABEL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const formItems = [
  { name: "contract_number", label: "Номер договора" },
  { name: "city", label: "Город" },
  { name: "date", label: "Дата" },
  { name: "contract_header", label: "Шапка договора", type: "textarea" },
  { name: "object", label: "Объект/Объекты", type: "textarea" },
  { name: "terms", label: "Срок выполнения", type: "textarea" },
  { name: "price", label: "Стоимость работ", type: "textarea" },
  { name: "prepaid_amount", label: "Аванс по договору", type: "textarea" },
  {
    name: "org_name",
    label: "Название организации (ФИО для физ лица) исполнителя",
  },
  {
    name: "org_name_short",
    label:
      "Сокращенное название организации (Фамилия, инициалы для физ лица) исполнителя",
  },
  {
    name: "requisites",
    label: "Реквизиты исполнителя",
    type: "textarea",
    style: { width: 300, height: 200 },
  },
];

export const ContractForm = ({ contractName }) => {
  const [isContractFormed, setIsContractFormed] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [form] = Form.useForm();

  const formik = useFormik({
    initialValues: contractInitials,
    validationSchema: contractValidationSchema,
    onSubmit: (values) => {
      generateDocument(values);
    },
  });

  const validateStatus = (field) =>
    formik.touched[field] && formik.errors[field] ? "error" : "";

  const helpText = (field) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : "";

  const handleDownload = useCallback(() => {
    if (generatedDoc) {
      saveAs(generatedDoc, DOCUMENT_NAME);
    }
  }, [generatedDoc]);

  const handleChange = useCallback((value) => {
    formik.setFieldValue("contract_type", value);
  }, []);

  const generateDocument = useCallback(
    async (params) => {
      try {
        const response = await fetch(template);
        const data = await response.arrayBuffer();
        const zip = new PizZip(data);

        const templateDoc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        templateDoc.render(params);

        const currGeneratedDoc = templateDoc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          compression: "DEFLATE",
        });

        setGeneratedDoc(currGeneratedDoc);
        setIsContractFormed(true);
        form.resetFields();
        formik.resetForm();
        saveAs(currGeneratedDoc, DOCUMENT_NAME);
      } catch (error) {
        console.log("Error: " + error);
      }
    },
    [setGeneratedDoc, setIsContractFormed, template]
  );

  return (
    <div className="wrapper">
      <Space size="middle" direction="vertical">
        <Typography.Text className="text">
          Сформировать договор "{contractName}"
        </Typography.Text>
        <Form
          onFinish={formik.handleSubmit}
          size="large"
          style={{ width: "100%" }}
          form={form}
        >
          <Form.Item
            name="contract_type"
            label="Тип договора"
            validateStatus={validateStatus("contract_type")}
            help={helpText("contract_type")}
            {...FORM_STYLES_FOR_LABEL}
          >
            <Select
              defaultValue={contractTypes[0].value}
              onChange={handleChange}
              options={contractTypes.map(({ value }) => ({
                label: value,
                value,
              }))}
            />
          </Form.Item>
          {contractFormItems.map(({ name, label, type, style, className }) => (
            <Form.Item
              key={name}
              name={name}
              label={label}
              validateStatus={validateStatus(name)}
              help={helpText(name)}
              {...FORM_STYLES_FOR_LABEL}
              style={style}
              className={className}
            >
              {type === "textarea" ? (
                <Input.TextArea
                  name={name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[name]}
                />
              ) : (
                <Input
                  name={name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[name]}
                />
              )}
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              onClick={isContractFormed ? handleDownload : undefined}
              disabled={
                isContractFormed
                  ? false
                  : !formik.isValid || formik.isSubmitting
              }
            >
              {isContractFormed ? "Скачать договор" : "Сформировать договор"}
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};
