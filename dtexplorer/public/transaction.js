
function showTransactionInfo(tid) {
    axios({
        method: 'post',
        url: wurl + 'gettransactionbyid',
        data: {
            value: tid
        }
    }).then((res) => {
        let tdata = res.data;
        let contract = tdata.raw_data.contract[0];
        let transfer = [];

        // get tiem, block
        axios({
            method: 'post',
            url: wurl + 'gettransactioninfobyid',
            data: {
                value: tid
            }
        }).then((resInfo) => {
            let dataInfo = resInfo.data;

            transfer.push(['Transaction ID', tdata.txID]);
            transfer.push(['In Height', dataInfo.blockNumber]);
            transfer.push(['Type', contract.type]);
            transfer.push(['Sender', do58Encode(contract.parameter.value.owner_address)]);
            transfer.push(['Recipient', do58Encode(contract.parameter.value.to_address)]);
            transfer.push(['Amount', contract.parameter.value.amount/1000000+' DT']);
            transfer.push(['Timestamp', getsTime(dataInfo.blockTimeStamp)]);
            transfer.push(['Remark', contract.parameter.value.remark]);

            var app4 = new Vue({
                el: '#app-transfer',
                data: {
                    transfer: transfer
                }
            })
        })


    }).catch((res) => {
        console.log(res);
    });

}

let tid = getQueryString('tid');
showTransactionInfo(tid);