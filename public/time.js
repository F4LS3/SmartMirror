function msToTime(ms) {
    let date = new Date(ms);

    let hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
    let minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();

    return `${hours}:${minutes}`;
}

function msToTimeWithSeconds(ms) {
    let date = new Date(ms);

    let hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
    let minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
    let seconds = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
}

function getDate() {
    let date = new Date();

    let dd = String(date.getDate()).padStart(2, '0');
    let yyyy = date.getFullYear();

    date = `${getDay(date.getDay())}, ${dd}. ${getMonth(date.getMonth())} ${yyyy}`;
    return date;
}

function getMonth(num) {
    let month;

    switch (num) {
        case 0:
            month = "Januar";
            break;

        case 1:
            month = "Februar";
            break;

        case 2:
            month = "März";
            break;

        case 3:
            month = "April";
            break;

        case 4:
            month = "Mai";
            break;

        case 5:
            month = "Juni";
            break;

        case 6:
            month = "Juli";
            break;

        case 7:
            month = "August";
            break;

        case 8:
            month = "September";
            break;

        case 9:
            month = "Oktober";
            break;

        case 10:
            month = "November";
            break;

        case 11:
            month = "Dezember";
            break;
    }

    return month;
}

function getDay(num) {
    let day;
    switch (num) {
        case 1:
            day = "Montag";
            break;

        case 2:
            day = "Dienstag";
            break;

        case 3:
            day = "Mittwoch";
            break;

        case 4:
            day = "Donnerstag";
            break;

        case 5:
            day = "Freitag";
            break;

        case 6:
            day = "Samstag";
            break;

        case 0:
            day = "Sonntag";
            break;
    }

    return day;
}

function isNight() {
    const hours = new Date(Date.now()).getHours();
    return hours > 18 || hours <= 4;
}

function startTime() {
    document.querySelectorAll(".time").forEach(element => {
        if (element.classList.contains("clock")) element.textContent = msToTimeWithSeconds(Date.now());
        else element.textContent = msToTime(Date.now());
    });

    setTimeout(startTime, 500);
}

function startDate() {
    document.querySelector("#main-date").textContent = getDate();
    setTimeout(startDate, 500);
}