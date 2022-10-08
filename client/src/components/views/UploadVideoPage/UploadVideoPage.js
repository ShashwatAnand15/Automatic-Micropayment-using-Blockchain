import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from "react-redux";
import Web3 from 'web3';

var Tx = require('ethereumjs-tx').Transaction;
const web3 = new Web3('https://rinkeby.infura.io/v3/76b7b7167d264867ba89838651fcd298');

const account1 = '0x250c444e1E2c1ad52Ead27f31a740ceA007980c5';
const privateKey1 =  'f28b4c70b2b7b2d65f4ceacbc300f793f345acb12c0b9e65820da2a52ce0cad9';

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

    const onSubmit = (event) => {

        event.preventDefault();

        // if (user.userData && !user.userData.isAuth) {
        //     return alert('Please Log in First')
        // }

        if (title === "" || Description === "" ||
            Categories === "" || FilePath === "" ||
            Duration === "" || Thumbnail === "") {
            return alert('Please first fill all the fields')
        }

        const variables = {
            writer: user.userData._id,
            title: title,
            description: Description,
            privacy: privacy,
            filePath: FilePath,
            category: Categories,
            duration: Duration,
            thumbnail: Thumbnail
        }

        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.vidId);
                    // web3 code to set the data
                    // // web3 code for the transaction of automatic payment.

                    const contractABI = [{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"Users","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideoBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideoFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideosOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"}],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"}],"name":"getVideoFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"address","name":"accID","type":"address"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"user","type":"address"},{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"updateBalance","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"accID","type":"address"}],"name":"viewBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"address","name":"accID","type":"address"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"viewVideo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
                    const contractAdress = '0x11A151Bee66949c0AF71e5D66eDC9A34221a27ba'
                
                    var EduPlatform = new web3.eth.Contract(contractABI,contractAdress);
                    const data = EduPlatform.methods.setOwner(response.data.vidId,account1,fee).encodeABI();

                        //Build the Transaction
                    const txObject = {
                        gasLimit: web3.utils.toHex(260000),
                        gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
                        to: contractAdress,
                        data: data
                    }

                    // Sign the transaction
                    const signedTransaction = web3.eth.accounts.signTransaction(txObject, privateKey1);

                    //Broadcast the transaction
                    signedTransaction.then(signedTx => {

                        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                    
                        sentTx.on("receipt", receipt => {
                            console.log("receipt: ", receipt);
                            });
                    
                        sentTx.on("error", err => {
                            console.log(err.message)
                        });
                    
                    })

                                alert('video Uploaded Successfully')
                                props.history.push('/')
                            } else {
                                alert('Failed to upload video')
                            }
                        })

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
                <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>

                    {Thumbnail !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
                        </div>
                    }
                </div>

                <br /><br />
                <label>Title</label>
                <Input
                    onChange={handleChangeTitle}
                    value={title}
                />
                <br /><br />
                <label>Fee </label>
                <Input
                    onChange={handleChangeFee}
                    value={fee}
                />
                <br /><br />
                <label>Description</label>
                <TextArea
                    onChange={handleChangeDecsription}
                    value={Description}
                />
                <br /><br />

                <select onChange={handleChangeOne}>
                    {Private.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br /><br />

                <select onChange={handleChangeTwo}>
                    {Catogory.map((item, index) => (
                        <option key={index} value={item.label}>{item.label}</option>
                    ))}
                </select>
                <br /><br />

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
            </Button>

            </Form>
        </div>
    )
}

export default UploadVideoPage
