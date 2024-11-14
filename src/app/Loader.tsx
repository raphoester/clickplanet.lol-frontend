import "./Loader.css"
import {useEffect, useState} from "react";

export default function Loader() {
    const [descriptor, setDescriptor] = useState("Generating map...")

    useEffect(() => {
        const descriptors = [
            "Generating map...",
            "This should take 30 seconds max",
            "Trust me bro I'm almost done",
            "Almost there...",
            "Just a few more seconds...",
            "Finishing up...",
            "tbf if you had a better laptop you wouldn't wait as much"
        ]

        const interval = setInterval(() => {
            setDescriptor(descriptors[Math.floor(Math.random() * descriptors.length)])
        }, 7_000);
        return () => clearInterval(interval)
    }, []);

    return <div className="loader-modal-background">
        <div className="loader-modal-card">
            <div className="loader-modal-header">
                <h3>Loading...</h3>
                <p>{descriptor}</p>
            </div>
            <div className="loader-modal-body">
                <div className="loader"></div>
            </div>
        </div>
    </div>
}


