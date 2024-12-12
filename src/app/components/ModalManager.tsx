import {ReactNode, useState} from "react";
import Modal from "./Modal.tsx";
import BlockButton, {BlockButtonProps} from "./BlockButton.tsx";

type ModalManagerProps = {
    openByDefault: boolean;
    modalTitle: string;
    modalChildren: ReactNode;
    buttonProps: BlockButtonProps;
    closeButtonText?: string;
}

export default function ModalManager(props: ModalManagerProps) {
    const [isOpen, setIsOpen] = useState(props.openByDefault)

    const togglePopup = (val: boolean) => {
        return () => {
            setIsOpen(val)
        }
    }

    return (
        <>
            <BlockButton
                onClick={() => {
                    props.buttonProps.onClick()
                    togglePopup(true)()
                }}
                text={props.buttonProps.text}
                imageUrl={props.buttonProps.imageUrl}
                className={props.buttonProps.className}
            />

            {isOpen && <Modal
                title={props.modalTitle}
                children={props.modalChildren}
                onClose={togglePopup(false)}
                closeButtonText={props.closeButtonText}
            />}
        </>
    )
}