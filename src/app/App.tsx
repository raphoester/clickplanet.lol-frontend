import Viewer, {ViewerProps} from "./viewer/Viewer.tsx";

// import "./App.css"
import MobileDeviceBlocker from "./MobileDeviceBlocker.tsx";
import Warning from "./Warning.tsx";

export type AppProps = ViewerProps

export default function App(props: AppProps) {
    if (detectMobile()) {
        return <MobileDeviceBlocker/>
    }

    return <>
        <Warning
            title={"HIGH LOAD NOTICE"}
            messages={[
                `The site currently holds a lot of data.`,
                `When the page loads, NO countries are displayed on the map.`,
                `They appear after around a minute, depending on your connection.`,
                `I'm working on the issue, thanks for your patience.`]}
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
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}