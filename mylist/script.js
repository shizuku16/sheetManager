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
        window.location.href=`../signin/index.html`;
    }
    console.log(id)
    let string=`<tr><th>キャラシ一覧</td></tr>`;
    const table=document.getElementById("table");
    //テーブル削除
    while(table.firstChild ){
        table.removeChild( table.firstChild );
    }
    await fetch(`https://script.google.com/macros/s/AKfycbwdHbldN3SYbnKs5MdfGKbBEaLAE5cU1awXURoJvEexRuvLvbWforRzlM2td6hDPrP1/exec?data=${id}`)
        .then(res=>res.json())
        .then(data=>{
            if(data==0) string=`<tr><td>作成されたキャラシはありません</td><tr>`;
            else data.map(e=>{
                string+=`<tr><td><a href="../charasheet/index.html?id=${e[0]}">${e[1]}</a></td></tr>`
            })
        })
    table.insertAdjacentHTML("beforeend",string);
    document.getElementById("menu").hidden=false;
}

function logOut(){
    const logout=window.confirm("ログアウトしますか？");
    if(logout){
        localStorage.removeItem('shizukuSheetId');
        alert("ログアウトしました");
        window.location.href="../signin/index.html";
    }
}