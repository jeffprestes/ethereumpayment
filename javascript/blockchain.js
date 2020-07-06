var contractAddress = "0x557D0Ecd8A9ae210519d1bD9B543723E04941eEe";
var providerDefault = ethers.getDefaultProvider('rinkeby');
var providerSigner;
var signer;
var contract = new ethers.Contract(contractAddress, contractAbi, providerDefault);
var contractWithSigner;
var currentAccount;

if (!ethereum || !ethereum.isMetaMask) {
    alert('Please install MetaMask.');
}

function loading() {
    ethereum.send('eth_accounts')
    .then(handleAccountsChanged)
    .catch(err => {
        // In the future, maybe in 2020, this will return a 4100 error if
        // the user has yet to connect
        if (err.code === 4100) { // EIP 1193 unauthorized error
            console.log('Please connect to MetaMask.')
        } else {
            console.error(err)
        }
    }) 
}

ethereum.on('accountsChanged', handleAccountsChanged)

function handleAccountsChanged (accounts) {
    console.log('handleAccountsChanged', accounts.length);
    providerSigner = new ethers.providers.Web3Provider(web3.currentProvider);
    signer = providerSigner.getSigner();
    contractWithSigner = new ethers.Contract(contractAddress, contractAbi, signer);
    if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.')        
    } else if (accounts[0] !== currentAccount) {  
        currentAccount = accounts[0];        
        if (currentAccount) {            
            console.log('handleAccountsChanged objects', accounts, currentAccount, signer);
        }
    }
}

function connectToWeb3() {  
    console.log('connectToWeb3 called');
    ethereum.send('eth_requestAccounts')
    .then(handleAccountsChanged)
    .catch(err => {
      if (err.code === 4001) { // EIP 1193 userRejectedRequest error
        console.log('Please connect to MetaMask.')
      } else {
        console.error(err)
      }
    })    
}

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
        alert("After you give the permission we are going to reload the page");        
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
    contractWithSigner.pay(motivation, additionalSettings)
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
