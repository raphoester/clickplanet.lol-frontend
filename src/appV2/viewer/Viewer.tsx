import {useEffect} from 'react';
import {effect} from "./effect.ts";

export default function Viewer() {
    useEffect(() => {
        return effect()
    }, []);

    return <div id="three-container" style={{width: '100vw', height: '100vh'}}/>;
};