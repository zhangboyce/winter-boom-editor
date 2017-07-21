import _ from 'lodash';

function StyleTool(editable, options = {}) {

    //初始化 样式工具 提示的插件
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    let lastSection, prevSection, nextSection;
    let wrapper = $('<div class="style-tool-warpper"></div>');
    let btnGroupLeft = $('<div class="style-tool-btngroup-left"></div>');
    let delBtn = $('<div class="style-delete-btn" data-toggle="tooltip" data-placement="top" title="删除"> <i class="fa fa-trash-o"></i></div>');

    let setLastSection = options.setLastSection || function () {
        };

    btnGroupLeft.append(delBtn);
    wrapper.append(btnGroupLeft);

    let btnGroupRight = $('<div class="style-tool-btngroup-right"></div>');
    let upBtn = $('<div id="up-btn-editor" class="style-up-btn" data-toggle="tooltip" data-placement="top" title="上移"> <i class="fa fa-arrow-up"></i></div>');
    let downBtn = $('<div id="down-btn-editor" class="style-down-btn" data-toggle="tooltip" data-placement="top" title="下移"> <i class="fa fa-arrow-down"></i></div>');
    let addNewBlockBtn = $('<div class="style-add-new-block-btn" data-toggle="tooltip" data-placement="top" title="添空行"> <i class="fa fa-plus"></i></div>');
    let copyBtn = $('<div id="style-copy-btn" class="style-copy-btn" data-toggle="tooltip" data-placement="top" title="复制"> <i class="fa fa-copy"></i></div>');

    btnGroupRight.append(upBtn);
    btnGroupRight.append(downBtn);
    btnGroupRight.append(addNewBlockBtn);
    btnGroupRight.append(copyBtn);
    wrapper.append(btnGroupRight);

    wrapper.insertBefore(editable);


    //删除块的方法
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

    //删除块
    delBtn.click(removeSection);


    //上移块
    upBtn.click(function () {
        if (lastSection) {

            let prevDom = lastSection.prev();
            let prevTop = prevDom.position().top;
            let lastSectionTop = lastSection.position().top;

            let nowDom = lastSection.insertBefore(prevDom).css({"opacity":"0.5" });
            nowDom.animate({
                opacity:1
            }, 1200);

            prevDom.css({"opacity":"0.5" }).animate({
                opacity:1
            }, 1200);


            setLastSection(nowDom);
        }
    });

    //下移块
    downBtn.click(function () {
        if (lastSection) {
            let nextDom = lastSection.next();
            let nowDom = lastSection.insertAfter(nextDom).css("opacity","0.2");
            nowDom.animate({
                opacity:1
            },1500);
            setLastSection(nowDom);
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
            let copyText = lastSection.html();

            copy('#style-copy-btn', copyText);
        }
    });

    function copy(target, text) {
        function handleCopy(e) {
            e.clipboardData.setData('text/html', text);
            e.clipboardData.setData('text/plain', text);
            e.preventDefault();
        }

        document.addEventListener('copy', handleCopy);
        let clipboardHtml = new Clipboard(target, {
            text: function () {
                return text;
            }
        });

        clipboardHtml.on('success', function (e) {
            document.removeEventListener('copy', handleCopy);
            e.clearSelection();
            clipboardHtml.destroy();
        });
    }

    //样式工具bar,定位
    function exec(section, attributes) {
        lastSection = section;
        let h = 0;
        prevSection = null, nextSection = null;
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
        copy
    }
}

export default StyleTool;