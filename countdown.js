class Countdown {
    constructor(seconds) {
        this.order = [
            "digit-zero",
            "digit-one",
            "digit-two",
            "digit-three",
            "digit-four",
            "digit-five",
            "digit-six",
            "digit-seven",
            "digit-eight",
            "digit-nine",
        ];

        this.container = document.querySelector(".countdown-container");
        this.format = this.container.getAttribute("data-format");
        this.mode = this.container.getAttribute("data-mode");
        if (this.mode === "up") {
            this.maxSecs = parseInt(this.container.getAttribute("data-max-secs"));
        }

        this.seconds = seconds;
        this.initialize();
    }

    initialize() {
        this.container.innerHTML = "";
        this.cells = [];

        switch (this.format) {
            case "ss":
                this.cells.push(this.addCell("seconds-tens"));
                this.cells.push(this.addCell("seconds-units"));
                break;
            case "mm:ss":
                this.cells.push(this.addCell("minutes-tens"));
                this.cells.push(this.addCell("minutes-units"));
                this.addCell("separator");
                this.cells.push(this.addCell("seconds-tens"));
                this.cells.push(this.addCell("seconds-units"));
                break;
            case "hh:mm:ss":
            default:
                this.cells.push(this.addCell("hours-tens"));
                this.cells.push(this.addCell("hours-units"));
                this.addCell("separator");
                this.cells.push(this.addCell("minutes-tens"));
                this.cells.push(this.addCell("minutes-units"));
                this.addCell("separator");
                this.cells.push(this.addCell("seconds-tens"));
                this.cells.push(this.addCell("seconds-units"));
                break;
        }

        this.cells.reverse();

        this.secondsCounter = this.seconds;
        let init = Countdown.parseSeconds(0);
        this.current = Countdown.parseSeconds(this.secondsCounter);

        let i = 0;
        for (let cell of this.cells) {
            this.swap(cell.classList, init[i], this.current[i]);
            i += 1;
        }
    }

    addCell(type) {
        let subDiv;
        if (type === "separator") {
            let div = document.createElement("div");
            div.classList.add("digit-cell");
            subDiv = document.createElement("div");
            subDiv.classList.add("digit-separator");
            div.appendChild(subDiv);
            this.container.appendChild(div);
        }
        else {
            let div = document.createElement("div");
            div.classList.add("digit-cell");
            subDiv = document.createElement("div");
            subDiv.classList.add("digit-number", type, "digit-zero");
            div.appendChild(subDiv);
            this.container.appendChild(div);
        }
        return subDiv;
    }

    static parseSeconds(value) {
        let secNum = parseInt(value, 10);
        let hours = Math.floor(secNum / 3600);
        let minutes = Math.floor((secNum - (hours * 3600)) / 60);
        let seconds = secNum - (hours * 3600) - (minutes * 60);

        return [
            (seconds < 10)?seconds:(seconds%10),
            (seconds < 10)?0:Math.floor(seconds/10),
            (minutes < 10)?minutes:(minutes%10),
            (minutes < 10)?0:Math.floor(minutes/10),
            (hours < 10)?hours:(hours%10),
            (hours < 10)?0:Math.floor(hours/10)
        ]
    }

    swap(element, prev, curr) {
        element.remove(this.order[prev]);
        element.add(this.order[curr]);
    }

    end() {
        switch (this.mode) {
            case "down":
            default:
                if (this.secondsCounter === 0) {
                    this.stop();
                }
                break;
            case "up":
                if (this.secondsCounter === this.maxSecs) {
                    this.stop();
                }
                break;
        }
    }

    start() {
        if (this.intervalID != null) {
            this.stop();
        }
        this.intervalID = setInterval( () => {
            switch (this.mode) {
                case "down":
                default:
                    this.secondsCounter -= 1;
                    break;
                case "up":
                    this.secondsCounter += 1;
                    break;
            }

            const next = Countdown.parseSeconds(this.secondsCounter);

            let i = 0;
            for (let cell of this.cells) {
                this.swap(cell.classList, this.current[i], next[i]);
                i += 1;
            }

            this.current = next;

            this.end();
        }, 1000);
    }

    stop() {
        clearInterval(this.intervalID);
        this.intervalID = null;
        setTimeout(() => {
            this.initialize();
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let secs = 60;
    let isPressed = null;
    let countdown = new Countdown(secs);

    document.querySelector("#start-button").addEventListener("click", () => {
        countdown.start();
    });
    document.querySelector("#stop-button").addEventListener("click", () => {
        countdown.stop();
    });
    document.querySelector("#add-button").addEventListener("mousedown", () => {
        isPressed = setInterval(() => {
            secs += 1;
            countdown = new Countdown(secs);
        }, 50);
    }, false);
    document.querySelector("#add-button").addEventListener("mouseup", () => {
        clearInterval(isPressed)
    }, false);
    document.querySelector("#sub-button").addEventListener("mousedown", () => {
        isPressed = setInterval(() => {
            secs -= 1;
            countdown = new Countdown(secs);
        }, 50);
    }, false);
    document.querySelector("#sub-button").addEventListener("mouseup", () => {
        clearInterval(isPressed)
    }, false);
});
