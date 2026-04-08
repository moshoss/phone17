const { spawn } = require('child_process');

function openExe(appPath) {
  const child = spawn(appPath, [], {
    detached: true,
    stdio: 'ignore',
    windowsHide: false
  });

  child.unref();

  child.on('error', e => {
    console.error(e)
  })
}

