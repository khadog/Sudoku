const getTimerFormat = (timer: number) => {
    let hours:string | number = Math.floor(timer / 3600);
    let minutes:string | number = Math.floor((timer - (hours * 3600)) / 60);
    let seconds:string | number = timer - (hours * 3600) - (minutes * 60);

    // if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0"+minutes;
    if (seconds < 10) seconds = "0"+seconds;
    return minutes + ':' + seconds;
};

export {getTimerFormat}