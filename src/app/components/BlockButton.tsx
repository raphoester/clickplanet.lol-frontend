export type BlockButtonProps = {
    onClick: () => void;
    text: string;
    imageUrl?: string;
    className?: string;
}

export default function BlockButton(props: BlockButtonProps) {
    return <button
        onClick={props.onClick}
        className="button">
        {props.text}
    </button>
}