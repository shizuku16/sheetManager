async function load(){
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    const userId=localStorage.getItem('shizukuSheetId');
    if(id==null){
        if(userId!=undefined) window.location.href=`./index.html?id=${userId}`;
        else window.location.href=`../signin/index.html`;
        return
    }
    if(id!=userId){
        alert("不正なアクセスです");
        localStorage.removeItem('shizukuSheetId');
        sessionStorage.removeItem(`shizukuSheetList`);
        window.location.href=`../signin/index.html`;
    }
    let string=`<tr><th colspan="2">キャラシ一覧</td></tr><tr><th>名前</th><th>ラベル</th></tr>`;
    const table=document.getElementById("table");
    //テーブル削除
    while(table.firstChild ){
        table.removeChild( table.firstChild );
    }
    //キャッシュが残っていればそれでテーブルデータを作成する
    if(sessionStorage.getItem("shizukuSheetList")){
        const data=JSON.parse(sessionStorage.getItem("shizukuSheetList"));
        if(data.name.length==0) string=`<tr><td>作成されたキャラシはありません</td><tr>`;
        else{
            for(let i=0;i<data.name.length;i++){
                if(url.searchParams.get("label")){
                    if(!data.label[i].split(/,|、|\s/).includes(url.searchParams.get("label"))) continue;
                }
                let tag=``;
                data.label[i].split(/,|、|\s/).map(item=>{
                    if(item=="") return
                    tag+=`<a href="./index.html?id=${id}&label=${item}">${item}</a>&nbsp;`;
                })
                string+=`<tr><td><a href="../charasheet/index.html?id=${data.id[i]}">${data.name[i]}</a></td><td>${tag}</td></tr>`;
            }
        }
    }
    //残っていなければ取得しに行く
    else{
        await fetch(`https://script.google.com/macros/s/AKfycbwdHbldN3SYbnKs5MdfGKbBEaLAE5cU1awXURoJvEexRuvLvbWforRzlM2td6hDPrP1/exec?data=${id}`)
            .then(res=>res.json())
            .then(data=>{
                let json={"name":[],"id":[],"label":[]};
                if(url.searchParams.get("label")){
                    data=data.filter(e=>JSON.parse(e[2]).label.match(url.searchParams.get("label")))
                    if(data.length==0) data=0;
                }
                if(data==0) string=`<tr><td>作成されたキャラシはありません</td><tr>`;
                else data.map(e=>{
                    json.name.push(e[1]);
                    json.id.push(e[0]);
                    json.label.push(JSON.parse(e[2]).label);
                    let tag=``;
                    JSON.parse(e[2]).label.split(/,|、|\s/).map(item=>{
                        if(item=="") return
                        tag+=`<a href="./index.html?id=${id}&label=${item}">${item}</a>&nbsp;`;
                    })
                    string+=`<tr><td><a href="../charasheet/index.html?id=${e[0]}">${e[1]}</a></td><td>${tag}</td></tr>`;
                })
                sessionStorage.setItem(`shizukuSheetList`,JSON.stringify(json));
            })
            .catch(err=>{
                localStorage.removeItem(`shizukuSheetId`);
                window.location.href="../signin/index.html";
            })
    }
    table.insertAdjacentHTML("beforeend",string);
    document.getElementById("menu").hidden=false;
}

function logOut(){
    const logout=window.confirm("ログアウトしますか？");
    if(logout){
        localStorage.removeItem('shizukuSheetId');
        sessionStorage.removeItem(`shizukuSheetList`);
        alert("ログアウトしました");
        window.location.href="../signin/index.html";
    }
}
