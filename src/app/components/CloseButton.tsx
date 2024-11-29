import "./CloseButton.css"

export type CloseButtonProps = {
    onClick: () => void;
    className?: string;
}

export default function CloseButton(props: CloseButtonProps) {
    return (
        <button className={"close-button " + props.className} onClick={props.onClick}>X</button>
    )
}