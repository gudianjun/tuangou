async function  download(fetchResult) {
    var filename = decodeURI(fetchResult.headers.get('x-filename'));
    var data = await fetchResult.blob();
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const blob = new Blob([data], { type: data.type || 'application/octet-stream' });
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE doesn't allow using a blob object directly as link href.
        // Workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
        return;
    }
    // Other browsers
    // Create a link pointing to the ObjectURL containing the blob
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
    }, 100);
}

export default class Common{
    static get baseUrl(){
        //return  "http://47.108.133.145:5000/v1";
         return  "http://47.108.134.232:5000/v1";
        //eturn  "https://127.0.0.1:5000/v1";
    }

    static _setStorage(key, value){
        localStorage.setItem(key,value);
    }

    static _loadStorage(key){
        const value = localStorage.getItem(key);
        return value;
    }

    static _clear(){
        localStorage.clear();
    }
  
    static _getSendToken(){
        const token = Common._loadStorage("token");
        if(token === null){
            return ""
        }
        var arr= []
        arr.push(token);
        arr.push(":");
        arr.push("");
        var str=arr.join("");
        var authdata = window.btoa(str);
        return 'Basic ' + authdata
    }

    static sendMessage(url, sendType, urlPram, bodyObj, newHeader, callbackobj=null, callbackErr=null, cot=null){
        console.log(url)
        const auth = Common._getSendToken()
        var headers = {
            'content-type': 'application/json','charset':'utf-8' , ...newHeader
        }
        if(auth.length !== 0){
            headers = {...headers, 'AUTHORIZATION': auth}
        }
        var body = null;
        if(sendType === "POST")
        {
            body = JSON.stringify(bodyObj)
        }
        var pram=""
        for (var key in urlPram) { 
            if (urlPram.hasOwnProperty(key)) {
                pram+= key + "=" + urlPram[key]+"&"
            }
        }
        if(pram?.length>0)
        {
            // 存在参数
            pram=("?"+pram);
            pram=pram.substr(0, pram.length-1)
        }
        fetch(url + pram,{
            method: sendType,
            body: body,
            headers: headers,
            mode:'cors',
            redirect: 'follow', // 是否重定向 manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })
        .then((res)=>{
            console.log("请求成功，获请求元数据"); 
            this.res = res;
            return res.json(); //请求成功，获请求元数据
        })
        .then((result)=>{
           
            if(this.res.status < 300) // 成功的请求
            { console.log("拿到数据进行页面渲染"); 
                if(callbackobj!=null)
                {
                    callbackobj(result, cot);
                }
            }
            else{
                // 抛出错误
                console.log("拿到了错误的数据"); // 拿到数据进行页面渲染
                
               
                if (result.error_code === 4011){
                    if (cot!==null){
                        const {logout} = cot
                        console.log(logout); // 拿到数据进行页面渲染
                        logout()
                    }
                    callbackErr(result.msg);
                }
                else{
                    callbackErr(result.msg);
                }
           
                // if(callbackobj!=null)
                // {
                //     callbackobj(result);
                // }
            }
        })
        .catch((err)=>{
            //出错了
            console.log("网络通信发生错误");
            console.log(err);
            if(callbackErr!=null)
            {
                callbackErr(err);
            }
            
        })
    }

    static downloadFile(url, sendType, urlPram, bodyObj, newHeader, callbackobj=null, callbackErr=null, cot=null){
        console.log(url)
        const auth = Common._getSendToken()
        var headers = {
            'content-type': 'application/json','charset':'utf-8' , ...newHeader
        }
        if(auth.length !== 0){
            headers = {...headers, 'AUTHORIZATION': auth}
        }
        var body = null;
        if(sendType === "POST")
        {
            body = JSON.stringify(bodyObj)
        }
        var pram=""
        for (var key in urlPram) {
            if (urlPram.hasOwnProperty(key)) {
                pram+= key + "=" + urlPram[key]+"&"
            }
        }
        if(pram?.length>0)
        {
            // 存在参数
            pram=("?"+pram);
            pram=pram.substr(0, pram.length-1)
        }
        fetch(url + pram,{
            method: sendType,
            body: body,
            headers: headers,
            mode:'cors',
            redirect: 'follow', // 是否重定向 manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })
            .then( res => download(res) )

            .catch((err)=>{
                //出错了
                console.log("网络通信发生错误");
                console.log(err);
                if(callbackErr!=null)
                {
                    callbackErr(err);
                }

            })
    }

    static createPassword(min,max) {
        //可以生成随机密码的相关数组
        var num = ["0","1","2","3","4","5","6","7","8","9"];
        var english = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        var ENGLISH = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        //var special = ["-","_","#"];
        var config = num.concat(english).concat(ENGLISH)//.concat(special);

        //先放入一个必须存在的
        var arr = [];
        arr.push(getOne(num));
        arr.push(getOne(english));
        arr.push(getOne(ENGLISH));
        //arr.push(getOne(special));

        //获取需要生成的长度
        var len = min + Math.floor(Math.random()*(max-min+1));

        for(var i=4; i<len; i++){
            //从数组里面抽出一个
            arr.push(config[Math.floor(Math.random()*config.length)]);
        }

        //乱序
        var newArr = [];
        for(var j=0; j<len; j++){
            newArr.push(arr.splice(Math.random()*arr.length,1)[0]);
        }

        //随机从数组中抽出一个数值
        function getOne(arr) {
            return arr[Math.floor(Math.random()*arr.length)];
        }

        return newArr.join("");
    }

    static formatCurrency(num) {
        if(isNaN(num))
            num = "0";
        var sign = (num === (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        var cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
        cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        num = num.substring(0,num.length-(4*i+3))+','+
        num.substring(num.length-(4*i+3));
        return ( '￥' + ((sign)?'':'-') + num + '.' + cents);
    }
}
