import {ReactNode} from "react";
import CloseButton from "./CloseButton.tsx";
import "./Modal.css"

export type ModalProps = {
    title?: string;
    children: ReactNode;
    onClose: () => void;
}

export default function Modal(props: ModalProps) {
    return (<div className="modal" onClick={props.onClose}>
        <div
            className="modal-content"
            onClick={(e) => {
                e.stopPropagation()
            }}>
            {props.title &&
                <div className="modal-header">
                    <h2>{props.title}</h2>
                </div>
            }
            {props.children}
            <CloseButton onClick={props.onClose}/>
        </div>
    </div>)
}
