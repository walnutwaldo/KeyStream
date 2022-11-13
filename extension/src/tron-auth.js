import styles from "./tron-auth-module.css";
import {useState} from 'react';





const TronLinkConnect = () => {

    const TronWeb = require('tronweb');
    //const express = require('express')
    //var bodyParser = require('body-parser')
    //const app = express()
    
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: false }));
    // app.set('view engine', 'ejs');
    // app.use("/source",express.static(__dirname + "/source"));
    
    // app.get('/', function (req, res) {
    //     res.render("Index");
    // });
    
    const fullNode = "https://api.shasta.trongrid.io"
    const solidityNode = "https://api.shasta.trongrid.io";
    const eventServer = "https://api.shasta.trongrid.io";
    
        
    //let contractAddress = '' //Enter Your Smart Contract Address
    let abi = [{"constant":false,"inputs":[{"name":"value","type":"string"}],"name":"postMessage","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMessage","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]
    
    //let instance = tronWeb.contract(abi, contractAddress);

    
    const [userInfo, setUserInfo] = useState({
        privateKey: "",
        address: ""
    });

    const [hasSubmitted, setHasSubmitted] = useState(false)

    const handleChange = (event) => {
        setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
    };

    const handleSubmit = () => {
        const privateKey = userInfo.privateKey
        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
        tronWeb.setAddress(userInfo.address);
        console.log(userInfo.address);
        setHasSubmitted(true)
    };
    


  return hasSubmitted ? (
    <div>
        Connected to {userInfo.address.substring(0, 3) + "..."}
    </div>
  ) : (
    <div>
        <form>
            <label> Private Key
            <input
            className = "input-field"
            type="password"
            name="privateKey"
            placeholder="****"
            value={userInfo.privateKey}
            onChange = {handleChange}
            />
            </label>
            <label> Wallet Address
            <input
            className = "input-field"
            type="text"
            name="address"
            placeholder="0x..."
            value={userInfo.address}
            onChange={handleChange}
            />
            </label>
            <button type="submit" onClick = {handleSubmit}>Submit</button>
        </form>
    </div>
  )
}

export default TronLinkConnect