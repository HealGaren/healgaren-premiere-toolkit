import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom/client";
import {evalTS, initBolt} from "../lib/utils/bolt";
import "./index.css";

import {MultiCam} from "./MultiCam";
import {VideoFilesProvider} from "./contexts/VideoFilesContext";
import {SequenceVO} from "../../shared/vo";

initBolt();

function Initializer() {
    const initializedRef = useRef(false);
    const [initializeResult, setInitializeResult] = useState<{activeSequence: SequenceVO | null}>();
    useEffect(() => {
        const initialize = async () => {
            if (initializedRef.current) return;
            initializedRef.current = true;
            const {activeSequence} = await evalTS('initialize');
            setInitializeResult({activeSequence});
        }
        initialize();
    }, []);

    if (!initializeResult) {
        return null;
    }
    return (
        <VideoFilesProvider>
            <MultiCam defaultActiveSequence={initializeResult.activeSequence} />
        </VideoFilesProvider>
    )

}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Initializer/>
    </React.StrictMode>
);
