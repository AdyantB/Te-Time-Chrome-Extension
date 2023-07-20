const meeturl = document.getElementById('meeturl')
const meetname = document.getElementById('meetname')
const meetime = document.getElementById('meetime')
const setmeet = document.getElementById('setmeet')
// const shdlmeets = document.getElementById('sehedulemeets')

setmeet.addEventListener("click", (_) => {
    // Get the current time
    const now = new Date();
    
    const t1 = now.getHours() * 60 + now.getMinutes();
    const t2 = parseInt(meetime.value.split(":")[0]) * 60 + parseInt(meetime.value.split(":")[1]); 
    
    const diffInMinutes = t2 - t1;
    console.log(t1);
    console.log(t2);
    console.log(meetime.value);
    console.log(diffInMinutes);
    chrome.runtime.sendMessage({ event: "create_alarm" , time: diffInMinutes - 1, url: meeturl.value })
})
