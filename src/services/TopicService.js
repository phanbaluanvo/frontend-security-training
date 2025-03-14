import axios from "@/configs/axios-customize"
import { sfLike } from "spring-filter-query-builder";


const baseURL = '/topics'

export const fetchTopics = async (page, size) => {
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

export const fetchListTopics = async (filter) => {

    const filterString = filter ? sfLike("topicId", `*${filter}*`).toString() : null;

    const params = filterString ? { filter: filterString } : {};

    const response = await axios.get(`${baseURL}/get/list`, { params });

    if (response.statusCode === 200) {
        return response.data;
    } else {
        throw new Error(response);
    }
}

export const createTopic = async (topic) => {
    const response = await axios.post(`${baseURL}/create`, topic);

    if (response.statusCode !== 200) throw new Error(response.message);
}

export const getTopicByTopicId = async (topicId) => {

    const response = await axios.get(`${baseURL}/get/${topicId}`);

    if (response.statusCode === 200) {
        return response.data;
    } else throw new Error(response.message)
}

export const updateTopic = async (topic) => {
    const response = await axios.put(`${baseURL}/update/${topic.topicId}`, topic);

    if (response.statusCode !== 200) throw new Error(response.message)
}

export const deleteTopicByTopicId = async (topicId) => {
    const response = await axios.delete(`${baseURL}/delete/${topicId}`)

    if (response.statusCode !== 200) throw new Error(response.message)

}