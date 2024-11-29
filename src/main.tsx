import {createRoot} from 'react-dom/client'
import './index.css'

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import {StrictMode} from "react";
import {ClickServiceClient, HTTPBackend} from "./backends/httpBackend.ts";
import App from "./app/App.tsx";

const clickServiceClient = new ClickServiceClient({
    baseUrl: "",
    // baseUrl: "https://clickplanet.lol",
    timeoutMs: 1000
})

const backend = new HTTPBackend(clickServiceClient)
// const backend = new FakeBackend()

const router = createBrowserRouter([{
    path: "",
    element: function () {
        return (
            <StrictMode>
                <App
                    ownershipsGetter={backend}
                    tileClicker={backend}
                    updatesListener={backend}
                />
            </StrictMode>
        )
    }()
}])

createRoot(document.getElementById('root')!).render(<RouterProvider router={router}/>);
