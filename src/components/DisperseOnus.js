import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../css/main.css";

function DisperseOnus() {
    const [addresses, setAddresses] = useState([]);
    const [amounts, setAmounts] = useState([]);
    const [total, setTotal] = useState(0);
    const [onusAmount, setOnusAmount] = useState(0);
    const [txed, setTxed] = useState(undefined);
    const [exceed, setExceed] = useState(false);
    
    const GetBalance = async () => {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        let t = await new ethers.providers.Web3Provider(window.ethereum).getBalance(accounts[0]);
        setOnusAmount(ethers.utils.formatEther(t).slice(0, 10));
    }
    GetBalance();
    
    
    useEffect(() => {
        setInterval(() => {  
            GetBalance();
        }, 1000);
    }, []);

    const setData = (data) => {
        // console.log(data)
        data = data.split('\n');
        setAddresses([]);
        setAmounts([]);
        setTotal(0);
        setTxed(undefined);
        setExceed(false);
        for (let i = 0; i < data.length; i++) {
            if (data[i].split(',').length == 2) data[i] = data[i].split(',');
            else if (data[i].split('=').length == 2) data[i] = data[i].split('=');
            else if (data[i].split(' ').length == 2) data[i] = data[i].split(' ');
            if ((data[i].length) == 2 && data[i][1] !== '') {
                if (ethers.utils.isAddress(data[i][0]) && !isNaN(data[i][1])) {
                    setAddresses((addresses) => [...addresses, data[i][0]]);
                    setAmounts((amounts) => [...amounts, data[i][1]]);
                    // console.log(total,data[i][1])
                    setTotal((total) => total + parseFloat(data[i][1]));
                }
            }
        }

    }
    
    useEffect(() => {
        setExceed((total > onusAmount) ? true : false);
    }, [total, onusAmount]);

    let bill = (addresses.length != 0) ? (addresses.map((address, index) => {
        return (
            <h6 className="col-12"><span>{address.slice(0, 6) + "..." + address.slice(-6)}</span><span className="amount">{amounts[index]} Onus</span></h6>
        )
    })) : (undefined);
    // console.log(bill)
    let billData = <></>;
    if (bill != undefined) {
        billData = <>
            <h3 className="display-3"><i>Confirm</i></h3>
            <h6 className="col-12"><span><b>Address</b></span><span className="amount"><b>Amount</b></span></h6>
            <div className='row'>
                {bill}
                <hr></hr>
                <h6 className="col-12"><span>Total</span><span className="amount">{total} Onus</span></h6>
            </div>
        </>;
    }
    let tx = '';
    let disperse = async () => {
        let signerMetamask = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        let contract = new ethers.Contract('0xcC4042517863Bd7967B801200d26C15D0b19d920', [{ "type": "function", "stateMutability": "payable", "payable": true, "outputs": [], "name": "disperseOnus", "inputs": [{ "type": "address[]", "name": "recipients" }, { "type": "uint256[]", "name": "values" }], "constant": false }]);
        let amountsString = amounts.map((amount) => { return ethers.utils.parseEther(amount.toString()) });
        console.log(addresses, amountsString);
        tx = await contract.connect(signerMetamask).disperseOnus(addresses, amountsString, {
            value: ethers.utils.parseEther(total.toString())
        });
        document.getElementById('txhere2').innerHTML = 'Waiting for confirmation...';
        document.getElementById('disperseOnus').innerHTML = 'Loading';
        document.getElementById('disperseOnus').disabled = true;
        
        await tx.wait();
        document.getElementById('disperseOnus').innerHTML = 'Disperse';
        document.getElementById('disperseOnus').disabled = false;
        setTxed(tx);
    }



    return (
        <div>
            <h5 className="lead">You have <span className="bgcolor">{onusAmount}</span> Onus</h5>
            <br />
            <h5 className="">Enter one address and amount in Onus on each line. Supports any format.</h5>
            <textarea className="form-control small" id='data' rows="5" placeholder="0x4220...bc33999 1.23&#10;0x4220...bc33999,2&#10;0x4220...bc33999=0.123"
                onChange={(e) => setData(e.target.value)}
                // onBlur={(e) => setData(e.target.value)} 
                />
            <br />
            {billData}
            <button className="btn btn-primary" id='disperseOnus' onClick={disperse} disabled={total == 0 || exceed}>Disperse Onus</button>
            {exceed ? <h5 className="lead text-danger">You don't have enough Onus</h5> : <></>}
            <br />
            {txed != undefined ? <h5 className="lead text-success">Transaction: <a target="_blank" href={txed.chainId == 1945 ? 'https://explorer-testnet.onuschain.io/tx/' + txed.hash : 'https://explorer.onuschain.io/tx/' + txed.hash}>Here </a></h5> : <div id='txhere2'></div>}
        </div>
    )

} 

export default DisperseOnus;