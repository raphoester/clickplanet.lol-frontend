import Viewer, {ViewerProps} from "./viewer/Viewer.tsx";

import Warning from "./Warning.tsx";

export type AppProps = ViewerProps

export default function App(props: AppProps) {

    return <>
        {detectMobile() && <Warning
            title={"MOBILE VERSION WARNING"}
            messages={[
                `This site has been designed and is optimized for computers.`,
                `The mobile version is being implemented, but it is not finished yet. 
                You are free to use it, but it may not work as expected.`,
                `In particular, the initial loading of the map might take a while, and contain a lot of glitches.`,
                `The leaderboard is also pretty ugly and takes too much space.`,
                `Thanks for your understanding.`
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
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}