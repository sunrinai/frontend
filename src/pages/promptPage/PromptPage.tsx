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
    const [isReady, setIsReady] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(URL.createObjectURL(file));
            setToServerVideo(file);
            setLoading(true);
            try {
                const res = await postJob(file);
                console.log(res);
                localStorage.setItem("id", res.id);
                await waitForProcessing(res.id);
            } catch (error) {
                console.error("Error posting job:", error);
                setLoading(false);
                alert("파일 업로드 중 오류가 발생했습니다.");
            }
        }
    };

    const waitForProcessing = async (jobId: string) => {
        let attempts = 0;
        const maxAttempts = 20; // 최대 60초 대기 (3초 * 20)

        while (attempts < maxAttempts) {
            try {
                const statusRes = await getJobStatus(jobId);
                if (statusRes.status === "Processing") {
                    // STT 데이터 가져오기
                    const sttRes = await getStt(jobId);
                    if (sttRes && sttRes.text) {
                        setInputString(sttRes.text);
                        setIsReady(true);
                        setLoading(false);
                        return;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기
                attempts++;
            } catch (error) {
                console.error("Error checking status:", error);
            }
        }
        setLoading(false);
        alert("STT 변환 시간이 초과되었습니다. 다시 시도해주세요.");
    };

    const handleSummarize = async () => {
        if (!inputString) {
            alert("STT 결과가 아직 준비되지 않았습니다.");
            return;
        }

        if (!toSummerText) {
            alert("요약할 내용을 입력해주세요.");
            return;
        }

        setLoading(true);
        try {
            const result = await summarizeText({
                message: inputString,
                prompt: toSummerText
            });

            console.log("요약 결과:", result);
            localStorage.setItem("result", result);
            setLoading(false);
            navigate("/resultPage");
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
                        disabled={!isReady}
                    />
                    <Button
                        className={styles.promptInputButton}
                        onClick={handleSummarize}
                        disabled={!isReady}
                    >
                        입력
                    </Button>
                </div>
                {loading && <div className={styles.loading}>로딩 중...</div>}
            </div>
        </div>
    );
}