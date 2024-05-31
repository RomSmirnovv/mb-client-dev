import * as Yup from 'yup'

export const signInSchema = Yup.object().shape({
	login: Yup.string()
		.required("Поле обязательно!")
		.max(25, "Макмимальная длина - 25 символов"),
	password: Yup.string()
		.required("Поле обязательно!")
		.min(3, "Пароль слишком короткий - минимум 3 символа")
		.max(50, "Макмимальная длина - 50 символов"),
})

export const signUpSchema = Yup.object({
	name: Yup.string()
		.required("Поле обязательно!")
		.max(50, "Максимальная длина - 50 символов"),
	surname: Yup.string()
		.required("Поле обязательно!")
		.max(50, "Максимальная длина - 50 символов"),
	patronymic: Yup.string()
		.required("Поле обязательно!")
		.max(50, "Максимальная длина - 50 символов"),
	login: Yup.string()
		.required("Поле обязательно!")
		.max(25, "Макмимальная длина - 25 символов"),
	password: Yup.string()
		.required("Поле обязательно!")
		.min(3, "Пароль слишком короткий - минимум 3 символа")
		.max(50, "Максимальная длина - 50 символов"),
	role: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(1, "Минимальное значение - 1")
		.max(4, "Максимальное значение - 4"),
});

export const addProjectSchema = Yup.object().shape({
	name: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
})

export const addChapterSchema = Yup.object().shape({
	name: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
})

export const addSubchapterSchema = Yup.object().shape({
	name: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
})

export const addEspenseSchema = Yup.object().shape({
	name: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
	units: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
	quantity: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(0, "Минимальное значение - 0")
		.max(1000000, "Максимальное значение - 1000000"),
	unitCost: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(0, "Минимальное значение - 0")
		.max(100000000, "Максимальное значение - 100000000"),
})

export const addWorkSchema = Yup.object().shape({
	name: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
	units: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
	quantity: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(0, "Минимальное значение - 0")
		.max(1000000, "Максимальное значение - 1000000"),
	unitCost: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(0, "Минимальное значение - 0")
		.max(100000000, "Максимальное значение - 100000000"),
})

export const addScheduleSchema = Yup.object().shape({
	startDate: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
	maxDayPlannedQuantity: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(1, "Минимальное значение - 1")
		.max(1000000, "Максимальное значение - 1000000"),
	daysInterval: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(1, "Минимальное значение - 1")
		.max(1000000, "Максимальное значение - 1000000"),
})

export const addMaterialSchema = Yup.object().shape({
	name: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
	units: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
	quantity: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(0, "Минимальное значение - 0")
		.max(1000000, "Максимальное значение - 1000000"),
	ratio: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(0, "Минимальное значение - 0")
		.max(1000000, "Максимальное значение - 100"),
	unitCost: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(0, "Минимальное значение - 0")
		.max(100000000, "Максимальное значение - 100000000"),
})

export const addShipmentSchema = Yup.object().shape({
	date: Yup.string()
		.required("Поле обязательно!")
		.max(255, "Макмимальная длина - 255 символов"),
	quantity: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(0, "Минимальное значение - 0")
		.max(1000000, "Максимальное значение - 1000000"),
})

export const editAtWorkSchema = Yup.object().shape({
	atwork: Yup.number()
		.required("Поле обязательно!")
		.typeError("Значение должно быть числом!")
		.min(0, "Минимальное значение - 0")
		.max(1000000, "Максимальное значение - 1000000"),
})