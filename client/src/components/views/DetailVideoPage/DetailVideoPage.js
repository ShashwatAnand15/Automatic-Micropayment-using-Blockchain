import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber';
import Comments from './Sections/Comments'
import LikeDislikes from './Sections/LikeDislikes';
import Web3 from 'web3';

var Tx = require('ethereumjs-tx').Transaction;

const web3 = new Web3('https://rinkeby.infura.io/v3/76b7b7167d264867ba89838651fcd298');
const account1 = '0x250c444e1E2c1ad52Ead27f31a740ceA007980c5';
const privateKey1 =  'f28b4c70b2b7b2d65f4ceacbc300f793f345acb12c0b9e65820da2a52ce0cad9';

function DetailVideoPage(props) {
    const videoId = props.match.params.videoId
    const [Video, setVideo] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const videoVariable = {
        videoId: videoId
    }
    
    

    useEffect(async () => {
        // // web3 code for the transaction of automatic payment.
        const contractABI = [{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"Users","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideoBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideoFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideosOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"}],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"}],"name":"getVideoFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"address","name":"accID","type":"address"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"user","type":"address"},{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"updateBalance","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"accID","type":"address"}],"name":"viewBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"address","name":"accID","type":"address"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"viewVideo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
        const contractAdress = '0x11A151Bee66949c0AF71e5D66eDC9A34221a27ba'
        
        var EduPlatform = new web3.eth.Contract(contractABI,contractAdress);

         //Smart contract data
         let web32;
         web32 = new Web3(window.ethereum);
         const accounts = await web32.eth.getAccounts();
         console.log("We will accessing address");
         console.log(accounts[0]);
         var EduPlatform2 = new web32.eth.Contract(contractABI,contractAdress);

        console.log(videoId);
        let fee;
         fee = await EduPlatform2.methods.VideoFee(videoId).call();
        var balance = await EduPlatform.methods.Users(accounts[0]).call();

        console.log(fee);
        console.log(balance);
        if(balance < 10 || balance < 25){
            alert("Low Balance in Account. Please Add Balance!!!");
            window.location.href = "http://localhost:3000/account";
        }
        else {
            const data = EduPlatform.methods.transfer(accounts[0],videoId,fee).encodeABI();


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
        
        }
        

        console.log("web3 function can be made here");
        

        axios.post('/api/video/getVideo', videoVariable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.video)
                    setVideo(response.data.video)
                } else {
                    alert('Failed to get video Info')
                }
            })

        axios.post('/api/comment/getComments', videoVariable)
            .then(response => {
                if (response.data.success) {
                    console.log('response.data.comments',response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get video Info')
                }
            })


    }, [])

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }


    if (Video.writer) {
        
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filePath}`} controls></video>

                        <List.Item
                            actions={[<LikeDislikes video videoId={videoId} userId={localStorage.getItem('userId')}  />, <Subscriber userTo={Video.writer._id} userFrom={localStorage.getItem('userId')} />]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                                title={<a href="https://ant.design">{Video.title}</a>}
                                description={Video.description}
                            />
                            <div></div>
                        </List.Item>

                        <Comments CommentLists={CommentLists} postId={Video._id} refreshFunction={updateComment} />

                    </div>
                </Col>
                <Col lg={6} xs={24}>

                    <SideVideo />

                </Col>
            </Row>
        )

    } else {
        return (
            <div>Loading...</div>
        )
    }


}

export default DetailVideoPage

