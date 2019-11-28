if (!Web3) {
    alert("A screen will be load asking to allow this page to connect with your Ethereum account.\nPlease give this permission to proceed.\nOr if you don't have an Ethereum account please install Metamask");
    ethereum.enable();
    document.location = "index.html";
}
var contractAddress = "0x32Dd0823bEAe1434527815b91d7BD5BB13032dFD";
var provider = new ethers.providers.Web3Provider(web3.currentProvider);
var signer = provider.getSigner();
var contract = new ethers.Contract(contractAddress, contractAbi, signer);

function getContractBalance() {    
    var boxBalance = document.getElementById("boxBalance");     
    contract.getContractBalance()
    .then( (resultFromContract) => {
        boxBalance.innerHTML = resultFromContract;
    })
    .catch( (err) => {
        console.error(err);
        boxBalance.innerHTML = err;
    });
}