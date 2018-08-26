class Roulette {
    constructor(names) {
        this.names = names;
        this.next = 0;
        this.container = document.querySelector(".roulette > .cells");
        let cell = document.createElement("div");
        cell.innerHTML = this.names[this.next % this.names.length];
        this.container.appendChild(cell);
    }

    step() {
        let cells = this.container.getElementsByTagName("div");
        this.container.classList.add("cells-move");
        setTimeout( () => {
            this.container.classList.add("cells-block");
            setTimeout( () => {
                this.container.classList.remove("cells-move");
                this.container.removeChild(cells[0]);
                this.next += 1;
                let cell = document.createElement("div");
                cell.innerHTML = this.names[this.next % this.names.length];
                this.container.appendChild(cell);
                setTimeout(() => {
                    this.container.classList.remove("cells-block");
                }, 10);
            }, 10);
        }, 50);

    }

}

document.addEventListener('DOMContentLoaded', () => {
    const roulette = new Roulette(['dima', 'edu', 'fran', 'jorge', 'melvin','miguel','néstor']);

    document.querySelector(".roulette").addEventListener("click", () => {
        const id = setInterval( () => {
            roulette.step();
        }, 100);
        setTimeout(() => {
            clearInterval(id);
        }, Math.floor(Math.random() * 2500) + 1500 );
    });
});