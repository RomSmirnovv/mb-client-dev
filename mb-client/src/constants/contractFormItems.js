import { contractTypes } from "./contractTypes";

export const contractInitials = {
  contract_type: contractTypes[0].value,
  contract_number: "",
  city: "",
  date: "",
  contract_header: "",
  object: "",
  terms: "",
  price: "",
  prepaid_amount: "",
  org_name: "",
  org_name_short: "",
  requisites: "",
};

export const contractFormItems = [
  {
    name: "contract_number",
    label: "Номер договора",
    className: "contract__number",
  },
  { name: "city", label: "Город", className: "city" },
  { name: "date", label: "Дата", className: "date" },
  {
    name: "contract_header",
    label: "Шапка договора",
    type: "textarea",
    className: "contract__header",
  },
  {
    name: "object",
    label: "Объект/Объекты",
    type: "textarea",
    className: "object",
  },
  {
    name: "terms",
    label: "Срок выполнения",
    type: "textarea",
    className: "terms",
  },
  {
    name: "price",
    label: "Стоимость работ",
    type: "textarea",
    className: "amount",
  },
  {
    name: "prepaid_amount",
    label: "Аванс по договору",
    type: "textarea",
    className: "prepaid",
  },
  {
    name: "org_name",
    label: "Название организации (ФИО для физ лица) исполнителя",
    className: "org__full",
  },
  {
    name: "org_name_short",
    label:
      "Сокращенное название организации (Фамилия, инициалы для физ лица) исполнителя",
    className: "org__short",
  },
  {
    name: "requisites",
    label: "Реквизиты исполнителя",
    type: "textarea",
    className: "requisites",
  },
];
