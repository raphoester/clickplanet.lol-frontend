import Viewer from "./viewer/Viewer.tsx";
import Settings from "./Settings.tsx";
import CountryProvider from "./CountryProvider.tsx";

export default function AppV2() {
    return <>
        <CountryProvider>
            <Viewer/>
            <Settings/>
        </CountryProvider>
    </>
}