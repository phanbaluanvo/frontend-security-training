import axios from "@/configs/axios-customize"
import { sfEqual, sfLike } from "spring-filter-query-builder";

const baseURL = '/modules'

export const fetchModules = async (page, size) => {
    const params = {
        page,
        size
    }

    const response = await axios.get(`${baseURL}/get`, { params });

    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}

export const fetchListModules = async (filter) => {
    const filterString = filter ? sfEqual("course.courseId", `${filter}`).toString() : null;

    const params = filterString ? { filter: filterString } : {};

    const response = await axios.get(`${baseURL}/get/list`, { params });

    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}

export const createModule = async (module) => {
    const response = await axios.post(`${baseURL}/create`, module);

    if (response.statusCode !== 200) throw new Error(response.message);
}

export const getModuleByModuleId = async (moduleId) => {

    const response = await axios.get(`${baseURL}/get/${moduleId}`);

    if (response.statusCode === 200) {
        return response.data;
    } else throw new Error(response.message)
}

export const updateModule = async (module) => {
    const response = await axios.put(`${baseURL}/update/${module.moduleId}`, module);

    if (response.statusCode !== 200) throw new Error(response.message)
}

export const deleteModuleByModuleId = async (moduleId) => {
    const response = await axios.delete(`${baseURL}/delete/${moduleId}`)

    if (response.statusCode !== 200) throw new Error(response.message)

}