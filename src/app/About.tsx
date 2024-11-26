import {useState} from "react";
import "./About.css"
import BuyMeACoffee from "./BuyMeACoffee.tsx";

export default function About() {
    const [isOpen, setIsOpen] = useState(false)
    const togglePopup = (val: boolean) => {
        return () => {
            setIsOpen(val)
        }
    }

    return (
        <>
            <button onClick={togglePopup(true)} className="about-opener-button">
                About
            </button>

            {isOpen &&
                <>
                    <div className="about-modal" onClick={togglePopup(false)}>
                        <div className="about-modal-card" onClick={(e) => e.stopPropagation()}>
                            <button className="about-modal-card-close" onClick={togglePopup(false)}></button>
                            <div className="about-modal-header">
                                <h2>About</h2>
                            </div>
                            <div className="about-modal-body">
                                <p>ClickPlanet is a world map where people virtually conquer territory
                                    on behalf of their country. </p>
                                <p>Think of it as Pixel Wars with flags. When you conquer
                                    a territory, it belongs to your country until someone from another country clicks
                                    on it.</p>
                                <div className={"about-modal-author"}>
                                    <h4>Created by Raphaël Oester</h4>
                                    <img alt="picture of Raphaël Oester"
                                         src="/static/raphael.png"
                                         className="about-modal-pfp"/>
                                    <div className="about-modal-author-donate">
                                    </div>
                                    <p>I'm a freelance Go backend dev,<br/>and btw I'm looking for new mission :)</p>
                                </div>
                            </div>
                            <ul className="links">
                                <li><a target="_blank" href="https://www.linkedin.com/in/raphael-oester/">LinkedIn</a>
                                </li>
                                <li><a target="_blank" href="https://x.com/raphael_oester">X</a></li>
                                <li><a target="_blank" href="https://github.com/raphoester">GitHub</a></li>
                            </ul>
                            <BuyMeACoffee/>
                        </div>

                    </div>
                </>
            }
        </>
    )
}