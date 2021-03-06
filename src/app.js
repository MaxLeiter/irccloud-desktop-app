var gui = require('nw.gui'),
    win = gui.Window.get();


var platform = /^win/.test(process.platform) ? 'win32'
  : /^darwin/.test(process.platform) ? 'osx64'
  : 'linux' + (process.arch == 'ia32' ? '32' : '64');
var isOSX = platform === 'osx64',
    isWindows = platform === 'win32',
    isLinux = platform.indexOf('linux') === 0;


// Create the app menu
var mainMenu = new gui.Menu({type: 'menubar'});

if (mainMenu.createMacBuiltin) {
  mainMenu.createMacBuiltin('IRC Cloud');
}
var helpMenu = new gui.Menu();
mainMenu.append(new gui.MenuItem({
  label: 'Help',
  submenu: helpMenu
}));
helpMenu.append(new gui.MenuItem({
  label: 'Dev Tools',
  click: function(){
    win.showDevTools();
  }
}));
win.menu = mainMenu;

win.on('new-win-policy', function (frame, url, policy) {
  gui.Shell.openExternal(url);
  policy.ignore();
});


// skin css
var wv = document.getElementById("app");
wv.addEventListener("loadcommit", function(e){
  wv.insertCSS({file: "irccloud-dark.css"});
});
wv.addEventListener('newwindow', function(e) {
  window.open(e.targetUrl);
});


var contextMenu = new gui.Menu();
contextMenu.append(new gui.MenuItem({
  label: "Cut", click: function() {
    wv.executeScript({code:'(function(){document.execCommand("cut");})()'});
    console.log('Menu:', 'cutted to clipboard');
  }
}));
contextMenu.append(new gui.MenuItem({
  label: "Copy", click: function() {
    wv.executeScript({code:'(function(){document.execCommand("copy");})()'});
    console.log('Menu:', 'copied to clipboard');
  }
}));
contextMenu.append(new gui.MenuItem({
  label: "Paste", click: function() {
    wv.executeScript({code:'(function(){document.execCommand("paste");})()'});
    console.log('Menu:', 'pasted to textarea');
  }
}));

wv.addEventListener('contextmenu', function(ev) {
  console.log('contextmenu', ev);
  ev.preventDefault();
  contextMenu.popup(ev.x, ev.y);
  return false;
});


var loaded = false;
wv.addEventListener('loadprogress', function(e) {
  // console.log(e.progress);
  if (!loaded) {
    win.setProgressBar(e.progress);
    if (e.progress == 1) {
      win.show();
      loaded = true;
      // win.setProgressBar(0);
    };
  }
});


wv.addEventListener('permissionrequest', function(e) {
  console.log('permissionrequest', e.permission);
  e.request.allow();
});


wv.addEventListener('consolemessage', function(e) {
  if (e.message.indexOf('"totalBadges::') == 0) {
    var totalBadges = parseInt(e.message.substring(14, e.message.length - 1));
    if (totalBadges) {
      win.setBadgeLabel(totalBadges);
    } else {
      win.setBadgeLabel('');
    }
  } else {
    console.log('wv.consolemessage', e.message);
  }
});


// OS X
if (isOSX) {
  // Re-Show the window when the dock icon is pressed
  gui.App.on('reopen', function() {
    win.show();
  });
}


// Don't quit the app when the window is closed
win.on('close', function(quit) {
  if (quit) {
    win.close(true);
  } else {
    win.hide();
  }
});


// Listen for DOM load
/*
window.onload = function() {
  var app = document.getElementById('app');
  var titleRegExp = /\((\d)\)/;

  // Watch the iframe every 250ms
  setInterval(function() {
    // Sync the title
    document.title = app.contentDocument.title;

    // Update the badge
    var match = titleRegExp.exec(document.title);
    var label = match && match[1] || '';
    win.setBadgeLabel(label);
  }, 250);
};
*/

// Devel
//win.showDevTools();
