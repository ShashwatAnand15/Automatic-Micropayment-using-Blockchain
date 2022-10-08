/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import Web3 from 'web3';
import { useState , useEffect } from 'react';
const Upload = require('../../../../assets/images/upload.png');

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  // metamask connection

  let web32;
  const[address,setAddress] = useState(null);
  const[myDountCount, setMyDountCount] = useState('');

  const contractABI = [{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"Users","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideoBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideoFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"VideosOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"}],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"}],"name":"getVideoFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"address","name":"accID","type":"address"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"user","type":"address"},{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"updateBalance","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"accID","type":"address"}],"name":"viewBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"VideoID","type":"string"},{"internalType":"address","name":"accID","type":"address"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"viewVideo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
  const contractAdress = '0x11A151Bee66949c0AF71e5D66eDC9A34221a27ba'
      
  window.onload =  async () => {
    
    // const connectWalletHandler = () => {
      if(typeof window !== 'undefined' && typeof window.ethereum !== "undefined"){
        window.ethereum.request ({method: "eth_requestAccounts"})
        web32 = new Web3(window.ethereum);
        const accounts = await web32.eth.getAccounts();
        setAddress(accounts[0]);
        
        var vendingMachineContract = new web32.eth.Contract(contractABI,contractAdress);
        try {
          const count = await vendingMachineContract.methods.Users(accounts[0]).call();
        setMyDountCount(count);
        
        // alert("cool");
        console.log(accounts[0]);
        }
        catch(err){
          console.log(err.message);
        }
        

      }else {
        alert("Please install Metamasak.")

      }
    // }
    

  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="create">
          <a href="/video/upload"><img src={Upload} alt="Upload" /></a>
        </Menu.Item>
        <Menu.Item key="balance">
          <a>Balance: {myDountCount}</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a href="/account">My Account</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

