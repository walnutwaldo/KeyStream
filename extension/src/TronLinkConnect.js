import styles from "./tron-auth-module.css";
import {useEffect, useState} from 'react';
import {CustomButton} from "./components/CustomButton";

const TronWeb = require('tronweb');

function getTronWeb() {
    const fullNode = "https://api.shasta.trongrid.io"
    const solidityNode = "https://api.shasta.trongrid.io";
    const eventServer = "https://api.shasta.trongrid.io";

    return new TronWeb(fullNode, solidityNode, eventServer, process.env.REACT_APP_SECRET_KEY);
}

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

    const [tronWeb, setTronWeb] = useState(window.tronWeb);
    const [tronWebLoaded, setTronWebLoaded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const tw = getTronWeb();

            if (
                tw &&
                typeof tw.defaultAddress.base58 == 'string' &&
                !tronWebLoaded
            ) {
                setTronWeb(tw);
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
            <span className={"font-semibold"}>Connected</span> ({tronWeb.defaultAddress.base58.toString()})
        </div>
    ) : (
        <div>
            Please install TronLink
        </div>
    )
}