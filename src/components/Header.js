// import { ethers } from "ethers";
import { Navbar, NavbarBrand } from "reactstrap";
import Form from 'react-bootstrap/Form';
import onus from "../onus.png";
import "../css/main.css";
import ChangeNetwork from "./ChangeNetwork";

function Header({setNetwork}) {
    return (
        <Navbar dark expand="md" className="bg-light">
            <div className="container pt-3">
                <NavbarBrand className="mr-auto d-inline">
                    <img onClick={() => window.location.reload()} src={onus} witdh={50} height={50} alt="Onus icon" className="d-inline" style={{ marginBottom: '20px' }} />
                </NavbarBrand>
                <h1 className="d-inline display-4"  onClick={() => window.location.reload()}>Disperse</h1>
                <a className="telegram-button" style={{ float: "right", paddingBottom: "20px", marginTop: "20px" }} href="https://t.me/+09zR5soz3145NTA1" target="_blank">
                    <span>Disperse Onus</span>
                </a>
                <div className='row' >
                    <div className='col-12 col-md-4 col-lg-3' style={{marginLeft:'0px'}}>
                        <Form.Select labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={age}
                            title='Select Network'
                            label="Age"
                            onChange={async (e) => {await ChangeNetwork(e.target.value); setNetwork(e.target.value)}}
                        >
                            <option value="0x7b7">OnusChain Mainnet</option>
                            <option value="0x799">OnusChain Testnet</option>
                        </Form.Select>
                    </div>
                </div>
            </div>
        </Navbar >);
}

export default Header;