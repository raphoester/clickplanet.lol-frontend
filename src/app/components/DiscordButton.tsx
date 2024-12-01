import "./DiscordButton.css";

export type DiscordButtonProps = {
    message?: string;
};

export default function DiscordButton({message = "Join our Discord server"}: DiscordButtonProps) {
    return (
        <div>
            <a
                href="https://discord.gg/Nwekj6ndbn"
                target="_blank"
                rel="noopener noreferrer"
                className="discord-button-link"
                aria-label={message}
            >
                <img
                    src="/static/discord.svg"
                    className="discord-button-img"
                    alt="Discord logo"
                />
                <span className="discord-button-text">{message}</span>
            </a>
        </div>
    );
}
