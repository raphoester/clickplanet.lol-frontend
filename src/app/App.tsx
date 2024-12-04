import Viewer, {ViewerProps} from "./viewer/Viewer.tsx";

import OnLoadModal from "./components/OnLoadModal.tsx";
import BuyMeACoffee from "./components/BuyMeACoffee.tsx";

export type AppProps = ViewerProps

export default function App(props: AppProps) {
    return <>
        {Math.random() > 0.5 &&
            <OnLoadModal
                title={"Hey there!"}
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
        }
        <Viewer
            tileClicker={props.tileClicker}
            ownershipsGetter={props.ownershipsGetter}
            updatesListener={props.updatesListener}
        />
    </>
}
