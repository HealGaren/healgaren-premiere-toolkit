import {useEffect, useState} from "react";
import {evalTS} from "../lib/utils/bolt";

const Main = () => {

    const [message, setMessage] = useState<string>('');

    const handleClickMain = () => {
        evalTS('main').then(result => {
            setMessage(`result: ${result}`)
        });
    };

    console.log(message);

  return (
    <div>
      <h1 style={{ color: "#ff5b3b" }}>Welcome to Bolt CEP! message: {message}</h1>
        <button onClick={handleClickMain}>evalTs('main')</button>
    </div>
  );
};
export default Main;