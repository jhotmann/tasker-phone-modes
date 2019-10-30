/* eslint no-unused-vars: "off" */
/*global alarmVol audioRecord audioRecordStop btVoiceVol browseURL button call callBlock callDivert callRevert callVol carMode clearKey composeEmail composeMMS composeSMS convert createDir createScene cropImage decryptDir decryptFile deleteDir deleteFile destroyScene disable displayAutoBright displayAutoRotate displayTimeout dpad dtmfVol elemBackColour elemBorder elemPosition elemText elemTextColour elemTextSize elemVisibility endCall enableProfile encryptDir encryptFile enterKey exit flash flashLong filterImage flipImage getLocation getVoice global goHome haptics hideScene listFiles loadApp loadImage local lock mediaControl mediaVol micMute mobileData musicBack musicPlay musicSkip musicStop nightMode notificationVol performTask popup profileActive pulse readFile reboot resizeImage ringerVol rotateImage saveImage say scanCard sendIntent sendSMS setClip settings setAirplaneMode setAirplaneRadios setAlarm setAutoSync setBT setBTID setGlobal setKey setLocal setWallpaper setWifi shell showScene shutdown silentMode sl4a soundEffects speakerphone statusBar stayOn stopLocation systemLock systemVol takeCall takePhoto taskRunning type unzip usbTether vibrate vibratePattern wait wifiTether writeFile zip*/
/* eslint no-unused-vars: "on" */

// For testing
// let par1 = 'car';
// let par2 = 'all' || '';
// let context = 'home,work,car,silent,home'.split(',').filter(c => c.length > 0);

const par1 = local('par1');
const par2 = local('par2') || '';
let context = global('Modes_Contexts').split(',').filter(c => c.length > 0);

let index = context.indexOf(par1);
if (index > -1) {
  if (par2.toLowerCase() === 'all') { // remove all occurances
    while (index > -1) {
      context.splice(index, 1);
      index = context.indexOf(par1);
    }
    setGlobal('Modes_Contexts', context.join(','));
  } else { // remove first occurance
    context.splice(index, 1);
    setGlobal('Modes_Contexts', context.join(','));
  }
}

// For testing
console.dir(context);

// Old code
// let context = global('Modes_Contexts').split(',').filter(c => c.length > 0);
// let index = context.indexOf(local('par1'));
// if (index > -1) {
//   context.splice(index, 1);
//   setGlobal('Modes_Contexts', context.join(','));
// }