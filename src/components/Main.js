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
    console.log("disperse onus");

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
                    console.log('wallet')
                    console.log(data[i][0], data[i][1]);
                }
            }
        }
        // addresses.forEach(element => {
        //     console.log('wallets',element);
        // });
    }
    const GetBalance = async () => {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        console.log(accounts[0]);
        let t = await new ethers.providers.Web3Provider(window.ethereum).getBalance(accounts[0]);
        console.log('here');
        setOnusAmount(ethers.utils.formatEther(t).slice(0, 10));
    }
    GetBalance();
    const bill = () => {
        return addresses.map((address, index) => {
            console.log('here', address, amounts[index]);
            return (
                <div className="bill d-inline">
                    <div className="bill__address">{address}</div>
                    <div className="bill__amount">{amounts[index]} Onus</div>
                </div>

            )
        })
    }

    return (
        <div>
            <h5 className="lead">You have <span className="bgcolor">{onusAmount}</span> Onus</h5>
            <br />
            <h5 className="">Enter one address and amount in Onus on each line. Supports any format.</h5>
            <textarea className="form-control small" rows="5" placeholder="0x42204448154CBC4E4d9e74aB08fd2A66dbc33999 1.23&#10;0x42204448154CBC4E4d9e74aB08fd2A66dbc33999,2&#10;0x42204448154CBC4E4d9e74aB08fd2A66dbc33999=0.123"
                onChange={(e) => setData(e.target.value)} />
            {bill}
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