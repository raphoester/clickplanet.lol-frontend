import {ReactNode, useState} from "react";
import "./Banner.css"

export type BannerProps = {
    text: string;
    cta: ReactNode;
}

export default function Banner(props: BannerProps) {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <>
            <div className="banner-container">
                {isOpen && <div className="banner">
                    <div className="banner-content">
                        <div className="banner-text">{props.text}</div>
                        {props.cta}
                    </div>
                    <button className="banner-close" onClick={() => setIsOpen(false)}>X</button>
                </div>}
            </div>
        </>
    )
}