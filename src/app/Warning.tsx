import "./Warning.css"

import {useState} from "react";

type WarningProps = {
    title: string;
    messages: string[];
}

export default function Warning(props: WarningProps) {
    const [isOpen, setIsOpen] = useState(true)
    const togglePopup = (val: boolean) => {
        return () => {
            setIsOpen(val)
        }
    }
    return <>
        {isOpen &&
            <div className="warning-modal">
                <div className="warning-modal-card">
                    <h2>{props.title}</h2>
                    {props.messages.map((message, index) => <p key={index}>{message}</p>)}
                    <button className="warning-modal-button" onClick={togglePopup(false)}>UNDERSTOOD</button>
                </div>
            </div>
        }
    </>
}