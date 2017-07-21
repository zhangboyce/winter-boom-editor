'use strict';
import _ from 'lodash';
import modal from '../../utils/modal'
import * as projectTypes from '../../../common/ProjectTypes';
import FileUrlUtil from '../../../common/FileUrlUtil';

import Component from './../Component';

export default class extends Component {



    __getCollectionList__ = callback => {
        $.getJSON('/collection/list', list => {
            callback(list);
        });
    };





    render() {

        this.__getCollectionList__(list => {
            list.forEach(c => {

                let card = $(`<div class="card bg-white card-simple">
                    <img src="" class="card-img-top img-responsive" style="display: block;"/>
                    <div class="card-block">
                        <h4 title="${c.title}" class="card-title content-title">${c.title}</h4>
                        <p title="${c.desc}" class="card-text content-desc">${c.desc}</p>
                    </div>
                </div>`).css({
                    cursor: 'pointer'
                })

                card.appendTo($collectionList);

            });
        });


        let $collectionList = $(`<div class="col col-md-12 collection-list-container"></div>`);
        return $collectionList;
    }
}