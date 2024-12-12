import "./CloseButton.css"

export type CloseButtonProps = {
    onClick: () => void;
    className?: string;
    text?: string;
}

export default function CloseButton(props: CloseButtonProps) {
    return (
        <button className="button button-close" onClick={props.onClick}>{props.text || "Close"}</button>
    )
}