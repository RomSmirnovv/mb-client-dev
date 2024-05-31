import { makeAutoObservable } from "mobx"

export default class ChapterStore {
	constructor() {
		this._chapters = [
		]
		makeAutoObservable(this)
	}

	setChapter(chapters) {
		this._chapters = chapters
	}

	get chapters() {
		return this._chapters
	}
}