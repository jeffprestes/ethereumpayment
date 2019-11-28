pragma solidity 0.5.13;

contract Escrow {
    
    address payable public beneficiary;
    string public motivation;
    
    constructor() public {
        beneficiary = msg.sender;
    }
    
    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }
    
    function pay(string memory _motivation) public payable returns(bool) {
        motivation = _motivation;
        return true;
    }
    
    function withdraw() public returns(bool) {
        require(msg.sender==beneficiary, "only beneficiary is allowed to withdraw ethers");
        require(address(this).balance>0, "there is no balance in this contract");
        beneficiary.transfer(address(this).balance);
        return true;
    }
    
}