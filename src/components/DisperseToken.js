import React, { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";

function SetToken() {
    const [contractAddress, setContractAddress] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState('');

    const setContract = async (address) => {
        setIsValid(false);
        setContractAddress('');
        setError('');
        if (ethers.utils.isAddress(address)) {
            let contract = new ethers.Contract(address, ['function symbol() public view returns (string)',
                'function decimals() public view returns (uint8)',
                'function balanceOf(address _owner) public view returns (uint256 balance)',
                'function approve(address _spender, uint256 _value) public returns (bool success)',
                'function allowance(address _owner, address _spender) public view returns (uint256 remaining)'
            ], new ethers.providers.Web3Provider(window.ethereum));
            try {
                if (await contract.symbol() != '') {
                    setContractAddress(address);
                    setIsValid(true);
                }
            } catch (error) {
                setError('Invalid contract address');
            }
        }
        else {
            setError('Contract address not found');
        }
    }

    return (
        <>
            <input type="text" className="form-control" placeholder="Paste contract address here" onBlur={(e) => setContract(e.target.value)} onChange={(e) => { setContract(e.target.value) }}></input>
            {isValid ? <DisperseToken contractAddress={contractAddress} /> : <></>}
            {error != '' ? <div className="alert alert-danger" role="alert">{error}</div> : <></>}
        </>
    )

}

function DisperseToken({ contractAddress }) {
    const [addresses, setAddresses] = useState([]);
    const [amounts, setAmounts] = useState([]);
    const [total, setTotal] = useState(0);
    const [txed, setTxed] = useState(undefined);
    const [exceed, setExceed] = useState(false);
    const [exceedAllowance, setExceedAllowance] = useState(false);
    const [allowance, setAllowance] = useState(0);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [tokenDecimals, setTokenDecimals] = useState(0);
    const [tokenSymbol, setTokenSymbol] = useState('');
    const contract = new ethers.Contract(contractAddress, ['function symbol() public view returns (string)',
        'function decimals() public view returns (uint8)',
        'function balanceOf(address _owner) public view returns (uint256 balance)',
        'function approve(address _spender, uint256 _value) public returns (bool success)',
        'function allowance(address _owner, address _spender) public view returns (uint256 remaining)'
    ], new ethers.providers.Web3Provider(window.ethereum).getSigner());

    const approve = async () => {
        document.getElementById('approve').innerHTML = 'Loading';
        document.getElementById('approve').disabled = true;
        try {
        let tx = await contract.approve('0xcC4042517863Bd7967B801200d26C15D0b19d920', ethers.constants.MaxUint256);
        await tx.wait();
        document.getElementById('approve').innerHTML = 'Approve';
        document.getElementById('approve').disabled = false;
        setAllowance(ethers.constants.MaxUint256);
        } catch (error) {
        document.getElementById('approve').innerHTML = 'Approve';
        document.getElementById('approve').disabled = false;
        }
    }

    const getData = async () => {
        setTokenDecimals(await contract.decimals());
        setTokenSymbol(await contract.symbol());
        let accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        let balance = await contract.balanceOf(accounts[0]);
        setAllowance(await contract.allowance(accounts[0], '0xcC4042517863Bd7967B801200d26C15D0b19d920'));
        return ethers.utils.formatUnits(balance, tokenDecimals).slice(0, 13);
    }

    const GetBalance = async () => {
        let balance = await getData();
        // console.log(balance)
        setTokenDecimals(await contract.decimals());
        setTokenSymbol(await contract.symbol());
        setTokenAmount(balance);
    }
    GetBalance();


    // useEffect(() => {
    //     setInterval(async () => {
    //         GetBalance();
    //     }, 1000);
    // }, []);

    const setData = (data) => {
        data = data.split('\n');
        setAddresses([]);
        setAmounts([]);
        setTotal(0);
        setTxed(undefined);
        for (let i = 0; i < data.length; i++) {
            if (data[i].split(',').length == 2) data[i] = data[i].split(',');
            else if (data[i].split('=').length == 2) data[i] = data[i].split('=');
            else if (data[i].split(' ').length == 2) data[i] = data[i].split(' ');
            if ((data[i].length) == 2 && data[i][1] !== '') {
                if (ethers.utils.isAddress(data[i][0]) && !isNaN(data[i][1])) {
                    setAddresses((addresses) => [...addresses, data[i][0]]);
                    setAmounts((amounts) => [...amounts, data[i][1]]);
                    setTotal((total) => total + parseFloat(data[i][1]));
                }
            }
        }
        console.log(addresses)
    }

    useEffect(() => {
        setExceed((total > tokenAmount) ? true : false);
    }, [total, tokenAmount]);

    useEffect(() => {
        let totalBig = ethers.utils.parseUnits(total.toString(), tokenDecimals)
        setExceedAllowance((totalBig.gt(allowance)));
    }, [total, allowance]);

    let bill = (addresses.length != 0) ? (addresses.map((address, index) => {
        return (
            <h6 className="col-12"><span>{address.slice(0, 6) + "..." + address.slice(-6)}</span><span className="amount">{amounts[index]} {tokenSymbol}</span></h6>
        )
    })) : (undefined);
    let billData = <></>;
    if (bill != undefined) {
        billData = <>
            <h3 className="display-3"><i>Confirm</i></h3>
            <h6 className="col-12"><span><b>Address</b></span><span className="amount"><b>Amount</b></span></h6>
            <div className='row'>
                {bill}
                <hr></hr>
                <h6 className="col-12"><span>Total</span><span className="amount">{total} {tokenSymbol}</span></h6>
            </div>
        </>;
    }
    let tx = '';
    let disperse = async () => {
        document.getElementById('disperseToken').innerHTML = 'Loading';
        document.getElementById('disperseToken').disabled = true;
        let signerMetamask = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        let contract = new ethers.Contract('0xcC4042517863Bd7967B801200d26C15D0b19d920', [{
            "constant": false,
            "inputs": [
                {
                    "name": "token",
                    "type": "address"
                },
                {
                    "name": "recipients",
                    "type": "address[]"
                },
                {
                    "name": "values",
                    "type": "uint256[]"
                }
            ],
            "name": "disperseToken",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }], signerMetamask);
        let amountsString = (amounts.map((amount) => ethers.utils.parseUnits(amount, tokenDecimals)));
        try {
            let tx = await contract.disperseToken(contractAddress, addresses, amountsString);
            document.getElementById('txhere').innerHTML = 'Waiting for confirmation...';
            await tx.wait();
            document.getElementById('disperseToken').innerHTML = 'Disperse';
            document.getElementById('disperseToken').disabled = false;        
            setTxed(tx);
            console.log(txed);
        } catch (error) {
            document.getElementById('disperseToken').innerHTML = 'Disperse';
            document.getElementById('disperseToken').disabled = false;
        }

    }

    return (
        <>
            <div className="" >You have <span className="bgcolor">{tokenAmount}</span> {tokenSymbol}</div>
            <br />
            <h5 className="">Enter one address and amount in {tokenSymbol} on each line. Supports any format.</h5>
            <textarea className="form-control small" id='data' rows="5" placeholder="0x4220...bc33999 1.23&#10;0x4220...bc33999,2&#10;0x4220...bc33999=0.123"
                onChange={(e) => setData(e.target.value)}
            // onBlur={(e) => setData(e.target.value)} 
            />
            <br />
            {billData}
            <div className="row">
                <button className="col-5 col-md-3 btn btn-warning" id='approve' onClick={approve} disabled={!exceedAllowance || total == 0}>Approve</button>
                <button className="btn btn-primary col-5 col-md-3 offset-1 offset-md-1" id='disperseToken' onClick={disperse} disabled={total == 0 || exceed || exceedAllowance}>Disperse {tokenSymbol}</button>
                {exceed ? <h5 className="lead text-danger">You don't have enough {tokenSymbol}</h5> : <></>}
            </div>
            <br />
            {txed != undefined ? <h5 className="lead text-success">Transaction: <a target="_blank" href={txed.chainId == 1945 ? 'https://explorer-testnet.onuschain.io/tx/' + txed.hash : 'https://explorer.onuschain.io/tx/' + txed.hash}>Here </a></h5> : <div id='txhere'></div>}
        </>)
}

export default SetToken;