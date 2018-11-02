"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = BetterBacks;

var _stylemaker = _interopRequireDefault(require("stylemaker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BetterBacks(target, userSettings) {
  // Validations
  if (!target) {
    console.log('%c Make sure you provided DOM element selector', 'color: #ff6060');
    return;
  }

  var targetEle = document.querySelector(target);

  if (!targetEle) {
    console.log('%c Make sure you provided element exist in DOM', 'color: #ff6060');
    return;
  }

  if (userSettings && userSettings.animate && typeof userSettings.animate !== 'boolean') {
    console.log("%c Please provide a boolean value for 'animate'", 'color: #ff6060');
    return;
  }

  if (userSettings && userSettings.dark && typeof userSettings.dark !== 'boolean') {
    console.log("%c Please provide a boolean value for 'dark'", 'color: #ff6060');
    return;
  }

  if (userSettings && userSettings.density) {
    if (typeof userSettings.density === 'string' && ['low', 'med', 'high'].includes(userSettings.density)) {} else {
      console.log("%c Please provide a correct string value for 'density'", 'color: #ff6060');
      return;
    }
  }

  if (userSettings && userSettings.type) {
    if (typeof userSettings.type === 'string' && ['squares', 'triangles', 'circles', 'squircles'].includes(userSettings.type)) {} else {
      console.log("%c Please provide a correct string value for 'type'", 'color: #ff6060');
      return;
    }
  } // Initialize settings


  var settings = {
    animate: userSettings && userSettings.animate || false,
    type: userSettings && userSettings.type ? userSettings.type : 'circles',
    density: userSettings && userSettings.density ? userSettings.density : 'med',
    themeColor: userSettings && userSettings.themeColor ? userSettings.themeColor : '#729bff',
    dark: userSettings && userSettings.dark || false
  };
  var scale = settings.density === 'high' ? 'small' : settings.density === 'low' ? 'large' : 'normal';
  var outframe = makeFrame(targetEle, false, null);
  var innerFrame = makeFrame(outframe, false, null, true);
  var background = makeFrame(targetEle, true, settings.themeColor, null, settings.dark);

  var _targetEle$getBoundin = targetEle.getBoundingClientRect(),
      height = _targetEle$getBoundin.height,
      width = _targetEle$getBoundin.width;

  var lastElementWidth = 0;
  var factor = scale === 'normal' ? 6 : scale === 'small' ? 8 : 3;
  var eleNumber = getNumberFromDensity(settings.density);

  if (settings.animate) {
    var cssText = "\n            .BetterBacks__animate{\n                animation: BetterBacksAnimations 10s linear infinite;\n            }\n            @keyframes BetterBacksAnimations {\n                0%{\n                    transform: translateY(0%); \n                }\n                100% {\n                    transform: translateY(-100%); \n                }\n            }\n        ";
    (0, _stylemaker.default)(cssText);
    innerFrame.classList.add('BetterBacks__animate');
  }

  for (var i = 1; i <= eleNumber; i++) {
    width -= 10;
    makeBackgroundElement(innerFrame, settings.type, height, width, factor, i, settings.scale, settings.dark);
  }

  var innerFrameClone = innerFrame.cloneNode(true);
  innerFrameClone.style.top = '100%';
  outframe.appendChild(innerFrameClone); // Makes background elements

  function makeBackgroundElement(parent, type, maxHeight, maxWidth, factor, i, scale, dark) {
    var child = document.createElement('DIV');
    var randomInt = randomIntFromInterval(Math.min(maxHeight / factor, maxWidth / factor), maxHeight / factor);
    child.style.width = randomInt + 'px';
    child.style.boxSizing = 'border-box';
    child.style.height = randomInt + 'px';
    child.style.zIndex = '-1';
    child.style.position = 'absolute';
    child.style.pointerEvents = 'none';
    child.style.filter = "brightness(".concat(dark ? randomIntFromInterval(50, 100) : randomIntFromInterval(100, 200), "%)");
    child.style.opacity = 0.1;
    var transformString = "rotate(".concat(randomIntFromInterval(0, 360), "deg) scale(").concat(randomIntFromInterval(1, 2), ")");
    child.style.transform = transformString;
    child.style.left = randomIntFromInterval(-10, 100) + '%';
    lastElementWidth += randomInt;
    child.style.top = randomIntFromInterval(0, maxHeight - maxHeight / factor) + 'px';
    child.style.borderColor = settings.themeColor;

    switch (type) {
      case 'squares':
        child.style.background = dark ? '#000000' : '#ffffff';
        break;

      case 'circles':
        child.style.border = "".concat(randomIntFromInterval(5, 20), "px solid");
        child.style.borderRadius = '50%';
        child.style.borderColor = dark ? '#000000' : '#ffffff';
        break;

      case 'squircles':
        child.style.borderRadius = '30%';
        child.style.background = dark ? '#000000' : '#ffffff';
        break;
    }

    parent.appendChild(child);
    return child;
  } // Makes frame and background


  function makeFrame(parent, background, themeColor, overflow, dark) {
    if (!(parent.style.position === 'absolute' || getComputedStyle(parent).position === 'absolute')) {
      parent.style.position = 'relative';
    }

    parent.style.background = 'rgba(255,255,255,0.1)';
    var frame = document.createElement('DIV');
    frame.style.position = 'absolute';
    frame.style.left = '0';
    frame.style.top = overflow ? '-00%' : '0%';
    frame.style.width = '100%';
    frame.style.height = overflow ? '100%' : '100%';
    frame.style.backgroundImage = background ? "linear-gradient(to bottom right, ".concat(themeColor, ", ").concat(lighten(themeColor, '-0.4'), ")") : null;
    frame.style.filter = background ? dark ? "brightness(160%) saturate(100%)" : "brightness(100%)" : null;
    frame.style.zIndex = background ? '-3' : '-1';
    frame.style.pointerEvents = 'none';
    frame.style.overflow = overflow ? 'visible' : 'hidden';
    frame.style.borderRadius = parent.style.borderRadius || getComputedStyle(parent).borderRadius;
    parent.appendChild(frame);
    return frame;
  }

  function getNumberFromDensity(density) {
    switch (density) {
      case 'low':
        return 10;

      case 'med':
        return 15;

      case 'high':
        return 20;
    }
  }

  function lighten(color, percent) {
    var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
  } // Make back elements
  // Make background
  // Add animation if any


  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
