
function showBlockInfo(blockNum) {
    blockNum = parseInt(blockNum);
    axios({
        method: 'post',
        url: wurl + 'getblockbynum',
        data: {
            num: blockNum
        }
    }).then((res) => {
        let bdata = res.data;
        let rawdata = bdata.block_header.raw_data;
        let blockInfo = [];
        var transactionsNum = 0
        let transactions = res.data.transactions;
        if (transactions) {
            transactionsNum = transactions.length;
        }
        blockInfo.push(['Height', blockNum]);
        blockInfo.push(['Number of transactions', transactionsNum]);
        blockInfo.push(['Previous block', rawdata.parentHash]);
        blockInfo.push(['Timestamp', getsTime(rawdata.timestamp)]);
        var app4 = new Vue({
            el: '#app-block',
            data: {
                blocks: blockInfo
            }
        })

        // Transactions
        var trans = [];
        if (transactions) {
            for (let index = 0; index < transactions.length; index++) {
                const oneTran = transactions[index];
                // console.log('oneTran.raw_data.contract.parameter',oneTran.raw_data.contract[0])
                let otran = {
                    id: oneTran.txID,
                    date: getsTime(oneTran.raw_data.timestamp),
                    sender: do58Encode(oneTran.raw_data.contract[0].parameter.value.owner_address),
                    recipient: do58Encode(oneTran.raw_data.contract[0].parameter.value.to_address),
                    amount: oneTran.raw_data.contract[0].parameter.value.amount/1000000+' SVT',
                    remark: oneTran.raw_data.contract[0].parameter.value.remark
                }
                trans.push(otran);
            }
        }
        var appemptytran = new Vue({
            el: '#app-trans',
            data: {
                isEmpty: (transactionsNum == 0) ? true : false,
                trans: trans
            },
            methods:{
                clickTranId:function(tid){
                    window.location.href = 'transaction.html?tid='+tid;
                },
                clickAddress: function(address){
                    window.location.href = 'address.html?address='+address + '&type=0&page=1';
                }
            }
        })

    }).catch((res) => {
        console.log(res);
    });

}

let blockNum = getQueryString('height');
showBlockInfo(blockNum);