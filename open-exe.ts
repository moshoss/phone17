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

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error.code === 'ESRCH') {
      return false;
    }
    if (error.code === 'EPERM') {
      return true;
    }
    return false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkPidKilled(pid, timeout = 30000) {
  let prevTime = Date.now()
  return new Promise((resolve) => {
    const loop = async () => {
      if (Date.now() - prevTime > timeout) {
        resolve(false)
        return
      }
      await sleep(1000)
      if (!isProcessRunning(pid)) {
        resolve(true)
      } else {
        loop()
      }
    }
    loop()
  })
}


const foo = async () => {
  const killed = await checkPidKilled(4312)
  console.log('killed', killed)
}

foo()
