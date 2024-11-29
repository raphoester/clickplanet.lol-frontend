import {ReactNode, useState} from "react";
import CloseButton from "./CloseButton.tsx";
import "./Modal.css"

type ModalProps = {
    isOpenByDefault: boolean;
    title?: string;
    children: ReactNode;
}

export default function Modal(props: ModalProps) {
    const [isOpen, setIsOpen] = useState(props.isOpenByDefault)

    return (<>
        {isOpen && <div className="modal">
            <div className="modal">
                <div className="modal-content">
                    {props.title &&
                        <div className="modal-header">
                            <h3 className="modal-header-text"
                            >{props.title}</h3>
                        </div>
                    }
                    <CloseButton
                        className="modal-close"
                        onClick={() => {
                            setIsOpen(false)
                        }}/>
                    <div className="modal-content-children">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>}
    </>)
}
