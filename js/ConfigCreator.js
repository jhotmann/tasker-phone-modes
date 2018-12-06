/* eslint no-unused-vars: "off" */
/*global alarmVol audioRecord audioRecordStop btVoiceVol browseURL button call callBlock callDivert callRevert callVol carMode clearKey composeEmail composeMMS composeSMS convert createDir createScene cropImage decryptDir decryptFile deleteDir deleteFile destroyScene disable displayAutoBright displayAutoRotate displayTimeout dpad dtmfVol elemBackColour elemBorder elemPosition elemText elemTextColour elemTextSize elemVisibility endCall enableProfile encryptDir encryptFile enterKey exit flash flashLong filterImage flipImage getLocation getVoice global goHome haptics hideScene listFiles loadApp loadImage local lock mediaControl mediaVol micMute mobileData musicBack musicPlay musicSkip musicStop nightMode notificationVol performTask popup profileActive pulse readFile reboot resizeImage ringerVol rotateImage saveImage say scanCard sendIntent sendSMS setClip settings setAirplaneMode setAirplaneRadios setAlarm setAutoSync setBT setBTID setGlobal setKey setLocal setWallpaper setWifi shell showScene shutdown silentMode sl4a soundEffects speakerphone statusBar stayOn stopLocation systemLock systemVol takeCall takePhoto taskRunning type unzip usbTether vibrate vibratePattern wait wifiTether writeFile zip*/
/* eslint no-unused-vars: "on" */

//-------------------- First Javascriptlet

let configPath = global('Modes_ConfigPath');
if (!configPath) {
  alert('Config path not found, please run Setup task and then re-run this task.');
  exit();
}

var name = prompt('What is the name of your configuration?');
if (!name) exit();

setLocal('configpath', configPath.replace('/sdcard/', ''));
setLocal('configname', name + '.json');
exit();

//-------------------- Second Javascriptlet

let config = {};

if (local('configexists') === 'true') {
  config = JSON.parse(local('configtext'));
}

let contextType = prompt('What type of context is this?\n(1 for primary, 2 for secondary)', getDefaultValue(config, type, '1'));
config.type = (contextType === '2' ? 2 : 1);

let p = prompt('What is this context\'s priority?\n(Enter a number from 0 to 100)', getDefaultValue(config, 'priority', '50'));
try {
  config.priority = parseInt(p);
} catch (err) {
  config.priority = 50;
}

if (confirm('Do you want to change the notification volume?')) {
  let vol = prompt('What would you like the notification volume set to?\n(Enter a number from 0 to 7)', getDefaultValue(config, 'volume_notification', ''));
  if (Number.isInteger(parseInt(vol))) {
    config.volume_notification = parseInt(vol);
  }
}

if (confirm('Do you want to change the media volume?')) {
  let vol = prompt('What would you like the media volume set to?\n(Enter a number from 0 to 15)', getDefaultValue(config, 'volume_media', ''));
  if (Number.isInteger(parseInt(vol))) {
    config.volume_media = parseInt(vol);
  }
}

if (confirm('Do you want to change the Do Not Disturb mode?')) {
  let dnd = prompt('What would you like the dnd mode set to?\n(all, priority, alarms, or none)', getDefaultValue(config, 'dnd', ''));
  if (dnd && ['all', 'priority', 'alarms', 'none'].indexOf(dnd) > -1) {
    config.dnd = dnd;
  }
}

if (confirm('Do you want to change the location mode?')) {
  let loc = prompt('What would you like the location mode set to?\n(off, accuracy, battery, or device)', getDefaultValue(config, 'location', ''));
  if (dnd && ['off', 'accuracy', 'battery', 'device'].indexOf(loc) > -1) {
    config.location = loc;
  }
}

if (confirm('Do you want to change the Wifi status?')) {
  if (confirm('Would you like to turn Wifi on?')) {
    config.wifiOn = true;
  } else {
    config.wifiOn = false;
  }
}

if (confirm('Do you want to change the bluetooth status?')) {
  if (confirm('Would you like to turn bluetooth on?')) {
    config.bluetoothOn = true;
  } else {
    config.bluetoothOn = false;
  }
}

if (confirm('Do you want to change the airplane mode status?')) {
  if (confirm('Would you like to turn airplane mode on?')) {
    config.airplaneModeOn = true;
  } else {
    config.airplaneModeOn = false;
  }
}

if (confirm('Do you want to change the display rotation status?')) {
  if (confirm('Would you like to turn rotation on?')) {
    config.screenRotationOn = true;
  } else {
    config.screenRotationOn = false;
  }
}

if (confirm('Do you want to change the display timeout?')) {
  let min = prompt('What would you like the timeout set to?\n(Enter a number of minutes)', getDefaultValue(config, 'displayTimeout', ''));
  if (Number.isInteger(parseInt(min))) {
    config.displayTimeout = parseInt(min);
  }
}

if (confirm('Do you want to change the display brightness?')) {
  let brightness = prompt('What would you like the brightness to?\n(Enter a number 0 to 255 or auto)', getDefaultValue(config, 'displayBrightness', ''));
  if (Number.isInteger(parseInt(brightness))) {
    config.displayBrightness = parseInt(brightness);
  } else if (brightness === 'auto') {
    config.displayBrightness = 'auto';
  }
}

config.enter = {};
config.exit = {};
config.enter.profilesToDisable = profileEnableDisable(true, false);
config.enter.profilesToEnable = profileEnableDisable(true, true);
config.enter.tasksToRun = tasksToRun(true);
config.exit.profilesToDisable = profileEnableDisable(false, false);
config.exit.profilesToEnable = profileEnableDisable(false, true);
config.exit.tasksToRun = tasksToRun(false);

let jsonout = JSON.stringify(config, null, 2);
setLocal('jsonout', jsonout);
if (confirm('Would you like to save the following configuration as ' + local('configname') + '?\n\n' + jsonout)) {
  setLocal('writefile', '1');
  setLocal('configpath', local('configpath') + '/' + local('configname'));
}
exit();

// Helper functions
function getDefaultValue(conf, propName, defaultValue) {
  return (Object.keys(conf).indexOf(propName) > -1 ? conf[propName] : defaultValue);
}

function profileEnableDisable(enter, enable) {
  if (confirm('When this context is ' + (enter ? 'activated' : 'disactivated') + ', do you want to ' + (enable ? 'enable' : 'disable') + ' any profiles?')) {
    let defaultValue = (config[enter ? 'enter' : 'exit'][enable ? 'profilesToEnable' : 'profilesToDisable'] ? config[enter ? 'enter' : 'exit'][enable ? 'profilesToEnable' : 'profilesToDisable'].join(',') : '');
    let profiles = prompt('Enter the names of the profiles you would like ' + (enable ? 'enabled' : 'disabled') + ' separated by commas', defaultValue);
    if (profiles) {
      return profiles.split(',').map(p => { return p.trim(); });
    }
  }
  return [];
}

function tasksToRun(enter) {
  let arr = [];
  if (confirm('When this context is ' + (enter ? 'activated' : 'disactivated') + ', do you want to execute any tasks?')) {
    let con = true;
    while (con) {
      let obj = taskQuestions();
      if (obj) arr.push(obj);
      con = confirm('Would you like to add another task?');
    }
  }
  return arr;
}

function taskQuestions() {
  let taskObj = {};
  let taskName = prompt('What is the name of the task you would like to execute?');
  if (taskName) {
    taskObj.name = taskName;
  } else {
    return null;
  }
  let priority = parseInt(prompt('What priority would you like to execute this task with?', '10'));
  if (Number.isInteger(parseInt(priority))) {
    taskObj.priority = parseInt(priority);
  } else {
    taskObj.priority = 10;
  }
  let par1 = prompt('What would you like to pass as parameter 1?\n(Cancel for no parameter 1)');
  if (par1) {
    taskObj.param1 = par1;
  } else {
    taskObj.param1 = '';
  }
  let par2 = prompt('What would you like to pass as parameter 2?\n(Cancel for no parameter 2)');
  if (par2) {
    taskObj.param2 = par2;
  } else {
    taskObj.param2 = '';
  }
  return taskObj;
}