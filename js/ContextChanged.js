var version = '0.0.1';
setGlobal('PHONEMODEVERSION', version);

var modeConfig = JSON.parse(readFile(global('MODECONFIGPATH') + '/' + global('PHONEMODE') + '.json'));

if (global('PREVIOUSPHONEMODE') && global('PREVIOUSPHONEMODE') !== global('PHONEMODE')) {
  var exitModeConfig = JSON.parse(readFile(global('MODECONFIGPATH') + '/' + global('PREVIOUSPHONEMODE') + '.json'));

  if (exitModeConfig.exit.profilesToDisable.length > 0) {
    for (var ed = 0; ed < exitModeConfig.exit.profilesToDisable.length; ed++) {
      enableProfile(exitModeConfig.exit.profilesToDisable[ed], false);
      wait(1000);
    }
  }

  if (exitModeConfig.exit.profilesToEnable.length > 0) {
    for (var ee = 0; ee < exitModeConfig.exit.profilesToEnable.length; ee++) {
      enableProfile(exitModeConfig.exit.profilesToEnable[ee], true);
      wait(1000);
    }
  }

  if (exitModeConfig.exit.tasksToRun.length > 0) {
    for (var et = 0; et < exitModeConfig.exit.tasksToRun.length; et++) {
      performTask(exitModeConfig.exit.tasksToRun[et].name, exitModeConfig.exit.tasksToRun[et].priority, exitModeConfig.exit.tasksToRun[et].param1, exitModeConfig.exit.tasksToRun[et].param2);
      wait(500);
    }
  }
}

if (modeConfig.enter.profilesToDisable.length > 0) {
  for (var d = 0; d < modeConfig.enter.profilesToDisable.length; d++) {
    enableProfile(modeConfig.enter.profilesToDisable[d], false);
    wait(1000);
  }
}

if (modeConfig.enter.profilesToEnable.length > 0) {
  for (var e = 0; e < modeConfig.enter.profilesToEnable.length; e++) {
    enableProfile(modeConfig.enter.profilesToEnable[e], true);
    wait(1000);
  }
}

if (Number.isInteger(modeConfig.volume.notification)) { notificationVol(modeConfig.volume.notification, false, false); }
if (Number.isInteger(modeConfig.volume.media)) { mediaVol(modeConfig.volume.media, false, false); }
if (modeConfig.volume.dnd !== null) { performTask('DoNotDisturb', 10, modeConfig.volume.dnd, ''); }
if (modeConfig.wifiOn !== null) { setWifi(modeConfig.wifiOn); }
if (modeConfig.bluetoothOn !== null) { setBT(modeConfig.bluetoothOn); }
if (modeConfig.screenRotationOn !== null) { performTask('DisplayRotate', 10, modeConfig.screenRotationOn, ''); }

if (modeConfig.enter.tasksToRun.length > 0) {
  for (var t = 0; t < modeConfig.enter.tasksToRun.length; t++) {
    performTask(modeConfig.enter.tasksToRun[t].name, modeConfig.enter.tasksToRun[t].priority, modeConfig.enter.tasksToRun[t].param1, modeConfig.enter.tasksToRun[t].param2);
    wait(100);
  }
}

flash(global('PHONEMODE') + ' mode enabled');
setGlobal('PREVIOUSPHONEMODE', global('PHONEMODE'));
