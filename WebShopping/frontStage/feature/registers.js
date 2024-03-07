// REGISTER
let add_act = $('.add_act'), add_psw = $('.add_psw'), add_agn = $('.add_agn'), add_cstName = $('.add_cstName'), add_gender = $('.add_gender'), add_birth = $('.add_birth'), add_cell = $('.add_cell'), add_addr = $('.add_addr');
let addrs, gender;
let addrArr = new Array();
let btnSend = $('.btnSend');
let btnWithFaceBook = $('.btnWithFaceBook'), btnWithGoogle = $('.btnWithGoogle'), btnWithLine = $('.btnWithLine');
// 驗證
function dataUpdateCheck(acc, psw, agn, name, birth, cell) {
    if (acc.val().trim() === '' || EmailRegExp.test(acc.val().trim()) === false) {
        acc.focus();
        return check = false, errorText = '請確認帳號（Email）是否確實填寫，或格式是否正確！';
    }
    if (psw.val().trim() === '' || RulesSix.test(psw.val().trim()) === false) {
        psw.focus();
        return check = false, errorText = '請確認會員密碼是否確實填寫，或格式是否正確！';
    }
    if (agn.val().trim() === '' || RulesSix.test(agn.val().trim()) === false || agn.val().trim() !== psw.val().trim()) {
        agn.focus();
        return check = false, errorText = '請確認再次輸入的密碼是否確實填寫，或格式是否正確！';
    }
    if (name.val().trim() === '') {
        name.focus();
        return check = false, errorText = '請確認會員姓名是否確實填寫，或格式是否正確！';
    }
    if (birth.val().trim() === '') {
        birth.focus();
        return check = false, errorText = '請確認會員生日是否確實選取！';
    }
    if (cell.val().trim() === '' || CellRegExp.test(cell.val().trim()) === false) {
        cell.focus();
        return check = false, errorText = '請確認手機是否確實填寫，或格式是否正確！';
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    // 加入會員
    btnSend.on('click', function () {
        // twzipcode 取值
        addrArr = [];
        $('.add_twZipCode').twzipcode('get', function (county, district, zipcode) {
            if (county !== "") {
                addrArr.push(county);
                if (district !== "") {
                    addrArr.unshift(zipcode);
                    addrArr.push(district);
                };
            };
            return addrArr;
        });
        if (add_addr.val() !== "") {
            addrArr.push(add_addr.val());
        };
        // 驗證
        dataUpdateCheck(add_act, add_psw, add_agn, add_cstName, add_birth, add_cell);
        if (check == true) {
            let dataObj = {
                "account": add_act.val(),
                "name": add_cstName.val(),
                "gender": $('.add_gender:checked').val(), // 已選擇的 radio 值
                "birthday": add_birth.val(),
                "phone": add_cell.val(),
                "address": JSON.stringify(addrArr),
                "Password": add_psw.val()
            };
            if (confirm("再次確認您傳送的資料無誤嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("註冊會員成功！");
                        location.href = "./member_profile.html";
                    } else {
                        let callBackData = JSON.parse(xhr.responseText);
                        if (callBackData.Message == 1) {
                            alert("註冊錯誤：會員帳號（信箱）已註冊過！");
                            add_act.focus();
                        } else if (callBackData.Message == 2) {
                            alert("註冊錯誤：手機號碼已註冊過！");
                            add_cell.focus();
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                            location.reload();
                        };
                    };
                };
                xhr.open('POST', `${URL}MemberUser/AddMember`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            };
        } else {
            alert(errorText);
        };
    });
    // FACEBOOK For Login
    btnWithFaceBook.on('click', function (e) {
        e.preventDefault();
        FACEBOOKLOGIN();
    });
    // GOOGLE For Login
    btnWithGoogle.on('click', function (e) {
        e.preventDefault();
        GOOGLELOGIN();
    });
    // LINE For Login
    btnWithLine.on('click', function (e) {
        e.preventDefault();
        LINELOGIN();
    });
});