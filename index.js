import { CHANNEL_DATA } from "./assets/data.js";

const tvButton = $("#tvButton");
const tvSwitch = $("#tvSwitch");
const tvDisplay = $("#tvDisplay");
const remotePowerBtn = $("#remotePowerBtn");
const volumeIncreaseBtn = $("#volumeIncreaseBtn");
const volumeDecreaseBtn = $("#volumeDecreaseBtn");
const channelIncreaseBtn = $("#channelIncreaseBtn");
const channelDecreaseBtn = $("#channelDecreaseBtn");
const channelNumber = $("#channelNumber");
const volumeContainer = $("#volumeContainer");
const volumeCount = volumeContainer.find("span");
const volumeCountSlider = volumeContainer.find("input");
const tvDisplayVideo = $("#tvDisplayVideo");
const tvDisplaySource = $("#tvDisplaySource");
const subscribeContainer = $("#subscribeContainer");
const subscribeButton = $("#subscribeButton");
const CHANNEL_COUNT = 50;
const VOLUME_COUNT = 50;
const SUBSCRIBED_CHANNELS = Array.from(new Array(25), (x, i) => i);
var isTvOn = false;
var tvVolumeCount = 20;
var tvChannelNumber = 1;

const timedDisplayHide = (element) => {
  element.removeClass("display-none");
  setTimeout(() => {
    element.addClass("display-none");
  }, 5000);
};

// switching on tv

tvSwitch.click(() => {
  if (isTvOn) {
    tvButton.removeClass("tv-on tv-off");
    tvDisplay.addClass("display-none");
    tvSwitch.removeClass("switch-on");
    tvDisplayVideo.trigger("pause");
    tvDisplaySource.attr("src", "");
    isTvOn = false;
  } else {
    tvButton.addClass("tv-on");
    tvDisplay.removeClass("display-none");
    tvSwitch.addClass("switch-on");
    changeChannel();
    changeVolume();
    isTvOn = true;
  }
});

// tv power buttons

const powerTv = () => {
  if (isTvOn) {
    if (tvButton.hasClass("tv-on")) {
      tvDisplay.addClass("display-none");
      tvDisplayVideo.trigger("pause");
      tvDisplaySource.attr("src", "");
    } else {
      tvDisplay.removeClass("display-none");
      changeChannel();
      changeVolume();
    }
    tvButton.toggleClass("tv-on tv-off");
  }
};

tvButton.click(() => powerTv());
remotePowerBtn.click(() => powerTv());

// channel change buttons

const changeChannel = () => {
  timedDisplayHide(channelNumber);
  channelNumber.text(tvChannelNumber);
  if (jQuery.inArray(tvChannelNumber, SUBSCRIBED_CHANNELS) !== -1) {
    subscribeContainer.addClass("display-none");
    tvDisplayVideo.removeClass("display-none");
    tvDisplaySource.attr("src", `https://drive.google.com/uc?export=download&id=${CHANNEL_DATA[tvChannelNumber % 10]}`);
    tvDisplayVideo.trigger("load");
  } else {
    tvDisplayVideo.addClass("display-none");
    tvDisplayVideo.trigger("pause");
    tvDisplaySource.attr("src", "");
    subscribeContainer.removeClass("display-none");
  }
};

channelIncreaseBtn.click(() => {
  if (isTvOn) {
    tvChannelNumber = (tvChannelNumber % CHANNEL_COUNT) + 1;
    changeChannel();
  }
});

channelDecreaseBtn.click(() => {
  if (isTvOn) {
    tvChannelNumber = tvChannelNumber > 1 ? tvChannelNumber - 1 : CHANNEL_COUNT;
    changeChannel();
  }
});

// volume change buttons

const changeVolume = () => {
  timedDisplayHide(volumeContainer);
  volumeCount.text(tvVolumeCount);
  volumeCountSlider.val(tvVolumeCount);
  let value = (tvVolumeCount / VOLUME_COUNT) * 100;
  volumeCountSlider.css(
    "background",
    "linear-gradient(to right, #ffffff 0%, #ffffff " + value + "%, rgba(255,255,255,0) " + value + "%, rgba(255,255,255,0) 100%)"
  );
  tvDisplayVideo.prop("volume", value / 100);
};

volumeIncreaseBtn.click(() => {
  if (isTvOn) {
    tvVolumeCount = tvVolumeCount < VOLUME_COUNT ? tvVolumeCount + 1 : tvVolumeCount;
    changeVolume();
  }
});

volumeDecreaseBtn.click(() => {
  if (isTvOn) {
    tvVolumeCount = tvVolumeCount > 1 ? tvVolumeCount - 1 : tvVolumeCount;
    changeVolume();
  }
});

// channel subscriptions

subscribeButton.click(() => {
  SUBSCRIBED_CHANNELS.push(tvChannelNumber);
  changeChannel();
});

//on page load

$(document).ready(() => {
  volumeCountSlider.attr("max", VOLUME_COUNT);
});
