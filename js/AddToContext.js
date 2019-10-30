/* eslint no-unused-vars: "off" */
/*global alarmVol audioRecord audioRecordStop btVoiceVol browseURL button call callBlock callDivert callRevert callVol carMode clearKey composeEmail composeMMS composeSMS convert createDir createScene cropImage decryptDir decryptFile deleteDir deleteFile destroyScene disable displayAutoBright displayAutoRotate displayTimeout dpad dtmfVol elemBackColour elemBorder elemPosition elemText elemTextColour elemTextSize elemVisibility endCall enableProfile encryptDir encryptFile enterKey exit flash flashLong filterImage flipImage getLocation getVoice global goHome haptics hideScene listFiles loadApp loadImage local lock mediaControl mediaVol micMute mobileData musicBack musicPlay musicSkip musicStop nightMode notificationVol performTask popup profileActive pulse readFile reboot resizeImage ringerVol rotateImage saveImage say scanCard sendIntent sendSMS setClip settings setAirplaneMode setAirplaneRadios setAlarm setAutoSync setBT setBTID setGlobal setKey setLocal setWallpaper setWifi shell showScene shutdown silentMode sl4a soundEffects speakerphone statusBar stayOn stopLocation systemLock systemVol takeCall takePhoto taskRunning type unzip usbTether vibrate vibratePattern wait wifiTether writeFile zip*/
/* eslint no-unused-vars: "on" */

// For testing
// let par1 = 'home';
// let par2 = undefined || '';
// let context = 'home,work,car,silent,home'.split(',').filter(c => c.length > 0);

const par1 = local('par1');
const par2 = local('par2');
let context = global('Modes_Contexts').split(',').filter(c => c.length > 0);

if (par1) {
  switch (par2) {
    case ('if-not-exist'):
    case ('if-not-exists'): {
      if (context.indexOf(par1) === -1) appendToContext(par1);
      break;
    }
    case (par2.match(/^max-count=\d+$/) || {}).input: {
      let maxCount = parseInt(par2.toLowerCase().replace('max-count=', ''));
      if (maxCount) {
        let currentCount = context.filter((c) => { return c === par1; }).length;
        if (currentCount < maxCount) appendToContext(par1);
      }
      break;
    }
    default: { appendToContext(par1); }
  }
}

function appendToContext(c) {
  context.push(c);
  setGlobal('Modes_Contexts', context.join(','));
}

// For testing
console.dir(context);

// Old code
// let context = global('Modes_Contexts').split(',').filter(c => c.length > 0);
// context.push(local('par1'));
// setGlobal('Modes_Contexts', context.join(','));