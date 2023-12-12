//登録ボタンが押されたときの処理
async function idCheck(btn){
    btn.disabled=true;
    let flg=false;
    let id=document.getElementById("id").value;
    let pass=document.getElementById("pass").value;
    let pass2=document.getElementById("pass2").value;
    //重複IDでないか
    await fetch("https://script.google.com/macros/s/AKfycbwneYVE_OVzFxTf9AB1x6iyofR8e1QPVfT5c10Psh1qwJ3ey9ShMa1wa4padXwg1UFAkA/exec")
        .then(res=>res.json())
        .then(data=>{if(data.filter(array=>array[0]==id).length>0) flg=true})
    if(flg){
        alert("既に使われているIDです。");
    }
    else if(pass!=pass2){
        alert("入力されたパスワードが一致しません。")
    }
    else{
        //登録処理
        await fetch(`https://script.google.com/macros/s/AKfycbxHNhsvMTcGc2lYi1kDEjIHiTEqNlON8aQ0o7PMNaEV4knmcIHSOBX4RHvdCaNfudPPMg/exec?data=${id},${pass}`)
        alert("登録が完了しました。");
        localStorage.setItem('shizukuSheetId', id);
        window.location.href=`../mylist/index.html?id=${id}`;
    }
    btn.disabled=false;
}

//入力チェック
function check(input){
    if (input.validity.valid||input.value=="") return;
    alert("英数字のみ使用可能です。");
    console.log(input.value)
    input.value=input.value.replace(/.$/,"");
    input.focus();
}
