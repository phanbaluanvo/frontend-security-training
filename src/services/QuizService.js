import axios from "@/configs/axios-customize"
import { sfAnd, sfEqual, sfLike } from "spring-filter-query-builder";


const baseURL = '/quizzes'

export const createQuiz = async (quiz) => {
    const response = await axios.post(`${baseURL}/create`, quiz);

    if (response.statusCode !== 200) throw new Error(response.message);
}

export const fetchQuizzesByCourse = async (courseId, page, size) => {

    const filterString = courseId ? sfEqual("course.courseId", `${courseId}`).toString() : null;

    const params = {
        page,
        size,
        filter: filterString
    }

    const response = await axios.get(`${baseURL}/get`, { params });

    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}

export const fetchListQuestionsByCourseIdAndQuizId = async (courseId, quizId) => {
    if (!quizId || !courseId) {
        throw new Error("Invalid courseId or quizId");
    }

    console.log("Quiz: " + quizId + ", Course: " + courseId);

    const filterString = sfAnd([
        sfEqual("course.courseId", `${courseId}`),
        sfEqual("quizId", `${quizId}`),
    ]).toString();

    const params = { filter: filterString };

    const response = await axios.get(`${baseURL}/get/list`, { params });

    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}

export const deleteQuizByQuizId = async (quizId) => {
    const response = await axios.delete(`${baseURL}/delete/quiz/${quizId}`)

    if (response.statusCode !== 200) throw new Error(response.message)

}

export const deleteQuestionInQuiz = async (quizId, questionId) => {
    const response = await axios.delete(`${baseURL}/delete/quiz/${quizId}/question/${questionId}`)

    if (response.statusCode !== 200) throw new Error(response.message)
}

export const updateQuiz = async (quizId, quizData) => {
    const response = await axios.put(`${baseURL}/update/quiz/${quizId}`, quizData);

    if (response.statusCode !== 200) throw new Error(response.message);
}

export const getActiveQuizForCourse = async (courseId) => {
    const filterString = courseId ?
        sfAnd([sfEqual("course.courseId", `${courseId}`), sfEqual("isActive", `true`)]).toString()
        : null;

    const params = {
        filter: filterString
    }

    const response = await axios.get(`${baseURL}/get/list`, { params });

    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}