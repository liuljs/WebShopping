// 宣告要帶入的欄位
let get_name = $('.companyName'), get_uId = $('.get_uId'), get_prl = $('.get_prl'), get_tel = $('.get_tel'), get_cell = $('.get_cell'), get_add = $('.get_add'), get_mail = $('.get_mail'), get_merId = $('.get_merId'), get_terId = $('.get_terId');
// 驗證
function dataUpdateCheck(aId, id, prl, tel, cell, addr, mail) {
    if (aId.trim() === '' || id.trim() === '' || prl.val().trim() === '') {
        prl.focus();
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    }
    if (tel.val().trim() === '' || PhoneRegExp.test(tel.val()) === false) {
        tel.focus();
        return check = false, errorText = '請確認電話有確實填寫、格式是否正確！';
    }
    if (cell.val().trim() === '' || CellRegExp.test(cell.val()) === false) {
        cell.focus();
        return check = false, errorText = '請確認手機有確實填寫、或格式是否正確！';
    }
    if (addr.val().trim() === '') {
        addr.focus();
        return check = false, errorText = '請確認地址有確實填寫！';
    }
    if (mail.val().trim() === '' || EmailRegExp.test(mail.val()) === false) {
        mail.focus();
        return check = false, errorText = '請確認信箱有確實填寫、或格式是否正確！';
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    //
    let dataObj = {
        "Methods": "POST",
        "APIs": URL,
        "CONNECTs": "Company/Get",
        "QUERYs": "",
        "Sends": "",
        "Counts": ""
    }
    getPageDatas(dataObj).then(res => {
        if (res.Result == 'OK') {
            // 將取得的資料帶入在面中（動態產生）
            get_name.text(res.Content[0].NAME);
            get_uId.text(res.Content[0].UID);
            get_prl.val(res.Content[0].PRINCIPAL);
            get_tel.val(res.Content[0].TEL);
            get_cell.val(res.Content[0].CELL_PHONE);
            get_add.val(res.Content[0].ADDRESS);
            get_mail.val(res.Content[0].EMAIL);
            get_merId.text(res.Content[0].MERCHANT_ID);
            get_terId.text(res.Content[0].TERMINAL_ID);
            // Edit 編輯
            $(document).on('click', '.btnEdit', function (e) {
                e.preventDefault(), e.stopPropagation();
                let trz = $(this).parents('.card');
                // Setup
                trz.find('.setupBlock').html('').append(`
                    <a class="btn btn-sm btn-success btnConfirm" href="#"><i class="fal fa-save"></i> 儲存</a>
                    <a class="btn btn-sm btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                `);
                // 原資料
                let orgObj = res.Content[0];
                // Input Enable 
                trz.find('.inputStatus').prop('disabled', false);
                // Confirm 確認修改資料
                trz.find('.btnConfirm').on('click', function (e) {
                    e.preventDefault();
                    // 驗證
                    dataUpdateCheck(idz, res.Content[0].ID, get_prl, get_tel, get_cell, get_add, get_mail);
                    if (check == true) {
                        let dataObj = {
                            "account_id": idz,
                            "id": res.Content[0].ID,
                            "principal": get_prl.val(),
                            "tel": get_tel.val(),
                            "cell_phone": get_cell.val(),
                            "address": get_add.val(),
                            "email": get_mail.val()
                        };
                        if (confirm("您確定要更改基本資料嗎？")) {
                            let xhr = new XMLHttpRequest();
                            xhr.onload = function () {
                                if (xhr.status == 200) {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    if (callBackData.Result == "OK") {
                                        alert('修改成功！');
                                        location.reload();
                                    } else {
                                        alert(callBackData.Content);
                                    };
                                } else {
                                    alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                };
                            };
                            xhr.open('POST', `${URL}Company/Update`, true);
                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                            xhr.send($.param(dataObj));
                        };
                    } else {
                        alert(errorText);
                    };
                });
                // Cancel 取消
                trz.find('.btnCancel').on('click', function (e) {
                    e.preventDefault();
                    let trz = $(this).parents('.card');
                    if (confirm("您尚未儲存內容，確定要取消嗎？")) {
                        // 還原資料
                        get_name.text(orgObj.NAME);
                        get_uId.text(orgObj.UID);
                        get_prl.val(orgObj.PRINCIPAL);
                        get_tel.val(orgObj.TEL);
                        get_cell.val(orgObj.CELL_PHONE);
                        get_add.val(orgObj.ADDRESS);
                        get_mail.val(orgObj.EMAIL);
                        get_merId.text(orgObj.MERCHANT_ID);
                        get_terId.text(orgObj.TERMINAL_ID);
                        // 轉為編輯按鈕
                        trz.find('.setupBlock').html('').append(`
                            <a class="btn btn-sm btn-warning btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                        `);
                        // 權限欄位的禁用、啟用
                        trz.find('.inputStatus').prop('disabled', true);
                    }
                });
            });
        };
    }, rej => {
        getLogout();
    });
});