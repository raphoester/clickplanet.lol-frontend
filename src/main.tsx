// import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import AppTwo from "./AppV2.tsx";
import AppOne from "./AppV1.tsx";

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';


const router = createBrowserRouter([{
    path: "v1",
    element: <AppOne/>,
}, {
    path: "v2",
    element: <AppTwo/>
},])

createRoot(document.getElementById('root')!).render(<RouterProvider router={router}/>);
