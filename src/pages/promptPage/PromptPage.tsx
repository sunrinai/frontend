import Header from '../../components/Header';
import styles from "./promptPage.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import { summarizeText } from "./feature/aiResultFunction.tsx";
import { getStt, postJob, getJobStatus } from "../../feature/https.tsx";

export default function PromptPage() {
    const [videoFile, setVideoFile] = useState<string | null>(null);
    const [toServerVideo, setToServerVideo] = useState<string | null>(null);
    const [toSummerText, setToSummerText] = useState<string | null>(null);
    const [inputString, setInputString] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [jobStatus, setJobStatus] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(URL.createObjectURL(file));
            setToServerVideo(file);
            try {
                const res = await postJob(file);
                console.log(res)
                localStorage.setItem("id", res.id);
            } catch (error) {
                console.error("Error posting job:", error);
            }
        }
    };

    useEffect(() => {
        const jobId = localStorage.getItem("id");
        let pollingInterval: NodeJS.Timeout;

        if (jobId) {
            const fetchStatus = async () => {
                try {
                    const res = await getJobStatus(jobId);
                    setJobStatus(res.status);

                    if (res.status === "Processing") {
                        clearInterval(pollingInterval);
                        fetchStt();
                    }
                } catch (error) {
                    console.error("Error getting job status:", error);
                }
            };

            pollingInterval = setInterval(fetchStatus, 3000); // 3초마다 상태 확인

            return () => clearInterval(pollingInterval);
        }
    }, []);

    const fetchStt = async () => {
        const jobId = localStorage.getItem("id");
        if (jobId) {
            try {
                const res = await getStt(jobId);
                if (res) {
                    setInputString(res.text);
                    console.log(res.text);
                }
            } catch (error) {
                console.error("Error fetching STT:", error);
            }
        }
    };

    const handleSummarize = async () => {
        const jobId = localStorage.getItem("id");
        setLoading(true);

        try {
            if (jobId) {
                const statusRes = await getJobStatus(jobId);

                if (statusRes.status === "Processing") {
                    // STT 결과를 먼저 받아옴
                    const sttRes = await getStt(jobId);
                    if (sttRes && sttRes.data) {
                        // STT 결과를 state에 저장
                        setInputString(sttRes.text);

                        // 요약 진행
                        const result = await summarizeText({
                            message: sttRes.text, // 방금 받은 STT 데이터 사용
                            prompt: toSummerText
                        });

                        console.log("요약 결과:", result);
                        localStorage.setItem("result", result);
                        setLoading(false);
                        navigate("/resultPage");
                    } else {
                        setLoading(false);
                        alert("STT 결과를 받아오지 못했습니다.");
                    }
                } else {
                    setLoading(false);
                    alert("작업이 아직 준비되지 않았습니다. 다시 시도해주세요.");
                }
            }
        } catch (error) {
            setLoading(false);
            console.error("Error in handleSummarize:", error);
            alert("요약 과정에서 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.contents}>
                <div className={styles.buttonCon}>
                    <label htmlFor="file">
                        <Button className={styles.videoInputButton}>
                            파일찾기
                        </Button>
                    </label>
                </div>
                <input id="file" type="file" accept="video/*" onChange={handleFileChange} />
                {videoFile ? (
                    <video src={videoFile} controls className={styles.prevVideo} />
                ) : (
                    <div className={styles.videoSkeleton}>
                        파일없음
                    </div>
                )}
                <div className={styles.promptCon}>
                    <input
                        className={styles.promptInput}
                        placeholder="무엇을 요약하실 건가요?"
                        onChange={(e) => setToSummerText(e.target.value)}
                    />
                    <Button className={styles.promptInputButton} onClick={handleSummarize}>
                        입력
                    </Button>
                </div>
                {loading && <div className={styles.loading}>로딩 중...</div>}
            </div>
        </div>
    );
}