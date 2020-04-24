export default class Common{
    static get baseUrl(){
        return  "http://127.0.0.1:5000/v1";
    }

    static _setStorage(key, value){
        localStorage.setItem(key,value);
    }

    static _loadStorage(key){
        const value = localStorage.getItem(key);
        return value;
    }

    static _getSendToken(){
        const token = Common._loadStorage("token");
        if(token === null){
            return ""
        }
        var arr=new Array();
        arr.push(token);
        arr.push(":");
        arr.push("");
        var str=arr.join("");
        var authdata = window.btoa(str);
        return 'Basic ' + authdata
    }
    /*
    发送网络请求
    sendType:请求类型， POST GET ....
    */
    static sendMessage(url, sendType, urlPram, bodyObj, newHeader, callbackobj=null, callbackErr=null){
        console.log(url)
        const auth = Common._getSendToken()
        var headers = {
            'content-type': 'application/json;charset=utf-8','Access-Control-Allow-Origin': '*', ...newHeader
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
            console.log("拿到数据进行页面渲染"); 
            if(this.res.status < 300) // 成功的请求
            {
                if(callbackobj!=null)
                {
                    callbackobj(result);
                }
            }
            else{
                // 抛出错误
                console.log(result); // 拿到数据进行页面渲染
                if(callbackobj!=null)
                {
                    callbackobj(result);
                }
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
}
