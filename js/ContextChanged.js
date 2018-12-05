/* eslint no-unused-vars: "off" */
/*global alarmVol audioRecord audioRecordStop btVoiceVol browseURL button call callBlock callDivert callRevert callVol carMode clearKey composeEmail composeMMS composeSMS convert createDir createScene cropImage decryptDir decryptFile deleteDir deleteFile destroyScene disable displayAutoBright displayAutoRotate displayTimeout dpad dtmfVol elemBackColour elemBorder elemPosition elemText elemTextColour elemTextSize elemVisibility endCall enableProfile encryptDir encryptFile enterKey exit flash flashLong filterImage flipImage getLocation getVoice global goHome haptics hideScene listFiles loadApp loadImage local lock mediaControl mediaVol micMute mobileData musicBack musicPlay musicSkip musicStop nightMode notificationVol performTask popup profileActive pulse readFile reboot resizeImage ringerVol rotateImage saveImage say scanCard sendIntent sendSMS setClip settings setAirplaneMode setAirplaneRadios setAlarm setAutoSync setBT setBTID setGlobal setKey setLocal setWallpaper setWifi shell showScene shutdown silentMode sl4a soundEffects speakerphone statusBar stayOn stopLocation systemLock systemVol takeCall takePhoto taskRunning type unzip usbTether vibrate vibratePattern wait wifiTether writeFile zip*/
/* eslint no-unused-vars: "on" */

let version = '1.1.0';
setGlobal('Modes_Version', version);

let configPath = global('Modes_ConfigPath');
let defaultContext = global('Modes_DefaultContext');
let contexts = global('Modes_Contexts').split(',').filter(c => { return (c !== '') });
let previousContexts = global('Modes_ActiveContexts').split(',').filter(c => { return (c !== '') });

// Read config files
let configs = contexts.map(context => {
  return readConfigFile(context);
});

// Determine which contexts will be activated based upon type and priority
let activeContexts = [];
let primaryContext = configs.filter(c => { return c.type === 1; }).sort((a, b) => { return a.priority - b.priority; }).pop() || (defaultContext && typeof defaultContext === 'string' ? readConfigFile(defaultContext) : { priority: 0 });
let primaryPriority = primaryContext.priority || 0;
activeContexts.push(primaryContext.name);
let secondaryContexts = configs.filter(c => { return (c.type === 2 && c.priority >= primaryPriority); }).sort((a, b) => { return a.priority - b.priority; });
secondaryContexts.forEach(c => {
  activeContexts.push(c.name);
});

// Determine which contexts are newly active and inactive
let newContexts = missingItems(activeContexts, previousContexts);
let inactivatedContexts = missingItems(previousContexts, activeContexts);

// Perform exit parameters for inactivated contexts
inactivatedContexts.forEach(contextName => {
  context = readConfigFile(contextName);  
  if (context.exit) {
    if (context.exit.profilesToDisable && Array.isArray(context.exit.profilesToDisable)) context.exit.profilesToDisable.forEach(prof => { changeProfileStatus(prof, false); });
    if (context.exit.profilesToEnable && Array.isArray(context.exit.profilesToEnable)) context.exit.profilesToEnable.forEach(prof => { changeProfileStatus(prof, true); });
    if (context.exit.tasksToRun && Array.isArray(context.exit.tasksToRun)) context.exit.tasksToRun.forEach(tsk => { executeTask(tsk.name, tsk.priority, tsk.param1, tsk.param2); });
  }
});

// Merge active context's settings
let merged = {};
if (primaryContext) {
  Object.keys(primaryContext).forEach(key => {
    if (['name', 'type', 'priority', 'enter', 'exit'].indexOf(key) === -1 && primaryContext[key] !== null) merged[key] = primaryContext[key];
  });
}
secondaryContexts.forEach(context => {
  Object.keys(context).forEach(key => {
    if (['name', 'type', 'priority', 'enter', 'exit'].indexOf(key) === -1 && context[key] !== null) merged[key] = context[key];
  });
});

// Change settings according to merged context
if (Object.keys(merged).indexOf('volume_notification') > -1 && Number.isInteger(merged.volume_notification)) notificationVol(merged.volume_notification, false, false);
if (Object.keys(merged).indexOf('volume_media') > -1 && Number.isInteger(merged.volume_media)) mediaVol(merged.volume_media, false, false);
if (Object.keys(merged).indexOf('dnd') > -1 && typeof merged.dnd === 'string') performTask('DoNotDisturb', 10, merged.dnd, '');
if (Object.keys(merged).indexOf('location') > -1 && typeof merged.location === 'string') performTask('LocationMode', 10, merged.location, '');
if (Object.keys(merged).indexOf('wifiOn') > -1 && typeof merged.wifiOn === 'boolean') setWifi(merged.wifiOn);
if (Object.keys(merged).indexOf('bluetoothOn') > -1 && typeof merged.bluetoothOn === 'boolean') setBT(merged.bluetoothOn);
if (Object.keys(merged).indexOf('airplaneModeOn') > -1 && typeof merged.airplaneModeOn === 'boolean') setAirplaneMode(merged.airplaneModeOn);
if (Object.keys(merged).indexOf('screenRotationOn') > -1 && typeof merged.screenRotationOn === 'boolean') performTask('DisplayRotate', 10, merged.screenRotationOn, '');
if (Object.keys(merged).indexOf('displayTimeout') > -1 && Number.isInteger(merged.displayTimeout)) displayTimeout(0, merged.displayTimeout, 0);
if (Object.keys(merged).indexOf('displayBrightness') > -1 && (Number.isInteger(merged.displayBrightness) || typeof merged.displayBrightness === 'string')) performTask('DisplayBrightness', 10, merged.displayBrightness, '');

// Perform enter parameters for new contexts
configs
  .filter(context => { return (newContexts.indexOf(context.name) > -1) })
  .forEach(context => {
    if (context.enter) {
      if (context.enter.profilesToDisable && Array.isArray(context.enter.profilesToDisable)) context.enter.profilesToDisable.forEach(prof => { changeProfileStatus(prof, false); });
      if (context.enter.profilesToEnable && Array.isArray(context.enter.profilesToEnable)) context.enter.profilesToEnable.forEach(prof => { changeProfileStatus(prof, true); });
      if (context.enter.tasksToRun && Array.isArray(context.enter.tasksToRun)) context.enter.tasksToRun.forEach(tsk => { executeTask(tsk.name, tsk.priority, tsk.param1, tsk.param2); });
    }
  });

flash((newContexts.length > 0 ? 'New context(s): ' + newContexts.join(', ') : 'Active Context(s): ' + activeContexts.join(', ')));
setGlobal('Modes_ActiveContexts', activeContexts.join(','));

exit();

// Helper functions
function readConfigFile(configName) {
  let configText = '{}';
  try {
    configText = readFile(configPath + '/' + configName + '.json');
  } catch (error) {
    flash('Error reading configuration file ' + configPath + '/' + configName + '.json');
  }
  let conf = JSON.parse(configText);
  if (!conf.name) conf.name = configName;
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

function missingItems(arr1, arr2) {
  var missing = arr1.filter(function(item) {
    return arr2.indexOf(item) === -1;
  });
  return missing;
}

function changeProfileStatus(name, on) {
  enableProfile(name, on);
  wait(1000);
}

function executeTask(name, priority, param1, param2) {
  performTask(name, priority, param1, param2);
  wait(500);
}
