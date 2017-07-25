'use strict';
const path = require('path');
const co = require('co');
const _ = require('lodash');
const node_config = require('config');
let config = require('./common/config');

config.set({
    SSO_SERVER: node_config.get('sso.server'),
    SSO_CLIENT: node_config.get('sso.client')
});

/* mongo */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('./models/DB').init();

/* koa */
const Koa = require('koa');
const KoaRouter = require('koa-router');
const server = Koa();
server.keys = ['winter-boom-Editor'];
server.use(require('koa-session')(server));

const SwigRender = require('koa-swig');
server.context.render = SwigRender({
    root: path.join(__dirname, 'views'),
    autoescape: true,
    cache: false,
    ext: 'html'
});

server.use(function *(next) {
    try {
        yield next;
    }catch(e) {
        if(!e) {
            this.body = 'no...';
            return;
        }
        if(e.name == 'NotFoundError') {
            this.status = 404;
            yield this.render('404');
        }else {
            if(e.stack) {
                console.log(e.stack);
            }else {
                console.log(e);
            }
            this.body = '服务器故障,请联络管理员';
        }
    }
});

server.use(require('koa-static-server')({rootDir: 'public', rootPath: '/static'}));

let router = new KoaRouter();
const {SSOMiddleware, SSOCliInit, SSO_API_Client, AuthorizationUtils} = require('koa-sso-auth-cli');
co(function * () {
    yield SSOCliInit({
        default_module: 'editor',
        sso_server: node_config.get('sso.server'),
        sso_api_server: node_config.get('sso.server_api'),
        sso_client: node_config.get('sso.client')
    });
    server.use(SSOMiddleware(server));

    router.get('/', function * () {
        let account = yield SSO_API_Client.getUserInfo(this.session.token);
        this.session.account = account;
        yield this.render('index', {
            account: account,
            config: config.getConfig(),
            modules:
                _.filter(
                    AuthorizationUtils.listHasAuthModules(
                        this.session.account && this.session.account.authorizations.accountAuth
                    ),
                    m => m.id != 'editor'
                )
        });
    });
    server.use(router.routes()).use(router.allowedMethods());

    const styleRouter = require('./routers/style');
    const articleRouter = require('./routers/article');
    const collectionRouter = require('./routers/collection');
    const imageRouter = require('./routers/images').router;
    const wechatRouter = require('./routers/wechat');
    server.use(styleRouter.routes()).use(styleRouter.allowedMethods());
    server.use(articleRouter.routes()).use(articleRouter.allowedMethods());
    server.use(imageRouter.routes()).use(imageRouter.allowedMethods());
    server.use(collectionRouter.routes()).use(collectionRouter.allowedMethods());
    server.use(wechatRouter.routes()).use(wechatRouter.allowedMethods());

    let port = node_config.get('port') || 8877;
    server.listen(port);
    console.log('Editor listening on port ' + port);
}).catch(function (e) {
    console.error(e);
});
