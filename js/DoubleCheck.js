var modeConfig = JSON.parse(readFile(global('MODECONFIGPATH') + '/' + global('PHONEMODE') + '.json'));

if (Number.isInteger(modeConfig.volume.notification)) { notificationVol(modeConfig.volume.notification, false, false); }
if (Number.isInteger(modeConfig.volume.media)) { mediaVol(modeConfig.volume.media, false, false); }
if (modeConfig.volume.dnd !== null) { performTask('DoNotDisturb', 10, modeConfig.volume.dnd, ''); }
if (modeConfig.wifiOn !== null) { setWifi(modeConfig.wifiOn); }
if (modeConfig.bluetoothOn !== null) { setBT(modeConfig.bluetoothOn); }
if (modeConfig.screenRotationOn !== null) { performTask('DisplayRotate', 10, modeConfig.screenRotationOn, ''); }