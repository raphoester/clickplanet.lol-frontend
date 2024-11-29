import Viewer, {ViewerProps} from "./viewer/Viewer.tsx";

import Warning from "./Warning.tsx";
import Banner from "./Banner.tsx";
import DiscordButton from "./DiscordButton.tsx";
import Modal from "./components/Modal.tsx";
import BuyMeACoffee from "./BuyMeACoffee.tsx";

export type AppProps = ViewerProps

export default function App(props: AppProps) {
    return <>
        {detectMobile() && <Warning
            title={"IPHONES NOT SUPPORTED"}
            messages={[
                `This site is very malfunctioning on mobile devices.`,
                `IPhones in particular have very strict limitations on memory usage.`,
                `It kinda works on Android but not everytime.`,
                `To get the best experience, use a laptop or a desktop computer.`
            ]}
        />}

        <Banner
            text="Chat in real time with other players!"
            cta={<DiscordButton
                message="Join our official Discord server"/>}
        >
        </Banner>

        <Modal
            title={"Hey there!"}
            isOpenByDefault={Math.random() < 0.5}
            children={<>
                {/*todo: re enable that when i have put ads */}
                {/*<h3>Are you using an ad blocker ?</h3>*/}
                {/*<p>That's fine, I do the same...</p>*/}
                {/*<p>But the servers are quite expensive to run.</p>*/}
                {/*<p>So if you like the game, please consider buying me a coffee :)</p>*/}
                <h3>Do you like the game ?</h3>
                <p>It's free and open-source.</p>
                <p>But the servers are quite expensive to run.</p>
                <p>So if you enjoy your time here, please consider buying me a coffee :)</p>
                <BuyMeACoffee/>
            </>}
        />
        <Viewer
            tileClicker={props.tileClicker}
            ownershipsGetter={props.ownershipsGetter}
            updatesListener={props.updatesListener}
        />
    </>
}

function detectMobile() {
    if ((window.innerWidth <= 800) && (window.innerHeight <= 600)) {
        return true;
    }

    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}