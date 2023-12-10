function change(){
    const userId=localStorage.getItem('shizukuSheetId');
    const oldPass=$(`#nowPass`).val();
    const newPass=$(`#newPass1`).val();
    const password=$(`#newPass2`).val();

    if(newPass!=password){
        alert("パスワードが一致していません。")
        return
    }
    fetch("https://script.google.com/macros/s/AKfycbwneYVE_OVzFxTf9AB1x6iyofR8e1QPVfT5c10Psh1qwJ3ey9ShMa1wa4padXwg1UFAkA/exec")
        .then(res=>res.json())
        .then(data=>data.filter(e=>e[0]==userId))
        .then(account=>{
            if(account[0][1]!=oldPass) alert("現在のパスワードが違います");
            else {
                fetch(`https://script.google.com/macros/s/AKfycbx3-wTXLUdmD3x2uWNCh6biwzUckXFFw8562rf21suRawEhT2ZD7e-9XVCO9NxrH_FS/exec?data=${userId},${password}`)
                    .then(res=>res.json())
                    .then(data=>{
                        alert("パスワードが変更されました。");
                        window.location.href=`../mylist/index.html?id=${userId}`;
                    })
            }
        })
}


function menu(){
    $(`.menuBar`).prop("hidden",!$(`.menuBar`).prop("hidden"))
}