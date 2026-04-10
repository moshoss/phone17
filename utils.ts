type NestedKeyOf<T> = T extends object ? {
    [K in keyof T]: K extends string | number
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : never;
}[keyof T] : never;



export function getObjectValue<T, P extends NestedKeyOf<T>>(
    obj: T,
    path: P,
    initValue?: any
): P extends `${string}.${string}` ? any : T[P extends keyof T ? P : never] {
    // Reuse existing logic but with type constraints
    let result: any;
    try {
        const formatter = path.replace(/\[(\w+)\]/g, '.$1');
        result = formatter
            .split('.')
            .map((p) => p.trim())
            .reduce((a, v) => a?.[v], obj as any);
        if (result == null) result = initValue;
    } catch (e) {
        result = initValue;
    }
    return result;
}


export function setObjectValue<T, P extends NestedKeyOf<T>, V>(
    obj: T,
    path: P,
    value: V
): T {
    if (!path) return obj
    const formatter = path.replace(/\[(\w+)\]/g, `.$1`)
    const parts = formatter.split('.')
    const lastIdx = parts.length - 1
    parts.map((p) => p.trim()).reduce((a, v, i) => {
        if (!a[v]) {
            a[v] = {}
        }
        if (i === lastIdx) {
            a[v] = value
        }
        return a[v]
    }, obj as any)
    return obj
}



function createAppMenu() {
   const template = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      role: 'viewMenu',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    { role: 'windowMenu' },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

mainWindow.loadURL(`app://render/index.html`);

function createHtmlResponse(relativePath) {
  console.log('relativePath', relativePath);
  try {
    return new Response(getRendererHtml(), {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    return new Response(error.message, {
      status: 500,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }
}


protocol.handle(APP_PROTOCOL_SCHEME, request => {
  const url = new URL(request.url);
  const pathname = decodeURIComponent(url.pathname);
  
  const relativePath = pathname.slice(1)

  if (relativePath.endsWith('.html')) {
    return createHtmlResponse(relativePath);
  }

  const assetPath = path.resolve(__dirname, relativePath);

  if (!assetPath || !fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
    return new Response('Not Found', { status: 404 });
  }

  return net.fetch(pathToFileURL(assetPath).toString());
});
