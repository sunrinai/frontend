import { useEffect, useState } from "react";

const baseUrl = "http://129.146.2.28:8000";

export function TestPage() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const uploadVideo = async () => {
        if (!file) {
            console.error("No file selected");
            return;
        }
        const result = await postJob(file);
        console.log(result);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadVideo}>Upload Video</button>
        </div>
    );
}

const postJob = async (video: File) => {
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
