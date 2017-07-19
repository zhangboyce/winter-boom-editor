'use strict';
import Component from './Component';
import { isFunction } from '../../common/TypeUtils';

export default class extends Component {

    __handleLogout__() {
        if (window.confirm("确定退出编辑器?")) {
            let auth_callback = encodeURIComponent(window.config['SSO_CLIENT'] + '/api/getToken');
            window.location.href =  window.config['SSO_SERVER'] + '/api/user/logout?auth_callback=' + auth_callback;
        }
    }

    render() {
        let account = window.account || {};
        let modules = window.modules || [];

        let menus = [];
        menus.push(new DropdownMenu({ name: '个人设置', href: window.config['SSO_SERVER'] + '/userCenter/info', icon: 'fa icon-users' }));
        menus.push(new DropdownMenu({ name: '修改密码', href: window.config['SSO_SERVER'] + '/userCenter/account', icon: 'fa fa-gear' }));
        menus.push('<li class="divider"></li>');
        modules.forEach(module => {
            menus.push(new DropdownMenu({ name: module.name, href: module.host, icon: module.icon }))
        });
        menus.push('<li class="divider"></li>');
        menus.push(new DropdownMenu({ name: '退出', icon: 'fa icon-logout', onClick: this.__handleLogout__ }));

        let $dropdownMenu = $('<ul class="dropdown-menu">');
        menus.forEach(menu => {
            $dropdownMenu.append(menu.render ? menu.render(): menu);
        });

        let $avatar = $(`<a data-toggle="dropdown" class="ripple" href="javascript:;" aria-expanded="false">
                            <span style="color: #ffffff;">
                                <img class="avatar" width="30px" height="30px" src="${ 'http://boom-static.static.cceato.com/boom/imgs/avatars/' + (account.avatar || '01.png') }"/>
                                &nbsp;${ account.nickname || account.username }
                            </span>
                        </a>`);

        let $li = $('<li>')
            .append($avatar)
            .append($dropdownMenu);

        let $ul = $(`<ul class="nav navbar-nav navbar-right hidden-xs" style="margin-right: 30px"></ul>`)
            .append($li);

        return $(`<div class="row header"></div>`).append($ul);
    }
}

class DropdownMenu extends Component {
    render() {
        let { href, icon, name, onClick } = this.props;
        let menu = $(
            `<li role="presentation">
                <a role="menuitem" tabindex="-1" class="dropdown-menu-list" href=${ href || 'javascript:;' } target="_blank">
                    <i class=${ icon }></i>
                    ${ name }
                </a>
            </li>`
        );
        if (onClick && isFunction(onClick)) {
            menu.click(function () {
                onClick();
            });
        }
        return menu;
    }
}