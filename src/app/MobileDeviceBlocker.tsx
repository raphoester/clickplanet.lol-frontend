import "./MobileDeviceBlocker.css";

export default function MobileDeviceBlocker() {
    return <div className="mobile-blocker-container">
        <h1>Not so fast !!</h1>
        <p className="mobile-blocker-container-subtitle">Site is unusable on mobiles.</p>
        <p className="mobile-blocker-container-subtitle"> Go get your laptop</p>
        <p className="mobile-blocker-container-subtext">(I'm not asking)</p>
        <img src="/static/gru-gun-meme.png" alt="funny meme lol"/>
    </div>
}