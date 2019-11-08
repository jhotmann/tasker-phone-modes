/* eslint no-unused-vars: "off" */
/*global alarmVol audioRecord audioRecordStop btVoiceVol browseURL button call callBlock callDivert callRevert callVol carMode clearKey composeEmail composeMMS composeSMS convert createDir createScene cropImage decryptDir decryptFile deleteDir deleteFile destroyScene disable displayAutoBright displayAutoRotate displayTimeout dpad dtmfVol elemBackColour elemBorder elemPosition elemText elemTextColour elemTextSize elemVisibility endCall enableProfile encryptDir encryptFile enterKey exit flash flashLong filterImage flipImage getLocation getVoice global goHome haptics hideScene listFiles loadApp loadImage local lock mediaControl mediaVol micMute mobileData musicBack musicPlay musicSkip musicStop nightMode notificationVol performTask popup profileActive pulse readFile reboot resizeImage ringerVol rotateImage saveImage say scanCard sendIntent sendSMS setClip settings setAirplaneMode setAirplaneRadios setAlarm setAutoSync setBT setBTID setGlobal setKey setLocal setWallpaper setWifi shell showScene shutdown silentMode sl4a soundEffects speakerphone statusBar stayOn stopLocation systemLock systemVol takeCall takePhoto taskRunning type unzip usbTether vibrate vibratePattern wait wifiTether writeFile zip*/
/* eslint no-unused-vars: "on" */

var configPath = global('Modes_ConfigPath');
var path = prompt('What folder will contain your config files? (No trailing slash)', (configPath ? configPath : '/sdcard/Tasker/ModeConfigs'));
if (path != null) {
  setGlobal('Modes_ConfigPath', path);
}

performTask('ReadConfigFiles', 99, null, null);

var defaultContext = global('Modes_DefaultContext');
var dc = prompt('What would you like to be the default primary context?', (defaultContext ? defaultContext : ''));
if (dc != null) {
  setGlobal('Modes_DefaultContext', dc);
}

var cfu = confirm('Would you like to periodically check for project updates?');
enableProfile('CheckForModesUpdate', cfu);

enableProfile('ContextChanged', true);
enableProfile('MonitorStart', true);