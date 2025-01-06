import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import talkerImage from "../../assets/talker.svg";
import copyImage from "../../assets/copy.svg";
import mdImage from "../../assets/md_file_icon_215056.svg";
import { getKeypoints, getJobStatus } from "../../feature/https.tsx";
import { mdFileExport } from "./feature/mdFileExport.tsx";
import Header from "../../components/Header.tsx";
import styles from "./resultPage.module.scss";

const ResultPage = () => {
    const [fileUrl, setFileUrl] = useState("");
    const [resultText, setResultText] = useState("");
    const [loading, setLoading] = useState(true);
    const resultRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const keyWordRef = useRef<HTMLDivElement>(null);
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

    const formatImageUrl = (imagePath: string) => {
        const pathParts = imagePath.split('//');
        return `http://129.146.2.28:81/${pathParts[0]}/${pathParts[1]}`;
    };

    const importImage = async () => {
        const jobId = localStorage.getItem("id");
        if (!jobId) return;

        try {
            const imageres = await getKeypoints(jobId);
            if (imageres && imageRef.current && keyWordRef.current) {
                // Clear existing content
                imageRef.current.innerHTML = '';

                // Create image scroll container
                const scrollContainer = document.createElement('div');
                scrollContainer.className = styles.imageScroll;

                // Add images
                imageres.images.forEach((imagePath: string) => {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = styles.imageWrapper;

                    const img = document.createElement('img');
                    img.src = formatImageUrl(imagePath);
                    img.alt = "Screenshot";

                    imgWrapper.appendChild(img);
                    scrollContainer.appendChild(imgWrapper);
                });

                imageRef.current.appendChild(scrollContainer);

                // Render keywords
                keyWordRef.current.innerHTML = '';
                const ul = document.createElement('ul');
                ul.className = styles.keywordContainer;

                imageres.keypoints.forEach((keypoint: string) => {
                    const li = document.createElement('li');
                    li.textContent = keypoint;
                    ul.appendChild(li);
                });

                keyWordRef.current.appendChild(ul);
            }
        } catch (error) {
            console.error("Error importing image:", error);
        }
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
                    src={talkerImage}
                    alt="talker"
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className={styles.resultTexts}
                >
                    <div ref={imageRef}></div>
                    <div ref={keyWordRef}></div>
                    <p ref={resultRef}>{resultText}</p>
                    <div className={styles.foobar}>
                        <img
                            src={copyImage}
                            alt="copy"
                            onClick={copyText}
                        />
                        <img
                            src={mdImage}
                            alt="notion"
                            onClick={mdFileDownload}
                        />
                        <p
                            onClick={() => navigate("/promptPage")}
                            className={styles.adsf}
                        >
                            돌아가기
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ResultPage;