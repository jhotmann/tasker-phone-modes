One of frequent uses of Tasker is to change system settings and perform tasks based on your current situation.
Things like silencing your phone while in a meeting, turning down brightness at night, or launching a music app
when in the car are just the tip of the iceburg when it comes to Tasker automation. This sort of automation can
be approached in many different ways and often times leads to repeated steps in multiple tasks and disorganization.

Over time I have strived to refine my location-based-automation so that it's easy to modify, highly organized, and
doesn't use the same steps in multiple tasks. I have now also made it universal so that anyone can import my simple
profiles and quickly get automating.

# Overview
My modes project consists of a couple profiles, a few helper tasks, some javascript that does most of the work, and
configuration files that you create and customize to your needs.

### Profiles
**PhoneModeChanged** - monitors the %PHONEMODE variable for changes. When %PHONEMODE is set (i.e. to 'home') the
javascript reads the home.config file and modifies your settings accordingly, enables/disables any profiles specified,
and then executes any tasks specified in the config. As an added bonus your config can enable/disable profiles and queue
tasks when your phone leaves a mode as well.

**DoubleCheck** - a profile that waits for you to unlock your phone and will ensure that your settings are set correctly
because of occasional issues with Tasker and doze mode.


### Tasks
**Setup** - guides the user through setting up some variables and downloads the javasript files
**DoNoDisturb** - a helper task for setting DND mode (can't be done via javascript)
**DisplayRotate** - a helper task to turn on/off display rotation (can't be done via javascript)
**UpdateJavascript** - downloads the latest javascript files from GitHub

# Installation and Configuration
### Import Modes.prj.xml into Tasker (Not available yet)
Long press (or right click) and save the [Modes.prj.xml file](https://raw.githubusercontent.com/jhotmann/tasker-phone-modes/master/Modes.prj.xml) to your phone.
Then open up Tasker, long press on a project tab at the bottom, and select Import. Then browse to and select the downloaded file.


### Run Setup task
Select the Tasks tab for the Modes project in Tasker and open the Setup task. Select the play button and follow the on screen prompts.
Currently this just sets the %MODECONFIGPATH variable and then runs the UpdateJavascript task.


### Customize config files
The base.config file should be used as a template for new config files. I have also included several of my config files as
examples that you can modify to your needs.  I would recommend using a comptuer for this.

base.config
```json
{
  "volume": {
    "notification": "null or integer (0-7)",
    "media": "null or integer (0-15)",
    "dnd": "null, all (with quotes to turn off dnd), priority (with quotes for priority only), alarms (with quotes for alarms only), or none (with quotes for total silence)"
  },
  "wifiOn": "null or boolean",
  "bluetoothOn": "null or boolean",
  "screenRotationOn": "null or boolean",
  "enter": {
    "profilesToDisable": ["NameOfProfile1", "NameOfProfile2", "..."],
    "profilesToEnable": [],
    "tasksToRun": [{
      "name": "TaskName1",
      "priority": 10,
      "param1": "",
      "param2": ""
    }, {
      "name": "TaskName2",
      "priority": 10,
      "param1": "",
      "param2": ""
    }]
  },
  "exit": {
    "profilesToDisable": [],
    "profilesToEnable": [],
    "tasksToRun": []
  }
}
```
home.config
```json
{
  "volume": {
    "notification": 3,
    "media": 7,
    "dnd": "all"
  },
  "wifiOn": null,
  "bluetoothOn": null,
  "screenRotationOn": false,
  "enter": {
    "profilesToDisable": [],
    "profilesToEnable": [],
    "tasksToRun": [{
      "name": "LampOnAtNight",
      "priority": 10,
      "param1": "",
      "param2": ""
    }]
  },
  "exit": {
    "profilesToDisable": [],
    "profilesToEnable": [],
    "tasksToRun": []
  }
}
```
When a property is left null (or an empty array: []) that property is left unchanged. Things like null, true, false, and integers
should never have quotes around them. Strings should always use double quotes. Proper indenting is nice but optional.

### Changing phone modes
The name of the config files are important because when you want to use a configuration all you have to do is change %PHONEMODE
to that config's name. When %PHONEMODE = home, home.config is used. You can change modes manually within a task or with a profile. I personally
only use profiles to change modes.

For example, I have a profile named HomeMode that is triggered by Wifi Connected to my home SSID. I have another profile named CarMode that is
triggered by Bluetooth Connected to my car's stereo.

Another profile is NightMode which turns on priority-only notifications, lowers screen brightness, and a few other things. Since I'm almost always
at home when NightMode becomes active, I added a second condition to HomeMode. HomeMode is active when connected to my home wireless network and
also when NightMode is not active.  This way if I arrive home late, ringer and brightness will stay in NightMode settings and not switch to HomeMode
settings. 

I also have a profile named OtherMode that is active when none of my other mode profiles are active. This profile is active when I'm out and about
and puts my phone in a quiet but audible state. One caveat with this profile is that I put a 5 second wait first and then change %PHONEMODE to 'other'
only if the OtherMode profile is still active. I do this because sometimes when switching modes, OtherMode will become active for a split second and
can lead to your desired settings being overwritten.

How modes are changed is entirely dependent on your personal setup, so you are free to trigger modes however you see fit. If you want to use network
location instead of WifiConnected, you are free to do so. If you want car mode to be triggered by headphones and a specific app because you don't have
bluetooth in the car, go for it.

# TODO
- Add ability to check for javascript updates on a daily basis