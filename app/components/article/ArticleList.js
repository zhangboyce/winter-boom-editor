'use strict';
import _ from 'lodash';
import Component from './../Component';

let articleList;

export default class extends Component {



    __getArticleList__ = callback => {
        $.getJSON('/article/list', result => {
            let list = result.list;
            articleList = list;
            callback(articleList);
        });
    };

     __buildTitle__ = title => {
        return $(`<div class="title">${title}</div>`).css({
            width: '100%',
            height: '30px',
            color: '#fff',
            position: 'absolute',
            bottom: 0,
            padding: '0 5px',
            overflow: 'hidden',
            'background-color': 'rgba(33, 34, 35, 0.7)',
            'text-align': 'center',
            'line-height': '30px'
        });
    };



    render() {


        let $articleList = $(`<div class=" col col-md-12 article-list-container"></div>`);
        let $btnHeader = $('<div class="header-content"></div>');
        let $bodyContent = $('<div class="body-content"></div>');
        $articleList.append($btnHeader);
        $articleList.append($bodyContent);

        let $btnArea = $('<div class="sync-article-btn">同步文章</div>');
        $btnHeader.append($btnArea);

        this.__getArticleList__(articleList => {
            articleList.forEach(list => {
                let $li =  $(`<div id="article_${list._id}"></div>`).css({
                    display: 'block',
                    cursor: 'pointer',
                    width:'86%',
                    height: '100px',
                    position: 'relative',
                    'margin-left': '7%',
                    'margin-bottom': '7px',
                    'border-bottom': '1px solid #ebebe7',
                    'background': `rgba(0, 0, 0, 0) url("${list.cover || 'http://boom-static.static.cceato.com/images/shirt.png'}") no-repeat scroll center center / cover`
                })
                    .appendTo($bodyContent)
                    .append(this.__buildTitle__(list.title));
            });
        });

        return $articleList;


    }
}