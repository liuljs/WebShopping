// PROFILE
let oldz = $('.old_psw'), newz = $('.new_psw'), cfmz = $('.cfm_psw');
let btnChangePsw = $('.btnChangePsw');
// 驗證
function checkPassword(oPsw, nPsw, cPsw) {
    if (oPsw.val().trim() === '') {
        oPsw.focus();
        return check = false, errorText = '請確實填寫舊密碼！';
    }
    else if (Rules.test(oPsw.val()) === false) {
        oPsw.focus();
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    if (nPsw.val().trim() === '') {
        nPsw.focus();
        return check = false, errorText = '請確實填寫新密碼！';
    }
    else if (Rules.test(nPsw.val()) === false) {
        nPsw.focus();
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    if (cPsw.val().trim() === '') {
        cPsw.focus();
        return check = false, errorText = '請確實填寫確認新密碼！';
    }
    else if (Rules.test(cPsw.val()) === false) {
        cPsw.focus();
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    else {
        return check = true;
    }
};
$().ready(function () {
    // 修改密碼
    btnChangePsw.on('click', function (e) {
        e.preventDefault();
        checkPassword(oldz, newz, cfmz);
        if (check == true) {
            let dataObj = {
                "OldPassword": oldz.val(),
                "Password": newz.val()
            };
            if (confirm("再次確認您要修改密碼嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        let callBackData = JSON.parse(xhr.responseText);
                        if (callBackData !== "") {
                            alert('修改密碼成功！');
                            getLogout();
                        };
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                        location.reload();
                    };
                };
                xhr.open('PATCH', `${URL}MemberUser/ChangePassword`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                xhr.send($.param(dataObj));
            }
        } else {
            alert(errorText);
        };
    });
});