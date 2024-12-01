import "./BlockButton.css"

export type BlockButtonProps = {
    onClick: () => void;
    text: string;
    imageUrl?: string;
    className?: string;
}

export default function BlockButton(props: BlockButtonProps) {
    return <button
        onClick={props.onClick}
        className={`block-button ${props.className}`}>
        {props.imageUrl &&
            <img src={props.imageUrl} alt="" className="block-button-img"/>
        }
        <div className="block-button-text">{props.text}</div>
    </button>
}