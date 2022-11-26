import React, { useState } from "react";
import Headers from "./Header";

function Main() {
    const [type, setType] = useState('');
    // setType(type+"hehe");
    return (
        <div>
            <Headers />
            {/* <h1>Hi</h1> */}
        </div>
    );
}

export default Main;