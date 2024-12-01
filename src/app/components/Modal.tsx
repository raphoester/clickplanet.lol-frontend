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
                    <h3 className="modal-header-text"
                    >{props.title}</h3>
                </div>
            }
            <CloseButton
                className="modal-close"
                onClick={props.onClose}/>
            <div className="modal-content-children">
                {props.children}
            </div>
        </div>
    </div>)
}
