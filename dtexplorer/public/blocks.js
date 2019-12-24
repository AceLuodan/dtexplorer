function show20Blocks(){
    // getnowblock
    // 最新的几个块
    axios({
        method: 'post',
        url: wurl+'getblockbylatestnum',
        data:{
            num:21
        }
    }).then((res)=>{
        let bdata = res.data;
        let data = bdata.block;
        var blocks = [];
        for (let index = 0; index < data.length-1; index++) {
            let stime = getsTime(data[index].block_header.raw_data.timestamp);
            let oneb = {
                height: data[index].block_header.raw_data.number,
                time: stime,
                transactions: 0,
                hash: data[index+1].block_header.raw_data.parentHash
            }
            blocks.push(oneb);
        }
        // 排序
        blocks.sort((a,b)=>{return b.height - a.height});
        // 获取交易数量
        for (let index = 0; index < blocks.length; index++) {
            axios({
                method: 'post',
                url: wurl+'getblockbynum',
                data:{
                    num: blocks[index].height
                }
            }).then((res2)=>{
                let transactions = res2.data.transactions;
                if(transactions){
                    blocks[index].transactions = transactions.length;
                }
            }).catch((res2)=>{
                console.log(res2);
            });
        }
        
        var app4 = new Vue({
            el: '#app-4',
            data: {
                blocks: blocks
            }
        })
    }).catch((res)=>{
        console.log(res);
    });

}

show20Blocks();
