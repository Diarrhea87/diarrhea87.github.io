onmessage = (e) => {
    console.log('Message received from "onsets_script.js"')
    console.log(e.data)
    let stopTimer = new Date();
    console.log(" WORKER TIME" + (stopTimer.getTime() - e.data.getTime())/1000 + " SECONDS");
    setInterval(() => {
        console.log('10 Seconds')
        postMessage('Terminate')
    }, 5000)
}