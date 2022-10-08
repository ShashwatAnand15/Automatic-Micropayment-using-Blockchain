// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract EduPlatform {

    mapping(address => uint) public Users;
    
    mapping(string => address) public VideosOwner;
    mapping(string => uint) public VideoFee;
    mapping(string => uint) public VideoBalance;

    // for updating the Users balance
    function updateBalance(uint newBalance) public payable  {
      Users[msg.sender] += newBalance;
   }
    // for getting the Users balance
   function viewBalance(address accID) public view returns (uint){
      uint balance =  Users[accID];
      return balance;
   }
    // for uploading a video (setting the video owner , video fees and video balance)
   function setOwner(string memory VideoID , address accID , uint fee) public {
      VideosOwner[VideoID] = accID;
      VideoFee[VideoID]=fee;
   }
    // for accesing the owner of the video
   function getOwner(string memory VideoID) public view returns (address){
      address Owner =  VideosOwner[VideoID];
      return Owner;
   }
    // for setting the video fee
//    function setVideoFee(string memory VideoID , uint fee) public {
//       ideoFee[VideoID]=fee;
//    }

    // for accessing the video fee
   function getVideoFee(string memory VideoID) public view returns (uint){
      uint fee =  VideoFee[VideoID];
      return fee;
   }
    // for vewing the video
   function viewVideo(string memory VideoID , address accID , uint fee) public {
       Users[accID] -= fee;
       VideoBalance[VideoID] +=fee;
   }

    function transfer (address payable user,string memory VideoID , uint amount) public payable {
        require(amount <= Users[user]);
        payable(user).transfer(amount);
        Users[user] -= amount;
        VideoBalance[VideoID] +=amount;
    }
    function deposit (address payable user, uint amount) public payable {
        payable(user).transfer(amount);
        Users[user] += amount;
    }


    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }
    receive() external payable{

     }



}