import styles from "./tron-auth-module.css";
import {useEffect, useState} from 'react';
import {CustomButton} from "./components/CustomButton";

const TronWeb = require('tronweb');


export default function TronLinkConnect() {
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

    const [tronWeb, setTronWeb] = useState(window.tronWeb);
    const [tronWebLoaded, setTronWebLoaded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (
                window.tronWeb &&
                typeof window.tronWeb.defaultAddress.base58 == 'string' &&
                !tronWebLoaded
            ) {
                setTronWeb(window.tronWeb);
                setTronWebLoaded(true);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    //let contractAddress = '' //Enter Your Smart Contract Address

    // TODO: Load from KeyStreamABI.json
    let abi = [{
        "constant": false,
        "inputs": [{"name": "value", "type": "string"}],
        "name": "postMessage",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getMessage",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }]

    return tronWeb ? (
        <div className={"text-sm"}>
            Connected to {tronWeb.defaultAddress.base58.toString()}
        </div>
    ) : (
        <div>
            Please install TronLink
        </div>
    )
}