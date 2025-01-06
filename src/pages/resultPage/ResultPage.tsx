import talkerImage from "../../assets/talker.svg"
import copyImage from "../../assets/copy.svg"
import mdImage from "../../assets/md_file_icon_215056.svg"
import styles from "./resultPage.module.scss"
import Header from "../../components/Header.tsx";
import {mdFileExport} from "./feature/mdFileExport.tsx";
import {getKeypoints} from "../../feature/https.tsx";
import {motion} from "framer-motion";
import {useRef, useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

export default function ResultPage() {
    const [fileUrl, setFileUrl] = useState("");
    const [resultText, setResultText] = useState("");
    const resultRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLElement>(null);
    const keyWordRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (resultRef.current) {
            const textValue = resultRef.current.textContent; // 또는 innerText
            console.log(textValue);
            const value  = mdFileExport(textValue);
            setFileUrl(value);
        }
        const text = localStorage.getItem("result")
        setResultText(text);
    }, []);

    const mdFileDownload = () => {
        if (fileUrl) {
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = "resultFile.md"; // 원하는 파일명
            a.click();
        }
    }

    const copyText = () => {
        window.navigator.clipboard.writeText(resultText);
        alert("Copied!");
    }

    useEffect(() => {
        if (resultRef.current) {
            const textValue = resultRef.current.textContent;
            console.log(textValue);
            const value = mdFileExport(textValue);
            setFileUrl(value);
        }
        const text = localStorage.getItem("result")
        setResultText(text);

        // 이미지와 키포인트 데이터 가져오기
        importImage();
    }, []);

    const importImage = () => {
        const imageres = getKeypoints(localStorage.getItem("id"));
        if (imageres) {
            // 이미지 렌더링
            if (imageRef.current) {
                const imageContainer = imageRef.current;
                imageContainer.innerHTML = ''; // 기존 내용 삭제
                imageres.images.forEach((imagePath: string) => {
                    const img = document.createElement('img');
                    img.src = imagePath;
                    img.alt = "Screenshot";
                    img.className = styles.resultImage; // 적절한 스타일 클래스 추가
                    imageContainer.appendChild(img);
                });
            }

            // 키포인트 렌더링
            if (keyWordRef.current) {
                const keywordContainer = keyWordRef.current;
                keywordContainer.innerHTML = ''; // 기존 내용 삭제
                const ul = document.createElement('ul');
                ul.className = styles.keywordList; // 적절한 스타일 클래스 추가

                imageres.keypoints.forEach((keypoint: string) => {
                    const li = document.createElement('li');
                    li.textContent = keypoint;
                    ul.appendChild(li);
                });

                keywordContainer.appendChild(ul);
            }
        }
    }

    return (
        <div className={styles.container}>
            <Header></Header>
            <div className={styles.contents}>
                <motion.img
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    src={talkerImage} alt="talker" />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay :1,duration: 1 }}
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
    )
}
