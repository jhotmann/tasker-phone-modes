/* eslint-disable no-unused-vars */
/*global alarmVol audioRecord audioRecordStop btVoiceVol browseURL button call callBlock callDivert callRevert callVol carMode clearKey composeEmail composeMMS composeSMS convert createDir createScene cropImage decryptDir decryptFile deleteDir deleteFile destroyScene disable displayAutoBright displayAutoRotate displayTimeout dpad dtmfVol elemBackColour elemBorder elemPosition elemText elemTextColour elemTextSize elemVisibility endCall enableProfile encryptDir encryptFile enterKey exit flash flashLong filterImage flipImage getLocation getVoice goHome haptics hideScene listFiles loadApp loadImage local lock mediaControl mediaVol micMute mobileData musicBack musicPlay musicSkip musicStop nightMode notificationVol performTask popup profileActive pulse readFile reboot resizeImage ringerVol rotateImage saveImage say scanCard sendIntent sendSMS setClip settings setAirplaneMode setAirplaneRadios setAlarm setAutoSync setBT setBTID setGlobal setKey setLocal setWallpaper setWifi shell showScene shutdown silentMode sl4a soundEffects speakerphone statusBar stayOn stopLocation systemLock systemVol takeCall takePhoto taskRunning type unzip usbTether vibrate vibratePattern wait wifiTether writeFile zip*/
/* eslint-enable no-unused-vars */

let version = '1.9.0';
setGlobal('Modes_Version', version);

const ALL_CONFIGS = JSON.parse(global('Modes_Configs'));
const DEFAULT_CONTEXT = global('Modes_DefaultContext');
let contexts = global('Modes_Contexts').split(',').filter(c => { return (c !== '') });
let previousContexts = global('Modes_ActiveContexts').split(',').filter(c => { return (c !== '') });

// Filter down to only configs in %Modes_Contexts
let configs = ALL_CONFIGS.filter(c => { return contexts.indexOf(c.name) > -1 });
let defaultContext = (DEFAULT_CONTEXT && typeof DEFAULT_CONTEXT === 'string' ? ALL_CONFIGS.find(c => { return c.name === DEFAULT_CONTEXT }) : null) || { priority: 0 };

// Determine which contexts will be activated based upon type and priority
let activeContexts = [];
let primaryContext = configs.filter(c => { return c.type === 1; }).sort((a, b) => { return a.priority - b.priority; }).pop() || defaultContext;
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
ALL_CONFIGS
  .filter(c => { return inactivatedContexts.indexOf(c.name) > -1 })
  .forEach(context => {
    if (context.exit) {
      if (context.exit.profilesToDisable && Array.isArray(context.exit.profilesToDisable)) context.exit.profilesToDisable.forEach(prof => { changeProfileStatus(prof, false); });
      if (context.exit.profilesToEnable && Array.isArray(context.exit.profilesToEnable)) context.exit.profilesToEnable.forEach(prof => { changeProfileStatus(prof, true); });
      if (context.exit.tasksToRun && Array.isArray(context.exit.tasksToRun)) context.exit.tasksToRun.forEach(tsk => {
        if (typeof tsk === 'string') {
          executeTask(tsk, 10, null, null);
        } else if (typeof tsk === 'object' && tsk.name) {
          executeTask(tsk.name, tsk.priority, tsk.param1, tsk.param2);
        }
      });
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
// DND first, if going from none/priority to all it must occur for media volume changes to occur (Android 12+)
if (existsIsType(merged, 'dnd', 'string')) performTask('DoNotDisturb', 10, merged.dnd, '');

// Only change media volume if %Modes_MediaOverride != 1
const mediaVolExists = existsIsType(merged, 'volume_media', 'int');
if (existsIsType(merged, 'volume_media_override', 'boolean') && merged.volume_media_override) {
  if (mediaVolExists && global('Modes_MediaOverride') !== '1') mediaVol(merged.volume_media, false, false);
  enableProfile('ModesMediaOverride', true);
} else {
  enableProfile('ModesMediaOverride', false);
  setGlobal('Modes_MediaOverride', '0');
  if (mediaVolExists) mediaVol(merged.volume_media, false, false);
}

if (existsIsType(merged, 'volume_notification', 'int')) notificationVol(merged.volume_notification, false, false);
if (existsIsType(merged, 'location', 'string')) performTask('LocationMode', 10, merged.location, '');
if (existsIsType(merged, 'wifiOn', 'boolean')) setWifi(merged.wifiOn);
if (existsIsType(merged, 'bluetoothOn', 'boolean')) setBT(merged.bluetoothOn);
if (existsIsType(merged, 'mobileDataOn', 'boolean')) performTask('MobileData', 10, merged.mobileDataOn, '');
if (existsIsType(merged, 'airplaneModeOn', 'boolean')) setAirplaneMode(merged.airplaneModeOn);
if (existsIsType(merged, 'screenRotationOn', 'boolean')) performTask('DisplayRotate', 10, merged.screenRotationOn, '');
if (existsIsType(merged, 'displayTimeout', 'int')) displayTimeout(0, merged.displayTimeout, 0);
if (existsIsType(merged, 'displayBrightness', 'int') || existsIsType(merged, 'displayBrightness', 'string')) performTask('DisplayBrightness', 10, merged.displayBrightness, '');
if (existsIsType(merged, 'nightLightOn', 'boolean')) performTask('NightLight', 10, merged.nightLightOn, '');
if (existsIsType(merged, 'extraDimOn', 'boolean')) performTask('ExtraDim', 10, merged.extraDimOn, '');
if (existsIsType(merged, 'immersiveMode', 'string')) performTask('ImmersiveMode', 10, merged.immersiveMode, '');
if (existsIsType(merged, 'darkMode', 'boolean')) performTask('DarkMode', 10, merged.darkMode, '');
if (existsIsType(merged, 'grayscaleMode', 'boolean')) performTask('GrayscaleMode', 10, merged.grayscaleMode, '');
if (existsIsType(merged, 'hapticFeedbackOn', 'boolean')) performTask('TouchVibrations', 10, merged.hapticFeedbackOn, '');
if (existsIsType(merged, 'batterySaverOn', 'boolean')) performTask('BatterySaver', 10, merged.batterySaverOn, '');
if (existsIsType(merged, 'owntracksMode', 'int')) performTask("OwntracksMode", 10, merged.owntracksMode, '');
if (existsIsType(merged, 'owntracksMode', 'string')) performTask("OwntracksMode", 10, owntracksStringToInt(merged.owntracksMode), '');

// Perform enter parameters for new contexts
ALL_CONFIGS
  .filter(context => { return (newContexts.indexOf(context.name) > -1) })
  .forEach(context => {
    if (context.enter) {
      if (context.enter.profilesToDisable && Array.isArray(context.enter.profilesToDisable)) context.enter.profilesToDisable.forEach(prof => { changeProfileStatus(prof, false); });
      if (context.enter.profilesToEnable && Array.isArray(context.enter.profilesToEnable)) context.enter.profilesToEnable.forEach(prof => { changeProfileStatus(prof, true); });
      if (context.enter.tasksToRun && Array.isArray(context.enter.tasksToRun)) context.enter.tasksToRun.forEach(tsk => {
        if (typeof tsk === 'string') {
          executeTask(tsk, 10, null, null);
        } else if (typeof tsk === 'object' && tsk.name) {
          executeTask(tsk.name, tsk.priority, tsk.param1, tsk.param2);
        }
      });
    }
  });

setGlobal('Modes_ActiveContexts', activeContexts.join(','));
setLocal('active', activeContexts.join(', ') || DEFAULT_CONTEXT);

exit();

// Helper functions
function missingItems(arr1, arr2) {
  var missing = arr1.filter(function(item) {
    return arr2.indexOf(item) === -1;
  });
  return missing;
}

function existsIsType(obj, key, type) {
  if (Object.keys(obj).indexOf(key) === -1) return false;
  if (type === 'int') return (Number.isInteger(obj[key]));
  else return (typeof obj[key] === type);
}

function changeProfileStatus(name, on) {
  enableProfile(name, on);
  wait(1000);
}

function executeTask(name, priority, param1, param2) {
  performTask(name, priority, param1, param2);
  wait(500);
}

function owntracksStringToInt(mode) {
  switch (mode.toLowerCase()) {
  case 'quiet':
    return -1;
  case 'manual':
    return 0;
  case 'move':
    return 2;
  default:
    return 1;
  }
}
