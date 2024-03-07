// 宣告要帶入的欄位
let faqs = $('.faqs');
let add_qst = $('.add_qst'), add_ans = $('.add_ans');
let btnAddQas = $('.btnAddQas');
// 驗證
function dataUpdateCheck(aId, contentz1, contentz2, sort) {
    if (aId.trim() === '') {
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    }
    if (contentz1.val() === '') {
        contentz1.focus();
        return check = false, errorText = '請確認問題的內容是否有確實填寫！';
    }
    if (contentz2.val() === '') {
        contentz2.focus();
        return check = false, errorText = '請確認答案的內容是否有確實填寫！';
    }
    if (sort !== "") {
        if (sort.val() === '' || NumberRegExp.test(sort.val()) === false) {
            sort.focus();
            return check = false, errorText = '請確認排序是否有確實填寫（只能填寫數字）！';
        } else {
            return check = true, errorText = "";
        }
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            let callBackData = JSON.parse(xhr.responseText);
            console.log(callBackData)
            if (callBackData !== "") {
                html = "";
                for (let i = 0; i < callBackData.length; i++) {
                    html += `
                        <div class="card" data-num="${callBackData[i].id}">
                            <div class="card-header">
                                <div class="form-group d-flex justify-content-between align-items-center">
                                    <h4 class="text-info mb-0 faqNum"">
                                        <span>問答編號 ${callBackData[i].id}</span>
                                    </h4>
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input edit_status inputStatus" id="${callBackData[i].id}faqStatus${i}" value="${callBackData[i].Enabled}" disabled>
                                        <label class="custom-control-label" for="${callBackData[i].id}faqStatus${i}">開啟</label>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <div class="input_wrap d-flex flex-column">
                                        <div class="form-group d-flex align-self-end">
                                            <label class="mr-2 col-form-label">排序</label>
                                            <input type="text" class="form-control text-right edit_sort inputStatus" value="${callBackData[i].Sort}" disabled>
                                        </div>
                                        <div class="form-group">
                                            <input type="text" class="form-control edit_qst inputStatus" placeholder="問題" value="${callBackData[i].Question}" disabled>
                                            <textarea type="text" class="form-control mt-2 edit_ans inputStatus" placeholder="回答" disabled>${callBackData[i].Answer}</textarea>
                                        </div>    
                                    </div>
                                    <div class="form-group">
                                        <div class="setupBlock">
                                            <a class="btn btn-sm btn-warning btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                faqs.html(html);
                // FAQ 狀態顯示
                let chk = $('.edit_status');
                for (let i = 0; i < chk.length; i++) {
                    if (chk.eq(i).val() == "1") {
                        chk.eq(i).prop('checked', true);
                    } else {
                        chk.eq(i).prop('checked', false);
                    };
                };
                // Edit
                $(document).on('click', '.btnEdit', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let trz = $(this).parents('.card');
                    if ($('.setupBlock').hasClass('active')) {
                        alert('請確認是否有其他問答尚未儲存！');
                    }
                    else {
                        trz.find('.setupBlock').addClass('active').html('').append(`
                            <a class="btn btn-success btn-sm btnSave" href="#"><i class="far fa-edit"></i> 存儲</a> 
                            <a class="btn btn-danger btn-sm btnDel" href="#"><i class="fas fa-trash"></i> 刪除</a>
                            <a class="btn btn-sm btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                        `);
                        // 原資料
                        let orgStatus = trz.find('.edit_status').val(), orgSort = trz.find('.edit_sort').val(), orgQuestions = trz.find('.edit_qst').val(), orgAsked = trz.find('.edit_ans').val();
                        // Input Enable
                        trz.find('.inputStatus').prop('disabled', false);

                        // Save 儲存
                        $('.btnSave').on('click', function () {
                            let trz = $(this).parents('.card');
                            let id = trz.data('num');
                            // 驗證
                            dataUpdateCheck(idz, trz.find('.edit_qst'), trz.find('.edit_ans'), trz.find('.edit_sort'));
                            if (check == true) {
                                let dataObj = {
                                    "Id": id,
                                    "Question": trz.find('.edit_qst').val(),
                                    "Answer": trz.find('.edit_ans').val(),
                                    "Sort": trz.find('.edit_sort').val(),
                                    "Enabled": trz.find('.edit_status').val(),
                                };
                                if (confirm("您確定要新增這一則問答嗎？")) {
                                    let xhr = new XMLHttpRequest();
                                    xhr.onload = function () {
                                        if (xhr.status == 200 || xhr.status == 204) {
                                            alert("修改問答成功！");
                                            location.reload();
                                        } else {
                                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                            // getLogout();
                                        };
                                    };
                                    xhr.open('PUT', `${URL}QA/${id}`, true);
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(dataObj));
                                }
                            } else {
                                alert(errorText);
                            };
                        });
                        // Delete 刪除  
                        $('.btnDel').on('click', function (e) {
                            e.preventDefault(); // 取消 a 預設事件
                            let id = $(this).parents('.card').data('num');
                            let dataObj = {
                                "id": id
                            };
                            if (confirm("您確定要刪除這則問答嗎？")) {
                                let xhr = new XMLHttpRequest();
                                xhr.onload = function () {
                                    if (xhr.status == 200 || xhr.status == 204) {
                                        alert("刪除問答成功！");
                                        location.reload();
                                    } else {
                                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                        // getLogout();
                                    };
                                };
                                xhr.open('DELETE', `${URL}QA/${id}`, true)
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.send($.param(dataObj));
                            }
                        });
                        // Cancel
                        $('.btnCancel').on('click', function (e) {
                            e.preventDefault();
                            let trz = $(this).parents('.card');
                            if (confirm("尚未儲存更改的內容，確定要取消嗎？")) {
                                // 還原欄位資料
                                trz.find('.edit_status').val(orgStatus), trz.find('.edit_sort').val(orgSort), trz.find('.edit_qst').val(orgQuestions), trz.find('.edit_ans').val(orgAsked);
                                if (trz.find('.edit_status').val() == "1") {
                                    trz.find('.edit_status').prop('checked', true);
                                } else {
                                    trz.find('.edit_status').prop('checked', false);
                                };
                                // 轉為編輯按鈕
                                trz.find('.setupBlock').removeClass('active').html('').append(`
                                    <a class="btn btn-sm btn-warning btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                                `);
                                // 權限欄位的禁用、啟用
                                trz.find('.inputStatus').prop('disabled', true);
                            }
                        });
                    };
                });
                // 分類狀態控制
                $(document).on('change', '.edit_status', function () {
                    if ($(this).prop('checked') == true) {
                        $(this).val("1");
                    } else {
                        $(this).val("0");
                    }
                });
            }
        } else {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            // getLogout();
        };
    };
    xhr.open('GET', `${URL}QA`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
    // Add 新增
    btnAddQas.on('click', function () {
        // 驗證
        dataUpdateCheck(idz, add_qst, add_ans, "");
        if (check == true) {
            let dataObj = {
                "Question": add_qst.val(),
                "Asked": add_ans.val(),
                "Sort": faqs.find('.card').length + 1,
                "Enabled": 0
            };
            if (confirm("您確定要新增這一則問答嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 201) {
                        alert("新增問答成功！");
                        location.reload();
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        // getLogout();
                    };
                };
                xhr.open('POST', `${URL}QA`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            }
        } else {
            alert(errorText);
        };
    });
});