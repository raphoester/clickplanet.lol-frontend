import Viewer, {ViewerProps} from "./viewer/Viewer.tsx";

// import "./App.css"
import MobileDeviceBlocker from "./MobileDeviceBlocker.tsx";

export type AppProps = ViewerProps

export default function App(props: AppProps) {
    if (detectMobile()) {
        return <MobileDeviceBlocker/>
    }

    return <>
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