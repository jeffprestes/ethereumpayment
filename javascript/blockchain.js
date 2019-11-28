var contractAddress = "0x557D0Ecd8A9ae210519d1bD9B543723E04941eEe";
var provider = new ethers.providers.Web3Provider(web3.currentProvider);
var signer = provider.getSigner();
var contract = new ethers.Contract(contractAddress, contractAbi, signer);

function getContractBalance() {    
    var boxBalance = document.getElementById("boxBalance");
    console.log("getContractBalance - submitting the request");     
    contract.getContractBalance()
    .then( (resultFromContract) => {
        console.log("getContractBalance - result is", resultFromContract);
        boxBalance.innerHTML = resultFromContract;
    })
    .catch( (err) => {
        console.error(err);
        alert("A screen will be load asking to allow this page to connect with your Ethereum account.\nPlease give this permission to proceed.\nOr if you don't have an Ethereum account please install Metamask");
        ethereum.enable();
        alert("After you give the permission we are going to reload the page");
        document.location = "index.html";
    });
}

function executePayment() {
    var amount = document.frmPayment.amount.value;       
    if (amount<1000000000) {
        alert("You must pay a minimum of 1 gwei to the Contract");
        return false;
    }
    var motivation = document.frmPayment.motivation.value;
    var boxCommStatus = document.getElementById("boxCommStatus");
    boxCommStatus.innerHTML = "Sending transaction...";
    var additionalSettings = {
        value: ethers.utils.parseUnits(amount, 'wei')
    }; 
    contract.pay(motivation, additionalSettings)
    .then( (tx) => {
        console.log("executePayment - Transaction ", tx);   
        boxCommStatus.innerHTML = "Transaction sent. Waiting for the result...";
        tx.wait()
        .then( (resultFromContract) => {
            console.log("executePayment - the result was ", resultFromContract);
            getContractBalance();
            boxCommStatus.innerHTML = "Transaction executed.";
        })        
        .catch( (err) => {
            console.error("executePayment - after tx being mint");
            console.error(err);
            boxCommStatus.innerHTML = "Algo saiu errado: " + err.message;
        })
    })
    .catch( (err) => {
        console.error("executePayment - tx has been sent");
        console.error(err);
        boxCommStatus.innerHTML = "Something went wrong: " + err.message;
    })
}