/* eslint no-unused-vars: "off" */
/*global alarmVol audioRecord audioRecordStop btVoiceVol browseURL button call callBlock callDivert callRevert callVol carMode clearKey composeEmail composeMMS composeSMS convert createDir createScene cropImage decryptDir decryptFile deleteDir deleteFile destroyScene disable displayAutoBright displayAutoRotate displayTimeout dpad dtmfVol elemBackColour elemBorder elemPosition elemText elemTextColour elemTextSize elemVisibility endCall enableProfile encryptDir encryptFile enterKey exit flash flashLong filterImage flipImage getLocation getVoice global goHome haptics hideScene listFiles loadApp loadImage local lock mediaControl mediaVol micMute mobileData musicBack musicPlay musicSkip musicStop nightMode notificationVol performTask popup profileActive pulse readFile reboot resizeImage ringerVol rotateImage saveImage say scanCard sendIntent sendSMS setClip settings setAirplaneMode setAirplaneRadios setAlarm setAutoSync setBT setBTID setGlobal setKey setLocal setWallpaper setWifi shell showScene shutdown silentMode sl4a soundEffects speakerphone statusBar stayOn stopLocation systemLock systemVol takeCall takePhoto taskRunning type unzip usbTether vibrate vibratePattern wait wifiTether writeFile zip*/
/* eslint no-unused-vars: "on" */

let ALL_CONFIGS = JSON.parse(global('Modes_Configs'));
let index = ALL_CONFIGS.findIndex(c => { return c.name === 'mediaoverride' });
if (index > -1) {
  ALL_CONFIGS[index].volume_media = parseInt(global('VOLM'));
} else {
  ALL_CONFIGS.push({
    name: "mediaoverride",
    type: 2,
    priority: 81,
    volume_media: parseInt(global('VOLM'))
  });
}
setGlobal('Modes_Configs', JSON.stringify(ALL_CONFIGS));