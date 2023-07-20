const timer = document.getElementById("time");
const timerDescription = document.getElementById("timelable");

function formatSeconds(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    const finalTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
    return finalTime;
}

chrome.storage.local.get(["counter", "isWorkTime"]).then((values) => {
    if(values.counter !== 0) {
        timer.innerText = formatSeconds(values.counter ?? 0);
        timerDescription.innerText = values.isWorkTime ? "Work Time Remaining" : "Break Time Remaining";
        startTimer(true);
    }
})


var timerId = 0;

const startButton = document.getElementById("strtbtn");
const restartButton = document.getElementById("restrbtn");


startButton.addEventListener("click", (_) => {
    startTimer(false);
})

restartButton.addEventListener("click", (_) => {
    resetTimer();
})

function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}  

const startTimer = (isInit) => {

    if(!isInit) chrome.runtime.sendMessage({ event: "start_timer" }, (_) => {});
    timerId = setInterval(() => {
        chrome.storage.local.get(["counter", "isWorkTime"]).then((values) => {
            timer.innerText = formatSeconds(values.counter ?? 0);
            timerDescription.innerText = values.isWorkTime ? "Work Time Remaining" : "Break Time Remaining";
        })
    }, 1000);
}

const resetTimer = () => {
    chrome.runtime.sendMessage({ event: "reset_timer" });
    timer.innerHTML = "00:00";
    timerDescription.innerText = "Work Time Remaining";
    clearInterval(timerId);
}

// Timer Options

const workTime = document.getElementById("workTime");
const breakTime = document.getElementById("breakTime");
const saveButton = document.getElementById("save");

chrome.storage.local.get(["workTime", "breakTime"]).then((values) => {
    workTime.value = values.workTime ?? 25;
    breakTime.value = values.breakTime ?? 5;
})

saveButton.onclick = (_) => {
    chrome.storage.local.set({workTime: workTime.value, breakTime: breakTime.value});
}