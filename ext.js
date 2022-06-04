// JavaScript source code


const ext = {
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    howLongAgo(dateTime) {

        function quotient(a, b) {
            return Math.floor(a / b);
        }

        let currentDateTime = Date.parse(new Date());
        console.log(currentDateTime);
        let actualDateTime = dateTime;
        let difference = currentDateTime - actualDateTime;
        let seconds = difference / 1000;
        const sSeconds = 60;
        const sMinutes = 60 * 60;
        const sHours = 48 * 60 * 60; //display upto 48 hours
        const sDays = 7 * 24 * 60 * 60;
        const sWeeks = 52.143 * 7 * 24 * 60 * 60;
        const sYears = 365 * 24 * 60 * 60;

        let output = "";

        switch (true) {
            case (seconds < sSeconds):
                return "Just now";
                break;
            case (seconds < sMinutes):
                return `${quotient(seconds, sSeconds)} minute${quotient(seconds, sSeconds) === 1 ? "" : "s"} ago`;
                break;
            case (seconds < sHours):
                return `${quotient(seconds, sMinutes)} hour${quotient(seconds, sMinutes) === 1 ? "" : "s"} ago`;
                break;
            case (seconds < sDays):
                return `${quotient(seconds, 24 * 60 * 60)} days ago`;
                break;
            case (seconds < sWeeks):
                return `${quotient(seconds, sDays)} week${quotient(seconds, sDays) === 1 ? "" : "s"} ago`;
                break;
            case (seconds > sYears):
                return `${quotient(seconds, sYears)} year${quotient(seconds, sYears) === 1 ? "" : "s"} ago`;
                break;
            default:
                return new Date(actualDateTime).toDateString();
        }

    }, //howLongAgo ends here

    getDay(epoch) {
        const x = new Date(epoch).getUTCDay();
        switch (x) {
            case 0: return "Sunday";
                break;
            case 1: return "Monday";
                break;
            case 2: return "Tuesday";
                break;
            case 3: return "Wednesday";
                break;
            case 4: return "Thursday";
                break;
            case 5: return "Friday";
                break;
            case 6: return "Saturday";
                break;
            
            default: return "";
        }
    },

    getTime(epoch) {
        const time = new Date(epoch).toTimeString().split("+")[0];
        return time;
        //review
    }
}


