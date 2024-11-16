import {createRoot} from 'react-dom/client'
import './index.css'

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import App from "./app/App.tsx";
import {StrictMode} from "react";
import {ClickServiceClient, RegionsFetcher} from "./adapters/httpDataSources.ts";

const clickServiceClient = new ClickServiceClient({
    baseUrl: "http://localhost:8080",
    timeoutMs: 1000
})

const router = createBrowserRouter([{
    path: "",
    element: function () {
        return (
            <StrictMode>
                <App
                    gameMapProvider={new RegionsFetcher(clickServiceClient)}
                />
            </StrictMode>
        )
    }()
},])

createRoot(document.getElementById('root')!).render(<RouterProvider router={router}/>);
