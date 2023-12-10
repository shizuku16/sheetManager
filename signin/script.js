function load(){
    if(localStorage.getItem('shizukuSheetId')) window.location.href=`../mylist/index.html?id=${localStorage.getItem('shizukuSheetId')}`;
}

function signin(){
    const id=document.getElementById("id").value;
    const pass=document.getElementById("pass").value;
    fetch("https://script.google.com/macros/s/AKfycbwneYVE_OVzFxTf9AB1x6iyofR8e1QPVfT5c10Psh1qwJ3ey9ShMa1wa4padXwg1UFAkA/exec")
        .then(res=>res.json())
        .then(data=>data.filter(e=>e[0]==id))
        .then(account=>{
            if(account.length==0) alert("アカウントが存在しません");
            else if(account[0][1]!=pass) alert("パスワードが違います");
            else {
                localStorage.setItem('shizukuSheetId', id);
                window.location.href=`../mylist/index.html?id=${id}`;
            }
        })
}

//入力チェック
function check(input){
    if (input.validity.valid||input.value=="") return;
    alert("英数字のみ使用可能です。");
    console.log(input.value)
    input.value=input.value.replace(/.$/,"");
    input.focus();
}