'use strict';

let body = $('body');

export default function ({name, url, success, error, timeout, multiple = false }) {

    let input = $(`<input type="file" id="upFile" accept="image/jpg,image/jpeg,image/png,image/gif" name="${name || 'file'}"/>`).hide().insertAfter(body);
    if (multiple) input.attr('multiple', 'multiple');

    let iframe = $('<iframe src="javascript:void(0);"></iframe>').hide().appendTo(body)[0];
    let getBody = () => $((iframe.contentDocument || iframe.contentWindow.document).body);

    let extra = {};
    input.change(e => {
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

        form.submit(() => {
            var inputUpFile = document.getElementById("upFile");
            let files = inputUpFile.files;
            if (files.length < 1) return false;

            let ok = true;
            for (let file of files) {
                if (file.size >= 1024 * 1024 * 2) {
                    alert('很抱歉,不能上传大于2M的图片');
                    ok = false;
                }
            }
            return ok;
        });

        form.submit();
        let checkCount = 0;
        let checkResult = () => {
            let text = getBody().text();
            let result = {};
            if (text && text.trim()) {
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    console.error(e);
                }
            }
            if (result.status == 'ok') {
                input.val('');
                success && success(result.keys);
            } else if (result.status == 'error') {
                input.val('');
                error && error();
            }else if (checkCount < 50) {
                setTimeout(checkResult, 100)
            } else {
                input.val('');
                timeout && timeout();
            }
        };
        checkResult();
    });

    return {
        click: function (options) {
            Object.assign(extra, options);
            input.click();
        }
    }
}