import {useState} from "react";
import {evalTS} from "../lib/utils/bolt";

const MultiCam = () => {
    const [rs, setRS] = useState<unknown>({});

    const handleClick = async () => {
        const rs = await evalTS('importAndInsertCameraVideos', '3c3d46cb-773d-4d6f-9f68-76c7c8d9dd4f', '1-MAIN', 1)
        setRS(rs);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <h1 style={{ color: "#ff5b3b" }}>Welcome to Bolt CEP! (MultiCam)</h1>
            <button onClick={handleClick}>open</button>
            <pre>{JSON.stringify(rs, null, 2)}</pre>
        </div>
    );
};
export default MultiCam;