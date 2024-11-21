import Viewer, {ViewerProps} from "./viewer/Viewer.tsx";
import Settings from "./Settings.tsx";
import CountryProvider from "./CountryProvider.tsx";

export type AppProps = ViewerProps

export default function App(props: AppProps) {
    return <>
        <CountryProvider>
            <Viewer
                tileClicker={props.tileClicker}
                ownershipsGetter={props.ownershipsGetter}
            />
            <Settings/>
        </CountryProvider>
    </>
}