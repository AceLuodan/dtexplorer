

async function getTransactions(iscount,address, type, page){    
    let typeUrl = 'transfers';

    let paramsTemp ;

    if(iscount = 0){

        if (0 == type ) {
            paramsTemp ={
                to: address,
                start: page,
                limit: 10,
                sort : 'timeStamp'
            };
        }else{
             paramsTemp ={
                from: address,
                start: page,
                limit: 10,
                sort : 'timeStamp'
            };
        }

    }else{

        if (0 == type ) {
            paramsTemp ={
                to: address
            };
        }else{
             paramsTemp ={
                from: address
            };
        }
    }

    

    return await axios({
                method: 'get',
                url: wapiurl + typeUrl,
                params: paramsTemp
        }).then(res=>res.data);;
}

async function showTranButton(address, type, page) {

    var allCount = 0;
    var sendCount = 0;
    var receiveCount = 0;

    let transactionsFrom = await getTransactions(1,address, 0, page) ;
    if(transactionsFrom.data){
        receiveCount = transactionsFrom.data.length;
    }

    let transactionsTo = await getTransactions(1,address, 1, page) ;
     if(transactionsTo.data){
        sendCount = transactionsTo.data.length;
    }

    allCount = receiveCount+sendCount;

    var apptbtn = new Vue({
        el: '#app-tranbtn',
        data: {
            address: address,
            type: type,
            allCount: allCount,
            sendCount: sendCount,
            receiveCount: receiveCount
        }
    });
    
    showTranPage(address, type, page, allCount, sendCount, receiveCount);

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

    let typeUrl = 'transfers';

    let paramsTemp ;

    if (0 == type) {
        paramsTemp ={
            from: address,
            //offset: 10 * (page - 1),
            start: page,
            limit: 10,
            sort : 'timeStamp'
        };
    }else{
         paramsTemp ={
            to: address,
            start: page,
            limit: 10,
            sort : 'timeStamp'
        };
    }
    
    axios({
        method: 'get',
        url: wapiurl + typeUrl,
        params: paramsTemp
    }).then((res) => {
        //let transactions = res.data.trans;
        let transactions = res.data.data;
        allCount = 0;
        sendCount = 20;
        receiveCount = 0;
        var trans = [];
        if (transactions) {
            for (let index = 0; index < transactions.length; index++) {
                const oneTran = transactions[index];
                let otran = {
                    id: oneTran.transactionId,
                    date: getsTime(oneTran.timeStamp || 0),
                    sender: oneTran.fromAddress,
                    recipient: oneTran.toAddress,
                    amount: oneTran.assetAmount / 1000000 + ' SVT',
                    remark: oneTran.remark,
                    block_id: oneTran.blockHash
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
