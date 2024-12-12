import "./About.css"
import BuyMeACoffee from "./components/BuyMeACoffee.tsx";
import ModalManager from "./components/ModalManager.tsx";

export default function About() {
    return <ModalManager
        openByDefault={false}
        modalTitle={"ClickPlanet"}
        modalChildren={<>
            <h3>The ultimate world war</h3>
            <h4>It’s like Pixel Wars but way more epic</h4>
            <p>ClickPlanet is a virtual battleground where you <br/>conquer territories for a country, click after
                click. <br/>Out-click rival nations, and dominate the map. <br/>Every territory is yours, until someone
                takes it back!</p>
            <div className="modal-about-author">
                <p className="center-align">Created by</p>
                <div className="center-align">
                    <img alt="Raphaël Oester"
                         src="/static/raphael.jpeg"
                         className="modal-about-photo"/>
                </div>
                <h3>Raphaël Oester</h3>
                <p className="center-align">Freelance Developer open to new opportunities</p>
                <div className="modal-about-social">
                    <a target="_blank" href="https://www.linkedin.com/in/raphael-oester/"><b>in</b></a>
                    <a target="_blank" href="https://x.com/raphael_oester"><b>X</b></a>
                    <a target="_blank" href="https://github.com/raphoester"><b>GitHub</b></a>
                </div>
            </div>
            <BuyMeACoffee/>
        </>}
        buttonProps={{
            onClick: () => {
            },
            text: "About",
            className: "button-about"
        }}
        closeButtonText={"Back"}
    />

}