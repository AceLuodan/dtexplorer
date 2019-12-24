function showLast10Blocks(){
    // getnowblock
    // 最新的几个块
    axios({
        method: 'post',
        url: wurl+'getblockbylatestnum',
        data:{
            num:11
        }
    }).then((res)=>{
        let bdata = res.data;
        let data = bdata.block;
        // console.log(data);
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
            },
            methods:{
                clickBlock:function(height){
                    window.location.href = 'block.html?height='+height;
                }
            }
        })
    }).catch((res)=>{
        console.log(res);
    });

}

function getsTime2(timestamp){
    let d = new Date(timestamp);
    let yy = d.getFullYear();      //年
    let mm = d.getMonth() + 1;     //月
    let dd = d.getDate();          //日
    let hh = d.getHours();         //时
    let ii = d.getMinutes();       //分
    let ss = d.getSeconds();       //秒
    let clock = dd + "/" + mm + "/" + yy + " ";
    if(hh < 10) clock += "0";
        clock += hh + ":";
    if (ii < 10) clock += '0'; 
        clock += ii + ":";
    if (ss < 10) clock += '0'; 
        clock += ss;
    return clock;
}
showLast10Blocks();