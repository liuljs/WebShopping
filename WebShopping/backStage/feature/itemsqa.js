// 宣告要帶入的欄位
let ansTime, answer;
let qas = $('.qas');
// 取得全部
let dataObj = {
    "spu_id": ""
};
// 驗證
function dataUpdateCheck(aId, content) {
    if (aId.trim() === '') {
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    }
    if (content.val().trim() === '') {
        content.focus();
        return check = false, errorText = '請確認此客服問題的回答有確實填寫！';
    }
};
$().ready(function () {

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            if (xhr.responseText !== "") {
                let callBackData = JSON.parse(xhr.responseText);
                console.log(callBackData)
                html = "";
                for (let i = 0; i < callBackData.length; i++) {
                    answer = "";
                    if (callBackData[i].answer !== "" && callBackData[i].answer !== null) {
                        answer = `${callBackData[i].answer}`;
                    } else {
                        answer = ``;
                    }
                    ansTime = "";
                    if (callBackData[i].updated_at !== "" && callBackData[i].updated_at !== null) {
                        ansTime = `
                            <div>
                                <span class="mr-1">${callBackData[i].updated_at.split(' ')[0]} </span>
                                <span>${callBackData[i].updated_at.split(' ')[1]} </span>
                                <span class="text-success ml-2">回覆</span>
                            </div>
                        `;
                    } else {
                        ansTime = `<span class="text-danger">尚未回覆</span>`
                    }
                    html += `
                        <div class="col-xl-6">
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-wrap itemQa">
                                        <table>
                                            <tbody>
                                                <tr data-num="${callBackData[i].id}">
                                                    <td data-title="產品編號">${callBackData[i].spu_id}</td>
                                                    <td class="memberAcc" data-title="會員帳號">${callBackData[i].account}</td>
                                                    <td class="item-qaContent">
                                                        <div class="d-flex align-items-center justify-content-between">
                                                            <label class="col-form-label py-0">留言狀態</label>
                                                            <div class="custom-control custom-switch">
                                                                <input type="checkbox" class="custom-control-input inputStatus edit_status" id="qaStatus" value="${callBackData[i].Is_View}" disabled>
                                                                <label class="custom-control-label" for="qaStatus">開啟</label>
                                                            </div>
                                                        </div>
                                                        <div class="dropdown-divider"></div>
                                                        <div>
                                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                                <div>發問時間：</div>
                                                                <div>
                                                                    <span class="mr-1">${callBackData[i].created_at.split(' ')[0]}</span>
                                                                    <span>${callBackData[i].created_at.split(' ')[1]}</span>
                                                                    <span class="text-secondary ml-2">發問</span>
                                                                </div>
                                                            </div>
                                                            <div class="item-question">${callBackData[i].quection}</div>    
                                                        </div>
                                                        <div class="dropdown-divider mt-2 mb-3"></div>
                                                        <div>
                                                            <div class="d-flex align-items-center justify-content-between mb-1 ansTime"><div>回答時間：</div>${ansTime}</div>
                                                            <textarea class="form-control editInput inputStatus edit_answer" disabled>${answer}</textarea>
                                                        </div>
                                                    </td>
                                                    <td class="setup">
                                                        <div class="setupBlock"></div> 
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>    
                                    </div>
                                </div>
                            </div>
                        </div>                  
                    `;
                }
                qas.html(html);
                // 顯示編輯功能
                if (menuAuth[authParent.indexOf("PM")].ACT_EDT == "Y") {
                    $('.setup .setupBlock').append(`
                        <a class="btn btn-warning btn-sm btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                    `);
                    // 留言的狀態顯示
                    let chk = $('.edit_status');
                    for (let i = 0; i < chk.length; i++) {
                        if (chk.eq(i).val() == "1") {
                            chk.eq(i).prop('checked', true);
                        } else {
                            chk.eq(i).prop('checked', false);
                        };
                    };
                    // 留言的狀態控制
                    $('.edit_status').on('change', function () {
                        if ($(this).prop('checked') == true) {
                            $(this).val("1");
                        } else {
                            $(this).val("0");
                        }
                    });
                    // Edit
                    $(document).on('click', '.btnEdit', function (e) {
                        e.preventDefault(); // 取消 a 預設事件
                        e.stopPropagation(); // 取消冒泡 Bubble 事件
                        let trz = $(this).parents('tr'); // 宣告當下欄位

                        if ($('td.setup').hasClass('active')) {
                            alert('請確認是否有欄位尚未儲存！');
                        } else {
                            // 點擊編輯後 -> 1.啟用欄位的編輯 2.動態產生儲存、刪除
                            trz.find('.inputStatus').prop('disabled', false);
                            // 顯示刪除功能 （未）
                            {
                                // if (menuAuth[authParent.indexOf("PM")].ACT_DEL == "Y") {
                                //     trz.find('.setup').addClass('active').find('.setupBlock').html('').append(`
                                //         <a class="btn btn-success btn-sm btnSave" href="#"><i class="far fa-edit"></i> 存儲</a> 
                                //         <a class="btn btn-danger btn-sm btnDel" href="#"><i class="fas fa-trash"></i> 刪除</a>
                                //         <a class="btn btn-sm btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                                //     `);
                                //     // Delete
                                //     trz.find('.btnDel').on('click', function (e) {
                                //         e.preventDefault(); // 取消 a 預設事件
                                //         e.stopPropagation(); // 取消冒泡 Bubble 事件

                                //         let trz = $(this).parents('tr');
                                //         let id = trz.find('.order-num').text();
                                //         if (confirm("確定要刪除此問答留言嗎")) {
                                //             let dataObj = {
                                //                 "id": id,
                                //             };
                                //             let xhr = new XMLHttpRequest();
                                //             xhr.onload = function () {
                                //                 if (xhr.status == 200) {

                                //                 } else {
                                //                     // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                                //                     // getLogout();
                                //                 };
                                //             };
                                //             xhr.open('POST', `${URL}`, true);
                                //             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                //             xhr.send($.param(dataObj));
                                //         }
                                //     });
                                // } else {
                                //     trz.find('.setup').addClass('active').find('.setupBlock').html('').append(`
                                //         <a class="btn btn-success btn-sm btnSave" href="#"><i class="far fa-edit"></i> 存儲</a> 
                                //         <a class="btn btn-sm btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                                //     `);
                                // };
                            };
                            trz.find('.setup').addClass('active').find('.setupBlock').html('').append(`
                                <a class="btn btn-success btn-sm btnSave" href="#"><i class="fal fa-save"></i> 存儲</a> 
                                <a class="btn btn-sm btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                            `);
                            // 原資料
                            let orgStatus = trz.find('.edit_status').val(), orgAns = trz.find('.edit_answer').val();
                            // Save
                            trz.find('.btnSave').on('click', function (e) {
                                e.preventDefault(); // 取消 a 預設事件
                                e.stopPropagation(); // 取消冒泡 Bubble 事件
                                let num = trz.data('num');
                                let ans = trz.find('.edit_answer');
                                let status = trz.find('.edit_status')
                                dataUpdateCheck(idz, ans);
                                if (check == true) {
                                    let dataObj = {
                                        "id": num,
                                        "answer": ans.val(),
                                        "Is_View": status.val(),
                                    };
                                    if (confirm("確定要儲存這筆客服的回答嗎？")) {
                                        let xhr = new XMLHttpRequest();
                                        xhr.onload = function () {
                                            if (xhr.status == 200) {
                                                alert('儲存成功！');
                                                location.reload();
                                            } else {
                                                alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                                            };
                                        };
                                        xhr.open('PUT', `${URL}ProductAdmin/Answer`, true);
                                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                        xhr.send($.param(dataObj));
                                    };
                                } else {
                                    alert(errorText);
                                };
                            });
                            // Cancel
                            trz.find('.btnCancel').on('click', function (e) {
                                e.preventDefault(), e.stopPropagation(); // 取消冒泡 Bubble 事件  取消 a 預設事件
                                if (confirm("尚未儲存更改的內容，確定要取消嗎？")) {
                                    // 還原欄位資料
                                    trz.find('.edit_status').val(orgStatus), trz.find('.edit_answer').val(orgAns);
                                    if (trz.find('.edit_status').val() == "1") {
                                        trz.find('.edit_status').prop('checked', true);
                                    } else {
                                        trz.find('.edit_status').prop('checked', false);
                                    };
                                    // 轉為編輯按鈕
                                    trz.find('.setup').removeClass('active').find('.setupBlock').html('').append(`
                                        <a class="btn btn-sm btn-warning btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                                    `);
                                    // 權限欄位的禁用、啟用
                                    trz.find('.inputStatus').prop('disabled', true);
                                }
                            });
                        };
                    });
                }
            } else {
                html = "";
                html = `
                <div class="col-xl-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="table-wrap itemQa">
                                <table>
                                    <tbody>
                                        <tr class="none">
                                            <td>
                                                <span>目前沒有任何的客服問答。</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>    
                            </div>
                        </div>
                    </div>
                </div>  
                `;
                qas.html(html);
            };
        } else {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            // getLogout();
        };
    };
    xhr.open('POST', `${URL}ProductAdmin/GetProductsQnA`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send($.param(dataObj));
});