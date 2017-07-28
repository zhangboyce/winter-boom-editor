'use strict';
import Component from './Component';
import { isFunction } from '../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
    }

    __handleLogout__ = () => {
        this.confirm("确定退出编辑器?", () => {
            let auth_callback = encodeURIComponent(window.config['SSO_CLIENT'] + '/api/getToken');
            window.location.href =  window.config['SSO_SERVER'] + '/api/user/logout?auth_callback=' + auth_callback;
        });
    };

    rendered = () => {
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

        let $dropdownMenu = this.find('ul.dropdown-menu');
        menus.forEach(menu => {
            if (menu instanceof Component) {
                menu = menu.rendered();
            }
            $dropdownMenu.append(menu);
        });
    };

    render() {
        let account = window.account || {};

        return $(`
            <div class="row header">
                <ul class="nav navbar-nav navbar-right hidden-xs" style="margin-right: 30px">
                    <li>
                        <a data-toggle="dropdown" class="ripple" href="javascript:;" aria-expanded="false">
                            <span class="imgwarp">
                                <img class="avatar" width="30px" height="30px" src="${ 'http://boom-static.static.cceato.com/boom/imgs/avatars/' + (account.avatar || '01.png') }"/>
                                &nbsp;${ account.nickname || account.username }
                            </span>
                        </a>
                        <ul class="dropdown-menu"></ul>
                    </li>
                </ul>
            </div>`
        );
    }
}

class DropdownMenu extends Component {

    constructor(props) {
        super(props);
        this.rendered();
    }

    rendered() {
        let onClick = this.onClick;
        if (onClick && isFunction(onClick)) {
            this.click(() => {
                onClick();
            });
        }
    }

    render() {
        let { href, icon, name, } = this;
        return $(
            `<li role="presentation">
                <a role="menuitem" tabindex="-1" class="dropdown-menu-list" href=${ href || 'javascript:;' } target="_blank">
                    <i class=${ icon }></i>
                    ${ name }
                </a>
            </li>`
        );
    }
}