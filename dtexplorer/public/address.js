function showTranButton(address, type, page) {
    axios({
        method: 'get',
        url: wapiurl + 'getTranCounts',
        params: {
            address: address
        }
    }).then((res) => {
        var allCount = res.data.allCount;
        var sendCount = res.data.sendCount;
        var receiveCount = res.data.receiveCount;
        var apptbtn = new Vue({
            el: '#app-tranbtn',
            data: {
                address: address,
                type: type,
                allCount: allCount,
                sendCount: sendCount,
                receiveCount: receiveCount
            }
        })
        showTranPage(address, type, page, allCount, sendCount, receiveCount);
    });

}

function showTranPage(address, type, page, allCount, sendCount, receiveCount){
    let maxApage = Math.ceil(allCount/10);
    let maxSpage = Math.ceil(sendCount/10);
    let maxRpage = Math.ceil(receiveCount/10);
    var maxPage = 1;
    if(0 == type){
        maxPage = maxSpage;
    }else if(1 == type){
        maxPage = maxRpage;
    }

    if(page > maxPage){
        page = maxPage;
    }

    let nums = [];
    let stnum = page - 2;
    let ennum = page + 2;
    if(stnum < 1){
        stnum = 1;
    }
    if(ennum < 5){
        ennum = 5;
    }
    if(ennum > maxPage){
        ennum = maxPage;
    }

    for (let index = stnum; index <= ennum; index++) {
        nums.push(index);
    }
    let ppage = page - 1;
    if(ppage < 1){
        ppage = 1;
    }
    let npage = page + 1;
    if(npage > maxPage){
        npage = maxPage;
    }
    var appPage = new Vue({
        el: '#app-page',
        data: {
            address: address,
            type: type,
            page: page,
            ppage: ppage,
            npage: npage,
            nums: nums,
            maxPage: maxPage
        }
    })
}

function showAddressInfo(address) {
    axios({
        method: 'post',
        url: wurl + 'getaccount',
        data: {
            address: address
        }
    }).then((res) => {
        let adata = res.data;
        let addressInfo = [];
        if(!adata.address){
            addressInfo.push(['Address', do58Encode(address)]);
            addressInfo.push(['Total balance', '0 SVT']);
        }else{
            addressInfo.push(['Address', do58Encode(adata.address)]);
            addressInfo.push(['Total balance', adata.balance / 1000000 + ' SVT']);
        }
        
        var app4 = new Vue({
            el: '#app-address',
            data: {
                addressInfo: addressInfo
            }
        })



    }).catch((res) => {
        console.log(res);
    });

}

function showTransaction(address, type, page) {
    let typeUrl = 'getAddressReceive';
    if (0 == type) {
        typeUrl = 'getAddressSend';
    }
    axios({
        method: 'get',
        url: wapiurl + typeUrl,
        params: {
            address: address,
            offset: 10 * (page - 1),
            limit: 10
        }
    }).then((res) => {
        let transactions = res.data.trans;
        allCount = 0;
        sendCount = 20;
        receiveCount = 0;
        var trans = [];
        if (transactions) {
            for (let index = 0; index < transactions.length; index++) {
                const oneTran = transactions[index];
                let otran = {
                    id: oneTran.txID,
                    date: getsTime(oneTran.timestamp || 0),
                    sender: oneTran.owner_address,
                    recipient: oneTran.to_address,
                    amount: oneTran.amount / 1000000 + ' SVT',
                    remark: oneTran.remark,
                    block_id: oneTran.block_id
                }
                trans.push(otran);
            }
            // trans.sort((a, b) => { return b.block_id - a.block_id });
        }
        var appTrans = new Vue({
            el: '#app-trans',
            data: {
                trans: trans,
                type: type,
                page: page
            }
        })
    }).catch((res) => {
        console.log(res);
    });

}


let address = getQueryString('address');
let type = getQueryString('type');
type = type ? type : 0;
type = parseInt(type);
let page = getQueryString('page');
page = page ? page : 1;
page = parseInt(page);
showTranButton(address, type, page);
showAddressInfo(do58Decode(address));
showTransaction(address, type, page);
