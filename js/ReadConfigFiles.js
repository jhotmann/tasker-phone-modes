/* eslint no-unused-vars: "off" */
/*global alarmVol audioRecord audioRecordStop btVoiceVol browseURL button call callBlock callDivert callRevert callVol carMode clearKey composeEmail composeMMS composeSMS convert createDir createScene cropImage decryptDir decryptFile deleteDir deleteFile destroyScene disable displayAutoBright displayAutoRotate displayTimeout dpad dtmfVol elemBackColour elemBorder elemPosition elemText elemTextColour elemTextSize elemVisibility endCall enableProfile encryptDir encryptFile enterKey exit flash flashLong filterImage flipImage getLocation getVoice global goHome haptics hideScene listFiles loadApp loadImage local lock mediaControl mediaVol micMute mobileData musicBack musicPlay musicSkip musicStop nightMode notificationVol performTask popup profileActive pulse readFile reboot resizeImage ringerVol rotateImage saveImage say scanCard sendIntent sendSMS setClip settings setAirplaneMode setAirplaneRadios setAlarm setAutoSync setBT setBTID setGlobal setKey setLocal setWallpaper setWifi shell showScene shutdown silentMode sl4a soundEffects speakerphone statusBar stayOn stopLocation systemLock systemVol takeCall takePhoto taskRunning type unzip usbTether vibrate vibratePattern wait wifiTether writeFile zip*/
/* eslint no-unused-vars: "on" */

const CONFIG_PATH = global('Modes_ConfigPath');
let configs = [];

let fileList = listFiles(CONFIG_PATH).split('\n').filter(f => { return (f !== '') });
fileList.forEach(f => {
  let conf = readConfigFile(f);
  configs.push(conf);
});
setGlobal('Modes_Configs', JSON.stringify(configs));

function readConfigFile(configName) {
  let configText = '{}';
  try {
    configText = readFile(configName);
  } catch (error) {
    flash('Error reading configuration file ' + configName);
  }
  let conf = JSON.parse(configText);
  if (!conf.name) conf.name = configName.replace(/^.*\/|\.[A-Za-z]+$/g, '');
  if (!conf.type) conf.type = 1;
  if (!conf.priority) conf.priority = 50;
  // Translate old configuration format
  if (Object.keys(conf).indexOf('volume') > -1) {
    if (conf.volume.media !== null) conf.volume_media = conf.volume.media;
    if (conf.volume.notification !== null) conf.volume_notification = conf.volume.notification;
    if (conf.volume.dnd !== null) conf.dnd = conf.volume.dnd;
    delete conf.volume;
  }
  return conf;
}