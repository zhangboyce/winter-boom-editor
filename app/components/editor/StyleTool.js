import _ from 'lodash';
import ChoosePicManagement from '../picture/ChoosePicManagement';

function StyleTool(editable, options = {}) {
    let setLastSection = options.setLastSection || function () {};

    //初始化 样式工具 提示的插件
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    let lastSection,
        prevSection,
        nextSection;

    let $targetImg, shown = false;
    let choosePicManagement = new ChoosePicManagement();

    let wrapper = $('<div class="style-tool-warpper"></div>');
    let btnGroupLeft = $('<div class="style-tool-btngroup-left"></div>');
    let delBtn = $('<div class="style-operator-btn" data-toggle="tooltip" data-placement="top" title="删除"> <i class="fa fa-trash-o"></i></div>');

    btnGroupLeft.append(delBtn);
    wrapper.append(btnGroupLeft);

    let btnGroupRight = $('<div class="style-tool-btngroup-right"></div>');
    let upBtn = $('<div id="up-btn-editor" class="style-operator-btn" data-toggle="tooltip" data-placement="top" title="上移"> <i class="fa fa-arrow-up"></i></div>');
    let downBtn = $('<div id="down-btn-editor" class="style-operator-btn" data-toggle="tooltip" data-placement="top" title="下移"> <i class="fa fa-arrow-down"></i></div>');
    let addNewBlockBtn = $('<div class="style-operator-btn" data-toggle="tooltip" data-placement="top" title="添空行"> <i class="fa fa-plus"></i></div>');
    let copyBtn = $('<div id="style-copy-btn" class="style-operator-btn" data-toggle="tooltip" data-placement="top" title="复制"> <i class="fa fa-copy"></i></div>');
    let replaceImgBtn = $('<div id="style-replace-img-btn" class="style-operator-btn" data-toggle="tooltip" data-placement="top" title="换图片"> <i class="fa fa-photo"></i></div>');

    btnGroupRight.append(upBtn);
    btnGroupRight.append(downBtn);
    btnGroupRight.append(addNewBlockBtn);
    btnGroupRight.append(copyBtn);
    btnGroupRight.append(replaceImgBtn.hide());
    wrapper.append(btnGroupRight);
    wrapper.insertBefore(editable);

    //删除块
    function removeSection() {
        if (lastSection) {
            lastSection.hide('fast', function () {
                lastSection.remove();
                if (prevSection || nextSection) {
                    setLastSection(prevSection || nextSection);
                } else {
                    wrapper.hide();
                }
            });
        }
    }
    delBtn.click(removeSection);


    //上移块
    upBtn.click(function () {
        if (lastSection) {
            let prevDom = lastSection.prev();
            prevDom.css({"opacity": "0.5"}).animate({top: lastSection.outerHeight(true)});
            lastSection.css({"opacity": "0.5"}).animate({top: -prevDom.outerHeight(true)}, function () {
                lastSection.insertBefore(prevDom).css({top: 0, "opacity": "1"});
                prevDom.css({top: 0, "opacity": "1"});
                setLastSection(lastSection);
            });
        }
    });

    //下移块
    downBtn.click(function () {
        if (lastSection) {
            let nextDom = lastSection.next();
            nextDom.css({"opacity": "0.5"}).animate({top: -lastSection.outerHeight(true)});
            lastSection.css({"opacity": "0.5"}).animate({top: nextDom.outerHeight(true)}, function () {
                lastSection.insertAfter(nextDom).css({top: 0, "opacity": "1"});
                nextDom.css({top: 0, "opacity": "1"});
                setLastSection(lastSection);
            });
        }
    });

    //添加空行块
    addNewBlockBtn.click(function () {
        if (lastSection) {
            lastSection = lastSection.removeClass("winter-section-active");
            let $spaceHtml = $('<section class="winter-section" style="margin-bottom: 5px;">' +
                '<p><br/></p>' +
                '</section>');
            $spaceHtml.insertAfter(lastSection);
            lastSection = $spaceHtml;

            $spaceHtml.click(function () {
                setLastSection($(this));
            });
            setLastSection($spaceHtml);
        }
    });

    //复制块
    copyBtn.click(function () {
        if (lastSection) {
            lastSection = lastSection.removeClass("winter-section-active");
            let inner = lastSection.find('section.winter-section-inner');
            let copyText = (inner || lastSection).html();

            copy('#style-copy-btn', copyText);
        }
    });

    // 替换图片
    replaceImgBtn.click(function() {
        if (!$targetImg) {
            replaceImgBtn.hide();
        } else {
            choosePicManagement.open((imageItem) => {
                if ($targetImg.is('img')) {
                    $targetImg.attr('src', 'http://editor.static.cceato.com/' + imageItem.key);
                } else if ($targetImg.is('section')) {
                    $targetImg.css("background-image", "url(http://editor.static.cceato.com/" + imageItem.key);
                }
            });
        }
    });

    function copy(target, text, callback) {
        function handleCopy(e) {
            e.clipboardData.setData('text/html', text);
            e.clipboardData.setData('text/plain', text);
            e.preventDefault();
        }

        document.addEventListener('copy', handleCopy);
        let clipboard = new Clipboard(target, {
            text: function () {
                return text;
            }
        });

        clipboard.on('success', function (e) {
            callback && callback('success');
            document.removeEventListener('copy', handleCopy);
            e.clearSelection();
            clipboard.destroy();
        });

        clipboard.on('error', function(e) {
            callback && callback('error');
            document.removeEventListener('copy', handleCopy);
            e.clearSelection();
            clipboard.destroy();
        });
    }

    //判断是否有向上的移动图标
    function __hasUpBtnIcon__() {
        let prevDom = lastSection.prev();
        if (prevDom.length < 1) {
            upBtn.hide();
        } else {
            upBtn.show();
        }
    }

    //判断是否有向下的移动图标
    function __hasDownBtnIcon__ () {
        let nextDom = lastSection.next();
        if (nextDom.length < 1) {
            downBtn.hide();
        } else {
            downBtn.show();
        }
    }

    function __hasReplaceImgBtn__() {
        if ($targetImg && !shown) {
            shown = true;
            replaceImgBtn.show();
        } else {
            replaceImgBtn.hide();
        }
    }

    function clickImg($target) {
        $targetImg = $target;
        shown = false;
    }

    //样式工具bar,定位
    function exec(section) {
        lastSection = section;
        prevSection = null;
        nextSection = null;

        let h = 0;
        let sections = editable.find('section.winter-section');
        for (let i = 0; i < sections.length; i++) {
            let s = sections.eq(i);
            if (section[0] == s[0]) {
                if (i < sections.length - 1) {
                    nextSection = sections.eq(i + 1);
                }
                break;
            }
            prevSection = s;
            h = h + (s.outerHeight(true));
        }

        __hasUpBtnIcon__();
        __hasDownBtnIcon__();
        __hasReplaceImgBtn__();

        wrapper.css('top', h + 'px');
        wrapper.show();
    }

    function hide() {
        wrapper.hide();
    }

    return {
        exec,
        hide,
        removeSection,
        copy,
        clickImg
    }
}

export default StyleTool;