
const expression = function (x, callback) {
    if (Array.isArray(x)) {
        return x.map(callback);
    }
    return callback(x)
}

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


function createMultiChart(element_canvas_id, curves, title, type = 'stem') {
    const ctx = document.getElementById(element_canvas_id).getContext('2d');

    // const randomColor = `blue`;
    const datasets = [];
    curves = curves.map(curve => {
        if (typeof(curve) === 'string') {
            return { label: curve };
        }
        return curve;
    })
        
        

    for (const curve of curves) {
        const randomColor = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
        const dt = new Array(2);
        dt[0] = { x: 0, y: 1 };
        dt[1] = { x: 1, y: 12 };
        datasets.push({
            data: dt,
            backgroundColor: randomColor,
            borderColor: randomColor,
            borderWidth: 2,
            pointRadius: 1,
            showLine: false,
            ...curve
        })

    }
    const chart = new Chart(ctx, {
        type,
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
            , plugins: {
                title: {
                    display: true,
                    text: title,
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        }
    });

    async function update(x, y, dataset_id) {
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
    async function fastUpdate(y, dataset_id) {
        const data = chart.data.datasets[dataset_id].data;
        // limpa os dados de data
        for (let i = 0; i < data.length; i++) {
            data[i].y = y[i];
        }
        await chart.update();
    }


    return { update, fastUpdate, ctx, chart };
}

