import Viewer, {ViewerProps} from "./viewer/Viewer.tsx";

import Warning from "./Warning.tsx";

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