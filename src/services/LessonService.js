import axios from "@/configs/axios-customize"
import { sfEqual, sfLike } from "spring-filter-query-builder";

const baseURL = '/lessons'

export const fetchLessons = async (page, size) => {
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

export const fetchListLesson = async (filter) => {
    const filterString = filter && sfEqual('module.moduleId', `${filter}`).toString()

    const response = await axios.get(`${baseURL}/get/list`, {
        params: filterString,
    });
    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}

export const createLessons = async (lesson) => {
    const response = await axios.post(`${baseURL}/create`, lesson);

    if (response.statusCode !== 200) throw new Error(response.message);
}

export const getLessonByLessonId = async (lessonId) => {

    const response = await axios.get(`${baseURL}/get/${lessonId}`);

    if (response.statusCode === 200) {
        return response.data;
    } else throw new Error(response.message)
}

export const getLessonDetailsByCourseId = async (courseId, lessonId) => {
    const response = await axios.get(`${baseURL}/get/courses/${courseId}/lessons/${lessonId}`);

    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response.message);
    }
}

export const updateLesson = async (lesson) => {
    const response = await axios.put(`${baseURL}/update/${lesson.lessonId}`, lesson);

    if (response.statusCode !== 200) throw new Error(response.message)
}

export const deleteLessonByLessonId = async (lessonId) => {
    const response = await axios.delete(`${baseURL}/delete/${lessonId}`)

    if (response.statusCode !== 200) throw new Error(response.message)

}