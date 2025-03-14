import axios from "@/configs/axios-customize"
import { sfLike } from "spring-filter-query-builder";


const baseURL = '/courses'

export const fetchCourses = async (page, size) => {
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

export const fetchListCourses = async (filter) => {

    const filterString = filter ? sfLike("topic.topicId", `*${filter}*`).toString() : null;

    const params = filterString ? { filter: filterString } : {};

    const response = await axios.get(`${baseURL}/get/list`, { params });

    console.log(response);

    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}

export const createCourse = async (course) => {
    const response = await axios.post(`${baseURL}/create`, course);

    if (response.statusCode !== 200) throw new Error(response.message);
}

export const getCourseByCourseId = async (courseId) => {

    const response = await axios.get(`${baseURL}/get/${courseId}`);

    if (response.statusCode === 200) {
        return response.data;
    } else throw new Error(response.message)
}

export const updateCourse = async (course) => {
    const response = await axios.put(`${baseURL}/update/${course.courseId}`, course);

    console.log(response);
    console.log(course);

    if (response.statusCode !== 200) throw new Error(response.message)
}

export const deleteCourseByCourseId = async (courseId) => {
    const response = await axios.delete(`${baseURL}/delete/${courseId}`)

    if (response.statusCode !== 200) throw new Error(response.message)

}