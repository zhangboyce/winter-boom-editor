'use strict';

let body = $('body');

export default function ({name, url, success, error, timeout}) {

    let input = $(`<input type="file" id="upFile" accept="image/jpg,image/jpeg,image/png,image/gif" multiple="multiple" name="${name || 'file'}"/>`).hide().insertAfter(body);
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
                    alert('图片不能大于2M');
                    ok = false;
                }
            }
            return ok;
        });

        form.submit();
        let checkCount = 0;
        let checkResult = () => {
            let result = getBody().text();
            if (result.indexOf('ok') != -1) {
                success && success(result.item);
            } else if (result.indexOf('error') != -1) {
                error && error();
            } else if (checkCount < 50) {
                setTimeout(checkResult, 100)
            } else {
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