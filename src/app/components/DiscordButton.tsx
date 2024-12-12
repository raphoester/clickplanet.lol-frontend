import "./DiscordButton.css";

export type DiscordButtonProps = {
    message?: string;
};

export default function DiscordButton({message = "Join us on Discord"}: DiscordButtonProps) {
    return (
            <a
                href="https://discord.gg/Nwekj6ndbn"
                target="_blank"
                rel="noopener noreferrer"
                className="button button-discord"
                aria-label={message}
            >
                {message}
            </a>
    );
}
