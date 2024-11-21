import {createRoot} from 'react-dom/client'
import './index.css'

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import App from "./app/App.tsx";
import {StrictMode} from "react";
import {ClickServiceClient, HTTPBackend} from "./backends/httpBackend.ts";
import AppV2 from "./appV2/AppV2.tsx";

const clickServiceClient = new ClickServiceClient({
    baseUrl: "http://localhost:8080",
    timeoutMs: 1000
})

const backend = new HTTPBackend(clickServiceClient)

const router = createBrowserRouter([{
    path: "",
    element: function () {
        return (
            <StrictMode>
                <App
                    ownershipsGetter={backend}
                    gameMapProvider={backend}
                    tileClicker={backend}
                />
            </StrictMode>
        )
    }()
}, {
    path: "v2", element: <AppV2
        ownershipsGetter={backend}
        tileClicker={backend}
    />
}])

createRoot(document.getElementById('root')!).render(<RouterProvider router={router}/>);
