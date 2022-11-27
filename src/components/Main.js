import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "./Header";
import ChangeNetwork from "./ChangeNetwork";
import "../css/main.css";
import ConnectWallet from "./ConnectWallet";



function DisperseOnus() {
    const [addresses, setAddresses] = useState([]);
    const [amounts, setAmounts] = useState([]);
    const [total, setTotal] = useState(0);
    const [onusAmount, setOnusAmount] = useState(0);

    const setData = (data) => {
        data = data.split('\n');
        setAddresses([]);
        setAmounts([]);
        setTotal(0);
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
    const GetBalance = async () => {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        let t = await new ethers.providers.Web3Provider(window.ethereum).getBalance(accounts[0]);
        setOnusAmount(ethers.utils.formatEther(t).slice(0, 10));
    }
    GetBalance();

    const bill = (addresses.length != 0) ? (addresses.map((address, index) => {
        return (
            <h6 className="col-12 col-md-5"><span>{address.slice(0, 6) + "..." + address.slice(-6)}</span><span className="amount">{amounts[index]} Onus</span></h6>
        )
    })) : (<></>);
    let billData = <></>;
    if (bill != <></>) {
        billData = <>
            <h3 className="display-3"><i>Confirm</i></h3>
            <h6 className="col-12 col-md-5"><span><b>Address</b></span><span className="amount"><b>Amount</b></span></h6>
            <div className='row'>
                {bill}
                <hr></hr>
                <h6 className="col-12 col-md-5"><span>Total</span><span className="amount">{total} Onus</span></h6>
            </div>
        </>;
    }
    let disperse = async () => {
        let signerMetamask = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        let contract = new ethers.Contract('0xcC4042517863Bd7967B801200d26C15D0b19d920', [{ "type": "function", "stateMutability": "payable", "payable": true, "outputs": [], "name": "disperseOnus", "inputs": [{ "type": "address[]", "name": "recipients" }, { "type": "uint256[]", "name": "values" }], "constant": false }]);
        let amountsString = amounts.map((amount) => { return ethers.utils.parseEther(amount.toString()) });
        console.log(addresses, amountsString);
        await contract.connect(signerMetamask).disperseOnus(addresses, amountsString, {
            value: ethers.utils.parseEther(total.toString())
        });
    }

    const exceed = (total > onusAmount) ? true : false;
    return (
        <div>
            <h5 className="lead">You have <span className="bgcolor">{onusAmount}</span> Onus</h5>
            <br />
            <h5 className="">Enter one address and amount in Onus on each line. Supports any format.</h5>
            <textarea className="form-control small" rows="5" placeholder="0x4220...bc33999 1.23&#10;0x4220...bc33999,2&#10;0x4220...bc33999=0.123"
                onChange={(e) => setData(e.target.value)}
                onBlur={(e) => setData(e.target.value)} />
            <br />
            {billData}
            <button className="btn btn-primary" onClick={disperse} disabled={total == 0 || exceed}>Disperse Onus</button>
            {exceed ? <h5 className="lead">You don't have enough Onus</h5> : <></>}
        </div>
    )

}

function DisperseToken() {
    const [addresses, setAddresses] = useState([]);
    const [amounts, setAmounts] = useState([]);
    const [total, setTotal] = useState(0);
    const [approved, setApproved] = useState(false);
    const [contractAddress, setContractAddress] = useState('');
}

function Main() {
    const [type, setType] = useState('Nothing');
    const [network, setNetwork] = useState('0x7b7');
    let next = <></>;
    if (type == 'Onus') {
        next = <DisperseOnus />;
    }
    else if (type == 'Token') {
        next = <DisperseToken />;
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