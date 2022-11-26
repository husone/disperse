
const ChangeNetwork = async (ID) => {
    const chainID = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainID !== ID)
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ID }],
            });
            
        } catch (error) {
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: ID,
                                rpcUrl: ID == '0x7b7' ? 'https://rpc.onuschain.io/' : 'https://rpc-testnet.onuschain.io/',
                                chainName: ID == '0x7b7' ? 'Onuschain Mainnet' : 'Onuschain Testnet',
                            },
                        ],
                    });
                } catch (addError) {
                    console.error(addError);
                }
            }
        }
}

export default ChangeNetwork;