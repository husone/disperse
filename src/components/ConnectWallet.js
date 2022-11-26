import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function ConnectWallet({ setType }) {
    const [haveMetamask, sethaveMetamask] = useState(false);
    const [accountAddress, setAccountAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [active1, setActive1] = useState(false);
    const [active2, setActive2] = useState(false);
    useEffect(() => {
        const checkMetamaskAvailability = async () => {
            if (!window.ethereum) {
                sethaveMetamask(false);
                console.log('no metamask');
            }
            sethaveMetamask(true);
        };
        checkMetamaskAvailability();
    }, []);

    const connectWallet = async () => {
        try {
            console.log("Have metamask:", haveMetamask)
            if (!window.ethereum) {
                sethaveMetamask(false);
            }
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            setAccountAddress(accounts[0]);
            setIsConnected(true);
        } catch (error) {
            setIsConnected(false);
        }
    };

    return (
        <div className="mt-5" >
            <div>
                {haveMetamask ? (
                    <div>
                        {isConnected ? (
                            <div>
                                <div>
                                    <h3 className="display-5"><i>Wallet Address:</i> <span className="lead">{accountAddress.slice(0, 4) + "..." + accountAddress.slice(-4)}</span></h3>
                                    <br />
                                    <h4>Send <a onClick={() => {setType('Onus'); setActive1(true); setActive2(false)}} href={'#'} className={active1? 'bgcolor': ''} style={{color:'inherit'}}>Onus</a> or <a onClick={() => {setType('Token'); setActive1(false); setActive2(true)}} href={'#'} className={active2? 'bgcolor': ''} style={{color:'inherit'}}>Token</a></h4>
                                    
                                </div>
                            </div>
                        ) : (
                            <h3 className="display-5"><i>Connect Wallet</i></h3>
                        )}
                        {isConnected ? (<></>) : (
                            <button className="btn btn-primary lead" onClick={connectWallet}>
                                Connect
                            </button>
                        )}
                    </div>
                ) : (<div>
                    <h2 className="display-3"><i>Metamask required</i></h2>
                    <h3 className="lead">Non-ethereum browser, consider installing metamask.</h3>
                </div>
                )}
            </div>
        </div>
    );
}

export default ConnectWallet;