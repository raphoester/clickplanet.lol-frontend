import Viewer, {ViewerProps} from "./viewer/Viewer.tsx";
import OnLoadModal from "./components/OnLoadModal.tsx";
import BuyMeACoffee from "./components/BuyMeACoffee.tsx";

export type AppProps = ViewerProps

export default function App(props: AppProps) {
    return <>
        {Math.random() > 0.5 &&
            <OnLoadModal
                title={"Dear earthlings"}
                children={<>
                    <div className="center-align">
                        <img alt="ClickPlanet logo"
                            src="/static/logo.svg"
                            width="64px"
                            height="auto"/>
                    </div>
                    <div className="modal-onload-text">
                        <h3>Do you like ClickPlanet ?</h3>
                        <p>It's free and open-source 🤗</p>
                        <p>Sadly, the servers are expensive to run 😭</p>
                        <p>Every contribution helps us keep this awesome platform running!</p>
                    </div>
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
