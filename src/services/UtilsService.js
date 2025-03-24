import axios from "@/configs/axios-customize"

export const convertBase64ToFile = async (base64Url, fileInfo) => {
    const blob = await fetch(base64Url)
        .then((res) => res.blob());
    const file = new File([blob], fileInfo.name, { type: fileInfo.type });

    return file;
}

export const saveFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file)
    console.log(formData)

    const response = await axios.post(`/courses/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (!response.statusCode === 200) {
        throw new Error(response.error);
    }
    return response.data;
}