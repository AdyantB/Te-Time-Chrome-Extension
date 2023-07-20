var timerId = 0;

const setDefaultValues = () => {
    chrome.storage.local.get(["workTime", "breakTime"]).then((values) => {
        chrome.storage.local.set({ 
            workTime: values.workTime ?? 25, 
            breakTime: values.breakTime ?? 5, 
            isWorkTime: true,
            counter: 0,
        });
    })
}


setDefaultValues();

// Listen for the alarm to go off
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'meetingAlarm') {
      // Create the notification with the meeting link
      chrome.notifications.create({
        type: 'basic',
        iconUrl: "assets/logo/tetime_logo.png",
        title: 'Meeting Reminder',
        message: 'Click here to join the meeting',
        requireInteraction: true,
      });
    }

    // Listen for the user to click on the notification
    chrome.notifications.onClicked.addListener(notificationId => {
        chrome.storage.local.get(["meetingLink"]).then((values) => {
            chrome.tabs.create({ url: values.meetingLink });
        })
    });
  });

// Function to create the meeting alarm
function createMeetingAlarm(delayInMinutes, meetingLink) {
    // Set the alarm to trigger at the meeting time
    chrome.alarms.create('meetingAlarm', {
        delayInMinutes: delayInMinutes,
    });

    chrome.storage.local.set({
        meetingLink,
    })
}

chrome.runtime.onMessage.addListener((req, _, __) => {
    console.log("Got Event");
    if (req.event == "start_timer") {
        startTimer();
    } else if (req.event == "reset_timer") {
        resetTimer();
    } else if(req.event == "create_alarm") {
        createMeetingAlarm(req.time, req.url);
    }
});

const startTimer = () => {
    clearInterval(timerId);
    chrome.storage.local.get(["counter", "workTime"]).then((values) => {
        chrome.storage.local.set({ 
            counter: values.workTime * 60,
        }).then((_) => {
            timerId = setInterval(() => {
                chrome.storage.local.get(["workTime", "breakTime", "isWorkTime", "counter"]).then((values) => {
                    if(values.counter === 0) {
                        if(values.isWorkTime) {
                            chrome.storage.local.set({ 
                                isWorkTime: false,
                                counter: values.breakTime * 60,
                            });
                            chrome.notifications.create({
                                type: "basic",
                                iconUrl: "assets/logo/tetime_logo.png",
                                title: "Te Time",
                                message: "It's break time.",
                                silent: false,
                            },function(id) { console.log("Last error:", chrome.runtime.lastError); });
                            
                        } else {
                            chrome.storage.local.set({ 
                                isWorkTime: true,
                                counter: values.workTime * 60,
                            });
                            chrome.notifications.create({
                                type: "basic",
                                iconUrl: "assets/logo/tetime_logo.png",
                                title: "Te Time",
                                message: "It's work time! Reload tab to Resume Work",
                                silent: false,
                            },function(id) { console.log("Last error:", chrome.runtime.lastError); });
                        }
                    } else {
                        chrome.storage.local.set({ 
                            counter: values.counter - 1,
                        });
                    }
                })
            }, 1000);
        });
    })
}

const resetTimer = () => {
    clearInterval(timerId);
    setDefaultValues();
}

