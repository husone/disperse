import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "./Header";
import "../css/main.css";
import ConnectWallet from "./ConnectWallet";
import DisperseOnus from "./DisperseOnus";
import SetToken from "./DisperseToken";




function Main() {
    const [type, setType] = useState('Nothing');
    const [network, setNetwork] = useState('0x7b7');

    useEffect(() => {
        const checkNetwork = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await provider.getNetwork();
            setNetwork(network.chainId);
        }
        checkNetwork();
        // console.log(network);
    }, [window.ethereum]);

    let next = <></>;
    if (type == 'Onus') {
        next = <DisperseOnus />;
    }
    else if (type == 'Token') {
        next = <SetToken />;
    }
    else next = <></>;
    return (
        <div className="container">
            <Header setNetwork={setNetwork} />
            <div className="container-fluid">
                <ConnectWallet setType={setType} />
                {next}
            </div>
        </div>
    );
}

export default Main;