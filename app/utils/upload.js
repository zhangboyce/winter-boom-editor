'use strict';

let body = $('body');

export default function ({name, url, change, success, error, timeout}) {

    let input = $(`<input type="file" id="upFile" accept="image/jpg,image/jpeg,image/png,image/gif" name="${name || 'file'}"/>`).hide().insertAfter(body);
    let iframe = $('<iframe src="javascript:void(0);"></iframe>').hide().appendTo(body)[0];
    let getBody = () => $((iframe.contentDocument || iframe.contentWindow.document).body);

    let extra = {};
    input.change(e => {
        var inputUpFile = document.getElementById("upFile");
        if (inputUpFile.files) {
            let f = inputUpFile.files[0].size / 1024;
            if (f < 1024 * 2) {
                let form = $('<form method="post" enctype="multipart/form-data"></form>');
                let iframeBody = getBody();
                iframeBody.empty();
                form.appendTo(iframeBody);
                form.attr('action', typeof(url) === 'string' ? url : url());
                form.append(input.clone());

                for (let k in extra) {
                    if (extra.hasOwnProperty(k)) {
                        form.append($(`<input type='text' name='${ k }' value='${ extra[k] }'>`));
                    }
                }

                if (change ? change() : true) {
                    form.submit();
                    let checkCount = 0;
                    let checkResult = () => {
                        let result = getBody().text();
                        checkCount++;
                        if (result.startsWith('success:')) {
                            success && success(result.substring(8));
                        } else if (result.startsWith('error:')) {
                            error && error(result.substring(6));
                        } else if (checkCount < 50) {
                            setTimeout(checkResult, 100)
                        } else {
                            timeout && timeout();
                        }
                    };

                    checkResult();
                }

            } else {
                alert("图片不能大于2M");
            }
        }

    });

    return {
        click: function (options) {
            Object.assign(extra, options);
            input.click();
        }
    }
}