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

export const ContractForm = ({ contractName }) => {
  const [isContractFormed, setIsContractFormed] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [form] = Form.useForm();

  const formik = useFormik({
    initialValues: contractInitials,
    validationSchema: contractValidationSchema,
    onSubmit: (values) => {
      generateDocument(values);
      // отсюда если что можно будет сохранить текущие заполненные данные, которые представлены в виде объекта {"название поля": "значение"}
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
          style={{ width: "100%" }}
          form={form}
        >
          <div className="parent">
            <Form.Item
              name="contract_type"
              label="Тип договора"
              validateStatus={validateStatus("contract_type")}
              help={helpText("contract_type")}
              className="contract__type"
              {...FORM_STYLES_FOR_LABEL}
            >
              <Select
                defaultValue={contractTypes[0].value}
                onChange={handleChange}
                style={{ width: "100%" }}
                options={contractTypes.map(({ value }) => ({
                  label: value,
                  value,
                }))}
              />
            </Form.Item>
            {contractFormItems.map(
              ({ name, label, type, style, className }) => (
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
                      style={{ resize: "none", height: "inherit" }}
                    />
                  ) : (
                    <Input
                      name={name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[name]}
                      style={{ height: "inherit" }}
                    />
                  )}
                </Form.Item>
              )
            )}
          </div>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className="submit__button"
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
