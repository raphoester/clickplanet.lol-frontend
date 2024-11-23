import Viewer, {ViewerProps} from "./viewer/Viewer.tsx";

import "./App.css"

export type AppProps = ViewerProps

export default function App(props: AppProps) {
    return <>
        <Viewer
            tileClicker={props.tileClicker}
            ownershipsGetter={props.ownershipsGetter}
            updatesListener={props.updatesListener}
        />
    </>
}