import styles from "./startPage.module.scss";
import Button from "../../components/Button.tsx";
import Logo from "../../assets/ailogo.svg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function StartPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <motion.div className={styles.content}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
            >
                <img src={Logo} alt="ailogo" />
                <p

                >
                    HAIE, 여러분의 회의요약 AI
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay :1,duration: 1 }}
            >
                <Button
                    className={styles.button}
                    onClick={() => {
                        navigate("/promptPage");
                    }}
                >
                    start
                </Button>
            </motion.div>
        </div>
    );
}
