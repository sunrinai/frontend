import talkerImage from "../../assets/talker.svg"
import copyImage from "../../assets/copy.svg"
import mdImage from "../../assets/md_file_icon_215056.svg"
import styles from "./resultPage.module.scss"
import Header from "../../components/Header.tsx";
import {mdFileExport} from "./feature/mdFileExport.tsx";
import {getKeypoints, getJobStatus} from "../../feature/https.tsx";
import {motion} from "framer-motion";
import {useRef, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function ResultPage() {
    const [fileUrl, setFileUrl] = useState("");
    const [resultText, setResultText] = useState("");
    const [loading, setLoading] = useState(true);
    const resultRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLElement>(null);
    const keyWordRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkJobStatus();
    }, []);

    const checkJobStatus = async () => {
        const jobId = localStorage.getItem("id");
        if (!jobId) {
            navigate("/promptPage");
            return;
        }

        try {
            const statusRes = await getJobStatus(jobId);
            if (statusRes.status === "Done") {
                // 상태가 Done일 때만 결과를 로드
                loadResults();
                importImage();
                setLoading(false);
            } else {
                alert("작업이 아직 완료되지 않았습니다.");
                navigate("/promptPage");
            }
        } catch (error) {
            console.error("Error checking job status:", error);
            alert("상태 확인 중 오류가 발생했습니다.");
            navigate("/promptPage");
        }
    };

    const loadResults = () => {
        if (resultRef.current) {
            const textValue = resultRef.current.textContent;
            console.log(textValue);
            const value = mdFileExport(textValue);
            setFileUrl(value);
        }
        const text = localStorage.getItem("result");
        setResultText(text);
    };

    const mdFileDownload = () => {
        if (fileUrl) {
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = "resultFile.md";
            a.click();
        }
    };

    const copyText = () => {
        window.navigator.clipboard.writeText(resultText);
        alert("Copied!");
    };

    const importImage = async () => {
        const jobId = localStorage.getItem("id");
        if (!jobId) return;

        try {
            const imageres = await getKeypoints(jobId);
            if (imageres) {
                // 이미지 렌더링
                if (imageRef.current) {
                    const imageContainer = imageRef.current;
                    imageContainer.innerHTML = '';
                    imageres.images.forEach((imagePath: string) => {
                        const img = document.createElement('img');
                        img.src = imagePath;
                        img.alt = "Screenshot";
                        img.className = styles.resultImage;
                        imageContainer.appendChild(img);
                    });
                }

                // 키포인트 렌더링
                if (keyWordRef.current) {
                    const keywordContainer = keyWordRef.current;
                    keywordContainer.innerHTML = '';
                    const ul = document.createElement('ul');
                    ul.className = styles.keywordList;

                    imageres.keypoints.forEach((keypoint: string) => {
                        const li = document.createElement('li');
                        li.textContent = keypoint;
                        ul.appendChild(li);
                    });

                    keywordContainer.appendChild(ul);
                }
            }
        } catch (error) {
            console.error("Error importing image:", error);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.loading}>로딩 중...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.contents}>
                <motion.img
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    src={talkerImage} alt="talker" />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className={styles.resultTexts}>
                    <div ref={imageRef}></div>
                    <div ref={keyWordRef}></div>
                    <p ref={resultRef}>{resultText}</p>
                    <div className={styles.foobar}>
                        <img src={copyImage} alt="copy" width="30px" onClick={copyText} />
                        <img src={mdImage} alt="notion" width="30px" onClick={mdFileDownload} />
                        <p onClick={() => navigate("/promptPage")} className={styles.adsf}>돌아가기</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}