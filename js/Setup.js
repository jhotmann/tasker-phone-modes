var configPath = global('MODECONFIGPATH');

var path = prompt('What folder will contain your config files? (No trailing slash)', (configPath ? configPath : '/sdcard/Tasker/ModeConfigs'));
if (path != null) {
  setGlobal('MODECONFIGPATH', path);
}

performTask('UpdateJavascript', 10);