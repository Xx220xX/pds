
const expression = function (x, callback) {
    if (Array.isArray(x)) {
        return x.map(callback);
    }
    return callback(x)
}
const u = function (n) {
    return n >= 0 ? 1.0 : 0.0;
}

const delta = function (n) {
    return n == 0 ? 1. : 0.;
}

const productV = function (x, y) {
    return x.map((x, i) => x * y[i]);
}

// math functions
const e =  Math.exp(1);
const pi =  Math.PI;
const sin = (x) =>  Math.sin(x);
const cos = (x) =>  Math.sin(x);
const exp = (x)=>  Math.exp(x);
const log = (x)=>  Math.log(x);
const log10 = (x)=>  Math.log10(x);
const abs = (x)=>  Math.abs(x);

class Stem extends Chart.controllers.line {


    draw() {

        // Now we can do some custom drawing for this dataset. Here we'll draw a red box around the first point in each dataset
        const meta = this.getMeta();
        const ctx = this.chart.ctx;
        const yScale = this.chart.scales['y']; // Obter a escala do eixo y
        const baseY = yScale.getPixelForValue(0); // Pegar a posição do valor 0 no eixo y


        meta.data.forEach(p => {
            const { x, y } = p.getProps(['x', 'y']);
            if (y === baseY) {
                return
            }
            const pointColor = p.options.backgroundColor;
            ctx.strokeStyle = pointColor;
            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();

        });


        super.draw(...arguments);
    }
}
Stem.id = 'stem';
Chart.register(Stem);


function createChart(element_canvas_id, title, borderColor) {
    const ctx = document.getElementById(element_canvas_id).getContext('2d');
    const data = [{ x: 0, y: 12 }, { x: 1, y: 19 }, { x: 2, y: 3 }, { x: 3, y: 5 }, { x: 4, y: 2 }];
    // const randomColor =  `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
    const randomColor = `blue`;
    const chart = new Chart(ctx, {
        type: 'stem',
        data: {
            datasets: [{
                label: title,
                data: data,
                backgroundColor: randomColor,
                borderColor: randomColor,
                borderWidth: 2,
                pointRadius: 1,
                showLine: false,
            }]
        },
        options: {
            animation: {
                duration: 0 // Define a duração da animação em milissegundos (0 para desativar)
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    // min: -0.5, // Define o limite inferior do eixo y
                    // max: 1.5,  // Define o limite superior do eixo y
                    beginAtZero: false // Certifique-se de que não está forçando o início em zero
                }
            }
        }
    });

    async function update(x, y) {
        // limpa os dados de data
        data.splice(0, data.length);
        // aloca espaco para os novos objetos
        data.length = x.length;
        // adiciona os novos dados de x e y
        for (let i = 0; i < x.length; i++) {
            data[i] = { x: x[i], y: y[i] };
        }
        await chart.update();
    }
    async function fastUpdate(y) {
        // limpa os dados de data
        for (let i = 0; i < data.length; i++) {
            data[i].y = y[i];
        }
        await chart.update();
    }


    return { update, fastUpdate, ctx, data, chart };
}


function createMultiChart(element_canvas_id, titles) {
    const ctx = document.getElementById(element_canvas_id).getContext('2d');
   
    // const randomColor = `blue`;
    const datasets = [];
    
    for (const title of titles) {
        const randomColor =  `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
        const dt = new Array(1);
        dt[0] = { x: 0, y: 12 };
        datasets.push({
            label: title,
            data:  dt,
            backgroundColor: randomColor,
            borderColor: randomColor,
            borderWidth: 2,
            pointRadius: 1,
            showLine: false,
        })
        
    }
    const chart = new Chart(ctx, {
        type: 'stem',
        data: {
            datasets
        },
        options: {
            animation: {
                duration: 0 // Define a duração da animação em milissegundos (0 para desativar)
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    // min: -0.5, // Define o limite inferior do eixo y
                    // max: 1.5,  // Define o limite superior do eixo y
                    beginAtZero: false // Certifique-se de que não está forçando o início em zero
                }
            }
        }
    });

    async function update(x, y,dataset_id) {
        // limpa os dados de data
        const data = chart.data.datasets[dataset_id].data;
        data.splice(0, data.length);
        // aloca espaco para os novos objetos
        data.length = x.length;
        // adiciona os novos dados de x e y
        for (let i = 0; i < x.length; i++) {
            data[i] = { x: x[i], y: y[i] };
        }
        await chart.update();
    }
    async function fastUpdate(y,dataset_id) {
        const data = chart.data.datasets[dataset_id].data;
        // limpa os dados de data
        for (let i = 0; i < data.length; i++) {
            data[i].y = y[i];
        }
        await chart.update();
    }


    return { update, fastUpdate, ctx, chart };
}

