import { makeAutoObservable } from "mobx"

export default class ProjectStore {
	constructor() {
		this._projects = [
		]
		this._selectedProject = {}
		makeAutoObservable(this)
	}


	setProjects(projects) {
		this._projects = projects
	}
	setSelectedProject(project) {
		this._selectedProject = project
	}

	get projects() {
		return this._projects
	}
	get selectedProject() {
		return this._selectedProject
	}
}