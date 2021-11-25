module.exports = {
    sender: async function (account) {
        return { from: account, nonce: await web3.eth.getTransactionCount(account)}
    }
} 
