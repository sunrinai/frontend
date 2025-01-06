import {ReactNode} from "react";

type ButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function Button({ children, onClick, className }: ButtonProps) {
    return (
        <div className = { className } onClick={onClick}>
            {children}
        </div>
    )
}