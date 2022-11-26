import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function ConnectWallet({ setType }) {
    const [haveMetamask, sethaveMetamask] = useState(false);
    const [accountAddress, setAccountAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [active1, setActive1] = useState(false);
    const [active2, setActive2] = useState(false);

    const { ethereum } = window;
    let provider;

    useEffect(() => {
        const { ethereum } = window;
        const checkMetamaskAvailability = async () => {
            if (!ethereum) {
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
            if (!ethereum) {
                sethaveMetamask(false);
            }
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            const chainID = await ethereum.request({ method: 'eth_chainId' });
            if (chainID !== '0x7b7')
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x7b7' }],
                    });
                } catch (error) {
                    if (error.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x7b7',
                                        rpcUrl: 'https://rpc.onuschain.io/',
                                        chainName: 'Onus Chain Mainnet',


                                    },
                                ],
                            });
                        } catch (addError) {
                            console.error(addError);
                        }
                    }
                }
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
                                    <h3 className="display-5"><i>Wallet Address:</i></h3>
                                    <p className="lead">
                                        {accountAddress.slice(0, 4) + "..." + accountAddress.slice(-4)}
                                    </p>
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