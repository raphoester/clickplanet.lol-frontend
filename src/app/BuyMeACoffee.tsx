import './BuyMeACoffee.css'

export default function BuyMeACoffee() {
    return <a
        className="bmc-button"
        target="_blank"
        href="https://buymeacoffee.com/raphoester"
    >
        <img
            className="bmc-button-img"
            src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
            alt="Buy me a coffee"
        />
        <span className="bmc-button-text">Buy me a coffee</span>
    </a>
};
