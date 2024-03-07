// PROFILE
let edit_act = $('.edit_act'), edit_cstName = $('.edit_cstName'), edit_gender = $('.edit_gender'), edit_birth = $('.edit_birth'), edit_cell = $('.edit_cell'), edit_addr = $('.edit_addr');
let addrs, gender;
let addrArr = new Array();
let btnSave = $('.btnSave'), btnLogout = $('.btnLogout');
// 驗證
function dataUpdateCheck(act, name, birth, cell) {
    if (act.val().trim() === '' || EmailRegExp.test(act.val().trim()) === false) {
        act.focus();
        return check = false, errorText = '請確認帳號（Email）是否確實填寫，或格式是否正確！';
    }
    if (name.val().trim() === '') {
        name.focus();
        return check = false, errorText = '請確認會員姓名是否確實填寫，或格式是否正確！';
    }
    if (birth.val().trim() === '' || birth.val() === '0001-01-01') { // 預設日期的格式 0001-01-01
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
// 接收資料，做渲染、處理
function process(data) {
    edit_act.val(data.Account);
    edit_cstName.val(data.Name);
    $(`.edit_gender[value="${data.Gender}"]`).prop('checked', true);
    edit_birth.val(dateChange(data.Birthday));
    edit_cell.val(data.Phone);
    // Set Address
    if (data.Address !== "") {
        let addrArr = JSON.parse(data.Address);
        $('.edit_twZipCode').twzipcode('set', {
            'zipcode': addrArr[0],
            'county': addrArr[1],
            'district': addrArr[2]
        });
        edit_addr.val(addrArr[3]);
    };
};
// NOTFOUND
function fails() { };
$().ready(function () {
    //
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `MemberUser`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    //
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            process(res);
        } else {
            fails();
        };
    }, rej => {
        if (rej == "NOTFOUND") {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            getLogout();
        };
    });

    // 修改資料
    btnSave.on('click', function (e) {
        e.preventDefault();
        // twzipcode 取值
        addrArr = [];
        $('.edit_twZipCode').twzipcode('get', function (county, district, zipcode) {
            if (county !== "") {
                addrArr.push(county);
                if (district !== "") {
                    addrArr.unshift(zipcode);
                    addrArr.push(district);
                };
            };
            return addrArr;
        });
        if (edit_addr.val() !== "") {
            addrArr.push(edit_addr.val());
        };
        // 驗證
        dataUpdateCheck(edit_act, edit_cstName, edit_birth, edit_cell);
        if (check == true) {
            let dataObj = {
                "account": edit_act.val(),
                "name": edit_cstName.val(),
                "gender": $('.edit_gender:checked').val(), // 已選擇的 radio 值
                "birthday": edit_birth.val(),
                "phone": edit_cell.val(),
                "address": JSON.stringify(addrArr)
            };
            if (confirm("再次確認您傳送的資料無誤？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("修改資訊成功！");
                        location.reload();
                    } else {
                        let callBackData = JSON.parse(xhr.responseText)
                        if (callBackData.Message == "RepeatPhone") {
                            alert("修改錯誤：手機號碼已存在！");
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                            location.reload();
                        };
                    };
                };
                xhr.open('PUT', `${URL}MemberUser`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            }
        } else {
            alert(errorText);
        };
    });
    // 登出
    btnLogout.on('click', function (e) {
        getLogout();
    });
});