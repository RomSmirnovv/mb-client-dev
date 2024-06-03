import { contractTypes } from "./contractTypes";

export const contractInitials = {
  contract_type: contractTypes[0].value,
  contract_number: "03/05/2024",
  city: "г. Кострома",
  date: "«03» мая 2024 г.",
  contract_header: `ООО «Мовсбилд»,  именуемое в дальнейшем «Заказчик», в лице  Генерального директора Мовсесян Наири Гренаевич, действующей на основании Устава, с», с одной стороны, и Смирнова Алексея Николаевича, паспорт: серия 3310 номер 007313, выданный 30.04.2010 г., Отделением УФМС России по Кировской области в Яранском районе, именуемый в дальнейшем «Подрядчик», с другой стороны, вместе именуемые «Стороны», заключили настоящий договор подряда о нижеследующем: `,
  object: "Костромская обл., Кострома г., Красносельское ш. 1",
  terms: "Срок выполнения работ 30 дней",
  price:
    "1 358 100 (Один миллион триста пятьдесят восемь тысяч сто) рублей 00 копеек",
  prepaid_amount:
    "271 620 (двести семьдесят одна тысяча шестьсот двадцать) рублей 00 копеек, что составляет 20% от стоимости работ по смете, представленной в приложении №1",
  org_name: "Смирнов Алексей Николаевич",
  org_name_short: "Смирнов А. Н.",
  requisites: `Паспорт: серия 3310 № 007313
Выдан 30.04.2010 Отделением УФМС 
России по Кировской области 
В Яранском районе
Прописан: Кировская область, 
гор. Яранск, ул. Мицкевича д. 43 кв. 21`,
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
    textAreaClassName: "contract__header_textarea",
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
