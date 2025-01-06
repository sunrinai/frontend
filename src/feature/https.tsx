
const baseUrl = "http://129.146.2.28:81"

export const postJob = async (video: File) => {
    try {
        const formData = new FormData();
        formData.append("file", video);

        const response = await fetch(`${baseUrl}/job/new`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        console.log("비디오 업로드 성공", data);
        return data;
    } catch (err) {
        console.error("비디오 업로드 실패", err);
    }
};
export const getJobStatus = async (id) => {
    try{
        const response = await fetch(`${baseUrl}/job/${id}/status`,{
            method: 'GET'
        })
        const data = await response.json()
        console.log(data)
        return data
    }catch(err){
        console.log(err)
    }
}

export const getKeypoints = async (id) => {
    try{
        const response = await fetch(`${baseUrl}/job/${id}`,{
            method: 'GET'
        })
        const data = await response.json()
        console.log(data)
        return data
    } catch (e){
        console.log(e)
    }
}

export const getStt = async (id) => {
    try{
            const response = await fetch(`${baseUrl}/job/${id}/stt`,{
            method: 'GET'
        })
        const data = await response.json()
        console.log(data)
        return data
    } catch (e){
        console.log(e)
    }
}