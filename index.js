addEventListener('fetch', (event) => {
    return event.respondWith(handleRequest(event.request));
})

const handleRequest = async (request) => {
    const render = (body) => {
        return new Response(`

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no" />
    <title>T.CN 短链接</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mdui@0.4.1/dist/css/mdui.min.css"
        integrity="sha256-lCFxSSYsY5OMx6y8gp8/j6NVngvBh3ulMtrf4SX5Z5A=" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/mdui@0.4.1/dist/js/mdui.min.js"
        integrity="sha256-dZxrLDxoyEQADIAGrWhPtWqjDFvZZBigzArprSzkKgI=" crossorigin="anonymous"></script>
</head>

<body class="mdui-theme-primary-indigo mdui-theme-accent-blue ">
    <header class="mdui-appbar mdui-color-theme">
        <div class="mdui-toolbar">
            <a mdui-drawer="{target: '#left-drawer'}" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons"
                    mdui-tooltip="{content:
                        '菜单'}">menu</i></a>
            <a class="mdui-typo-headline">T.CN 短链接</a>
            <div class="mdui-toolbar-spacer"></div>
            <a href="/" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons" mdui-tooltip="{content:
                        '刷新'}">refresh</i></a>
            <a href="https://github.com/diffumist" target="_blank"
                class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white mdui-float-right" mdui-tooltip="{content:
                '查看 Github'}">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36"
                    enable-background="new 0 0 36 36" xml:space="preserve" class="mdui-icon"
                    style="width: 24px;height:24px;">
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#ffffff" d="M18,1.4C9,1.4,1.7,8.7,1.7,17.7c0,7.2,4.7,13.3,11.1,15.5
	c0.8,0.1,1.1-0.4,1.1-0.8c0-0.4,0-1.4,0-2.8c-4.5,1-5.5-2.2-5.5-2.2c-0.7-1.9-1.8-2.4-1.8-2.4c-1.5-1,0.1-1,0.1-1
	c1.6,0.1,2.5,1.7,2.5,1.7c1.5,2.5,3.8,1.8,4.7,1.4c0.1-1.1,0.6-1.8,1-2.2c-3.6-0.4-7.4-1.8-7.4-8.1c0-1.8,0.6-3.2,1.7-4.4
	c-0.2-0.4-0.7-2.1,0.2-4.3c0,0,1.4-0.4,4.5,1.7c1.3-0.4,2.7-0.5,4.1-0.5c1.4,0,2.8,0.2,4.1,0.5c3.1-2.1,4.5-1.7,4.5-1.7
	c0.9,2.2,0.3,3.9,0.2,4.3c1,1.1,1.7,2.6,1.7,4.4c0,6.3-3.8,7.6-7.4,8c0.6,0.5,1.1,1.5,1.1,3c0,2.2,0,3.9,0,4.5
	c0,0.4,0.3,0.9,1.1,0.8c6.5-2.2,11.1-8.3,11.1-15.5C34.3,8.7,27,1.4,18,1.4z"></path>
                </svg>
            </a>
        </div>
    </header>

    <div class="mdui-drawer mdui-appbar-inset mdui-drawer-close" id="left-drawer">
        <div class="mdui-grid-tile">
            <img src="https://www.mdui.org/docs/assets/docs/img/card.jpg">
            <div class="mdui-grid-tile-actions mdui-grid-tile-actions-gradient">
                <div class="mdui-grid-tile-text">
                    <div class="mdui-grid-tile-title">Diffumist Box</div>
                </div>
            </div>
        </div>
        <div class="mdui-list">
            <li class="mdui-list-item mdui-ripple">
                <a href="https://onedrive.diffumist.workers.dev/" class="mdui-list-item mdui-ripple ">Oneindex</a>
            </li>
            <li class="mdui-list-item mdui-ripple">
                <a href="https://gugu.diffumist.workers.dev/" class="mdui-list-item mdui-ripple ">Jsproxy</a>
            </li>
            <li class="mdui-list-item mdui-ripple">
                <a href="https://github.diffumist.workers.dev/" class="mdui-list-item mdui-ripple ">Github加速</a>
            </li>
        </div>
    </div>

    <div class="mdui-container doc-container">
        ${body}</div>
</body>

</html>`.trim(), {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        });
    }
    request = new URL(request.url);
    if (request.pathname !== '/') return new Response(null, {
        status: 404
    });
    if (request.searchParams.has('url')) {
        const url = request.searchParams.get('url');
        const response = await fetch(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=1`);
        const html = await response.text();
        const short = html.match(/http:\/\/t.cn\/\w+/i);
        const refer = html.match(/\$refer\s+: "(.+?)"/i);
        if (short && refer) {
            return render(`
<div class="mdui-panel-item mdui-typo mdui-panel-item-open">
    <div class="mdui-panel-item-header">缩短结果：</div>
    <div class="mdui-panel-item-body">
        <a class="mdui-typo-headline" href="${short[0]}">${short[0]}</a>
    </div>
</div>
<a href="/">
    <button class="mdui-fab mdui-fab-fixed mdui-ripple"><i class="mdui-icon material-icons">arrow_back</i></button></a>
`);
        }
        return render(`请求失败`);
    }
    return render(`
<form method="GET">
    <div class="mdui-textfield mdui-textfield-floating-label">
        <i class="mdui-icon material-icons">insert_link</i>
        <label class=" mdui-textfield-label">URL(需要HTTP协议头)</label>
        <input name="url" class="mdui-textfield-input" type="text" required />
        <div class="mdui-textfield-error">链接不能为空</div>
    </div><button type="submit" class="mdui-fab mdui-fab-fixed mdui-ripple"><i
            class="mdui-icon material-icons">cloud_upload</i></button>
</form>
`);
}