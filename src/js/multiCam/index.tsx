import React from "react";
import ReactDOM from "react-dom/client";
import {initBolt, listenTS} from "../lib/utils/bolt";


import MultiCam from "./MultiCam";

initBolt();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MultiCam />
    </React.StrictMode>
);
