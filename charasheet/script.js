let changeFlag=false;

async function load(){
    const url = new URL(window.location.href);
    const sheetId = url.searchParams.get("id");
    if(sheetId==null) url.searchParams.set("id","000000")
    if(sheetId=="000000"||sheetId==null){
        if(localStorage.getItem('shizukuSheetId')!=null){
            $(`#keep`).prop("hidden",false);
            $(`#delete`).prop("hidden",false);
        } else {
            $(`#logOutButton`).prop("hidden",true);
            $(`#mylistButton`).prop("hidden",true);
            $(`#passChangeButton`).prop("hidden",true);
            $(`#newCreate`).prop("hidden",true);
            $(`#logInButton`).prop("hidden",false);
        }
        $(`body`).prop("hidden",false);
        document.title=`新規作成`;
        return
    };
    let json={};
    try{
        await fetch(`https://script.google.com/macros/s/AKfycbxTPE01cfuZf55Pbr7SMi5ayqziRiEcO6YvoArOqg9KYA8flKFVNHKMRpi8zCV1WhUnFQ/exec?data=${localStorage.getItem('shizukuSheetId')},${sheetId}`)
        .then(res=>res.json())
        .then(data=>json=JSON.parse(data))
    }
    catch{
        alert("存在しないIDです。");
        window.location.href=`./index.html?id=000000`;
    }
    
    $(`#name`).val(json.name);
    $(`#doubleName`).val(json.doubleName);
    $(`#base`).val(json.base);
    for(let i=1;i<=json.power;i++) $(`#power${i}`).prop("checked",true);
    for(let i=0;i<json.slump.length;i++) $(`#slump${json.slump[i]}`).prop("checked",true);
    for(let i=1;i<=json.charactor.length;i++){
        if(i>6) add(`charactor`);
        $(`#charactor${i}`).val(json.charactor[i-1][0]);
        $(`#pused${i}`).prop("checked",json.charactor[i-1][1]);
    }
    for(let i=1;i<=json.tag.length;i++){
        if(i>6) add(`tag`);
        $(`#tag${i}`).val(json.tag[i-1]);
    }
    for(let i=1;i<6;i++){
        $(`#skill${i}Name`).val(json.skillName[i-1]);
        $(`#skill${i}Type`).val(json.skillType[i-1]);
        $(`#skill${i}Effect`).val(json.skillEffect[i-1]);
    }
    for(let i=1;i<7;i++) $(`#item${i}`).val(json.item[i-1]);
    if(localStorage.getItem('shizukuSheetId')==json.user){
        $(`#keep`).prop("hidden",false);
        $(`#delete`).prop("hidden",false)
    }
    if(localStorage.getItem('shizukuSheetId')==null){
        $(`#logOutButton`).prop("hidden",true);
        $(`#mylistButton`).prop("hidden",true);
        $(`#passChangeButton`).prop("hidden",true);
        $(`#newCreate`).prop("hidden",true);
        $(`#logInButton`).prop("hidden",false);
    }
    document.title=`${json.name}`;
    $(`body`).prop("hidden",false);
}


function add(id){
    const table=document.getElementById(id);
    const i=table.childElementCount;
    //jsonの字数が増えすぎないよう対策
    if(i==10){
        alert(`これ以上は増やせません`);
        return;
    }
    let string=`<tr><td><input type="text"  maxlength="20" `;
    if(id=="charactor") string+=`id="charactor${i+1}">　への絆
    <label class="control control--checkbox">
        <input type="checkbox" id="pused${i+1}" hidden/>
        <div class="control__indicator"></div>
    </label>    `;
    else if(id=="tag") string+=` id="tag${i+1}">`;
    string+=`</td></tr>`;
    table.insertAdjacentHTML("beforeend",string);
}

function decrease(id){
    const table=document.getElementById(id);
    if(table.childElementCount==1) return;
    table.lastElementChild.remove();
}

function power(i){
    if(!document.getElementById(`power${i}`).checked)
        for(let n=1;n<=i;n++) document.getElementById(`power${n}`).checked=true;
    else if(document.getElementById(`power${i+1}`).checked)
        for(let n=i+1;n<=3;n++) document.getElementById(`power${n}`).checked=false;
    else for(let n=1;n<=i;n++) document.getElementById(`power${n}`).checked=false;
}

function makeJson(){
    if(!$(`#name`).val()){
        alert("名前を設定してください");
        return;
    }
    $(`button`).prop("disabled",true);
    let num=0;
    for(let i=1;i<=3;i++)
        if($(`#power${i}`).prop("checked")==true) num++
    let slump=[];
    for(let i=1;i<=6;i++)
        if($(`#slump${i}`).prop("checked")==true) slump.push(i);
    let charactor=[];
    for(let i=1;i<=$(`#charactor`).prop("childElementCount");i++)
        charactor.push([$(`#charactor${i}`).val(),$(`#pused${i}`).prop("checked")]);
    let tag=[];
    for(let i=1;i<=$(`#tag`).prop("childElementCount");i++)
        tag.push($(`#tag${i}`).val());
    let skillName=[];
    let skillType=[];
    let skillEffect=[];
    for(let i=1;i<=5;i++){
        skillName.push($(`#skill${i}Name`).val());
        if(i<3) skillType.push($(`#skill${i}Type`).val());
        skillEffect.push($(`#skill${i}Effect`).val());
    }
    let item=[];
    for(let i=1;i<=6;i++)
        item.push($(`#item${i}`).val())
    const json={};
    json.name=$(`#name`).val();
    json.doubleName = $(`#doubleName`).val();
    json.base = $(`#base`).val();
    json.power = num;
    json.slump = slump;
    json.charactor = charactor;
    json.tag = tag;
    json.skillName = skillName;
    json.skillType = skillType;
    json.skillEffect = skillEffect;
    json.item=item;
    json.user=localStorage.getItem('shizukuSheetId');


    const url = new URL(window.location.href);
    const sheetId = url.searchParams.get("id");
    try{
        fetch(`https://script.google.com/macros/s/AKfycbyPal2NDZQtd_0i_rgqhcIeufs3IDbzQ5HDD9tdLSdRh8n36PVkImRWXL5J1u2DhaioBQ/exec?data=${localStorage.getItem('shizukuSheetId')}|br|${sheetId}|br|${JSON.stringify(json)}`)
            .then(res=>res.json())
            .then(data=>{
                alert("保存されました。");
                $(`button`).prop("disabled",false);
                changeFlag=false;
                if(sheetId=="000000"||sheetId==null){
                    url.searchParams.set("id",data);
                    window.location.href=`./index.html?id=${data}#top`;
                    return;
                }
            })
    }catch(err){
        alert("保存に失敗しました。クリップボードの情報をしずくへ送ってください。");
        $(`button`).prop("disabled",false);
        navigator.clipboard.writeText(JSON.stringify(json));
        return;
    }
}

function sheetDelete(){
    const check=window.confirm("削除すると復元できません。\n本当に削除しますか？");
    if(!check) return
    $(`button`).prop("disabled",true);
    const url = new URL(window.location.href);
    const sheetId = url.searchParams.get("id");
    const userId=localStorage.getItem('shizukuSheetId');
    fetch(`https://script.google.com/macros/s/AKfycbz-TXINhwebMd-f49TnKWMbUkH7spSSNQrjY4ClPhEe6-Cf2RlCfHZyDSLogB7idsN37Q/exec?data=${userId}?${sheetId}`)
        .then(res=>res.json())
        .then(data=>{
            alert(`シートが削除されました。`);
            changeFlag=false;
            window.location.href=`../mylist/index.html`;
        })
}

function outPut(){
    let str="";
    str+=`{"kind": "character","data": {`;
    str+=`"name": "${$(`#name`).val()}",`;
    str+=`"externalUrl": "${window.location.href}",`;
    str+=`"commands": "2B6>=4\\n({霊力}/5+1)d6 【弾幕配置】",`;
    str+=`"status": [{"label": "やる気","value": 1,"max": 3},{"label": "残り人数","value": 2,"max": 5},{"label": "スペルカード","value": 1,"max": 6},{"label": "グレイズ","value": 0,"max": 5},{"label": "霊力","value": 0,"max": 20}]`;
    str+=`}}`
    navigator.clipboard.writeText(str);
    alert(`クリップボードに保存されました。ココフォリアに貼り付けてください。`)
}

function change(){
    changeFlag=true;
}

window.onbeforeunload = function(e) {
    if(changeFlag==false) return;
    e.returnValue = "ページを離れようとしています。よろしいですか？";
}

function menu(){
    $(`.menuBar`).prop("hidden",!$(`.menuBar`).prop("hidden"))
}


function logOut(){
    const logout=window.confirm("ログアウトしますか？");
    if(logout){
        localStorage.removeItem('shizukuSheetId');
        alert("ログアウトしました");
        window.location.href="../signin/index.html";
    }
}
