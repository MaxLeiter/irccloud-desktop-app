var NwBuilder = require('node-webkit-builder');

var nw = new NwBuilder({
  version: '0.12.1',
  files: './src/**',
  platforms: ['osx64'],
  macIcns: './assets/IRCCloud.icns',
  macZip: true,
  macPlist: {
    NSHumanReadableCopyright: 'Copyright © 2015 github.com/moul',
    CFBundleIdendifier: 'com.github.moul.irccloud-desktop-app'
  }
});

nw.on('log', console.log);

nw.build()
  .then(function() {
    console.log('Build complete');
  })
  .catch(function(err) {
    console.error(err);
    process.exit(1);
  });
