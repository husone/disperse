// import { ethers } from "ethers";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import onus from "../onus.png";
import "../css/main.css";
function Header() {
    return (
        <Navbar dark expand="md" className="bg-light">
            <div className="container pt-3">
                <NavbarBrand className="mr-auto d-inline">
                    <img src={onus} witdh={50} height={50} alt="Onus icon" className="d-inline" style={{ marginBottom: '20px' }} />
                </NavbarBrand>
                <h1 className="d-inline display-4">Disperse</h1>
                <a className="telegram-button"  style={{float:"right",paddingBottom:"20px", marginTop:"20px"}} href="https://t.me/+09zR5soz3145NTA1" target="_blank">
    <i></i>
    <span>Disperse Onus</span>
</a>

            </div>
        </Navbar >);
}

export default Header;