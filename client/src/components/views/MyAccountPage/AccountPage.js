import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from "react-redux";
import Web3 from 'web3';

const { Title } = Typography;
const { TextArea } = Input;

const Private = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const Catogory = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
]

function UploadVideoPage(props) {
    const user = useSelector(state => state.user);

    const [title, setTitle] = useState("");
    const [fee, setfee] = useState("");
    const [withdraw_amount, set_withdraw_amount] = useState("");
    const [Description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState(0)
    const [Categories, setCategories] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [Thumbnail, setThumbnail] = useState("")


    const handleChangeTitle = (event) => {
        setTitle(event.currentTarget.value)
    }
    const handleChangeFee = (event) => {
        setfee(event.currentTarget.value)
    }
    const handleChangeWithdraw = (event) => {
        set_withdraw_amount(event.currentTarget.value)
    }

    const handleChangeDecsription = (event) => {
        console.log(event.currentTarget.value)

        setDescription(event.currentTarget.value)
    }

    const handleChangeOne = (event) => {
        setPrivacy(event.currentTarget.value)
    }

    const handleChangeTwo = (event) => {
        setCategories(event.currentTarget.value)
    }
    let web3;

    const contractABI = [{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"Users","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideoBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideoFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideosOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"}],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"}],"name":"getVideoFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"address","name":"accID","type":"address"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"user","type":"address"},{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"updateBalance","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"accID","type":"address"}],"name":"viewBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"address","name":"accID","type":"address"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"viewVideo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
    const contractAdress = '0x11A151Bee66949c0AF71e5D66eDC9A34221a27ba';

    const onSubmit = async (event) => {
        if(typeof window !== 'undefined' && typeof window.ethereum !== "undefined"){
            window.ethereum.request ({method: "eth_requestAccounts"})
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            console.log(accounts)
            var vendingMachineContract = new web3.eth.Contract(contractABI,contractAdress);
            try {
               //const balance = await vendingMachineContract.methods.Users(accounts[0]).call();
               const balance = await web3.eth.getBalance(accounts[0]);
               console.log(balance);
              console.log(fee);

            await vendingMachineContract.methods.updateBalance(fee).send({
            from: accounts[0],
            value: fee 
        })
            
            // alert("cool");
            console.log(accounts[0]);
            }
            catch(err){
              console.log(err.message);
            }
            
    
          }else {
            alert("Please install Metamasak.")
    
          }
        
    }

    const onSubmit2 = async (event) => {
        if(typeof window !== 'undefined' && typeof window.ethereum !== "undefined"){
            window.ethereum.request ({method: "eth_requestAccounts"})
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            console.log(accounts)
            var vendingMachineContract = new web3.eth.Contract(contractABI,contractAdress);
            try {
               //const balance = await vendingMachineContract.methods.Users(accounts[0]).call();
               const balance = await web3.eth.getBalance(accounts[0]);
               console.log(balance);
              console.log(withdraw_amount);

            await vendingMachineContract.methods.transfer(accounts[0],"6317865a429c0111a0c8bc95",withdraw_amount).send({
            from: accounts[0]
        })
            
            // alert("cool");
            console.log(accounts[0]);
            }
            catch(err){
              console.log(err.message);
            }
            
    
          }else {
            alert("Please install Metamasak.")
    
          }
        
    }

    

    const onDrop = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        console.log(files)
        formData.append("file", files[0])

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {

                    let variable = {
                        filePath: response.data.filePath,
                        fileName: response.data.fileName
                    }
                    setFilePath(response.data.filePath)

                    //gerenate thumbnail with this filepath ! 

                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration)
                                setThumbnail(response.data.thumbsFilePath)
                            } else {
                                alert('Failed to make the thumbnails');
                            }
                        })


                } else {
                    alert('failed to save the video in server')
                }
            })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > My Account Page</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <br /><br />
                <label>Amount</label>
                <Input
                    onChange={handleChangeFee}
                    value={fee}
                />
                {/* <br /><br />
                <label>Description</label>
                <TextArea
                    onChange={handleChangeDecsription}
                    value={Description}
                /> */}
                    <br /><br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Deposit
            </Button>

            </Form>
            <Form onSubmit={onSubmit2}>
                <br /><br />
                <label>Amount</label>
                <Input
                    onChange={handleChangeWithdraw}
                    value={withdraw_amount}
                />
                {/* <br /><br />
                <label>Description</label>
                <TextArea
                    onChange={handleChangeDecsription}
                    value={Description}
                /> */}
                    <br /><br />
                <Button type="primary" size="large" onClick={onSubmit2}>
                    Withdraw
            </Button>

            </Form>
        </div>
    )
}

export default UploadVideoPage
