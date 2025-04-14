import axios from "@/configs/axios-customize"
import { sfEqual, sfLike } from "spring-filter-query-builder";


const baseURL = '/learn'

export const getCourseDetails = async (courseId) => {
    const response = await axios.get(`${baseURL}/get/courses/${courseId}`);

    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}

export const registerCourse = async (courseId) => {
    const response = await axios.post(`${baseURL}/register/courses/${courseId}`);

    if (response.statusCode === 200) {
        return response;
    } else {
        throw new Error(response.message);
    }
}

export const fetchListCourses = async (filter) => {

    const filterString = filter ? sfEqual("topic.topicId", `${filter}`).toString() : null;

    const params = filterString ? { filter: filterString } : {};

    const response = await axios.get(`${baseURL}/get/list`, { params });


    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}

export const markLessonComplete = async (lessonId, courseId, complete = true) => {
    const payload = {
        lessonId,
        courseId,
        complete
    };

    const response = await axios.post(`${baseURL}/tracking`, payload);
    if (!response.statusCode === 200) {
        throw new Error(response);
    }
}

export const markCourseComplete = async (courseId) => {
    const response = await axios.put(`${baseURL}/finish/course/${courseId}`);
    console.log(response)
    if (!response.statusCode === 200) {
        throw new Error(response);
    }
}

