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
    baseUrl: "https://clickplanet.lol",
    timeoutMs: 5000
})

const backend = new HTTPBackend(clickServiceClient, 100)
// const backend = new FakeBackend(500)

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
