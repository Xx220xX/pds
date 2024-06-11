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
const e = Math.exp(1);
const pi = Math.PI;
const sin = (x) => Math.sin(x);
const cos = (x) => Math.cos(x);
const exp = (x) => Math.exp(x);
const log = (x) => Math.log(x);
const log10 = (x) => Math.log10(x);
const abs = (x) => Math.abs(x);

const simpleRecursiveFunction = (code) => {
    code = code.replaceAll('^', '**');
    code = `(()=>{
        const local_function = (n)=>{return ${code}};
        const pre_results = {};
        const external_funcion = (n) => {
            if (n in pre_results) {
                return pre_results[n];
            } else {
                const result = local_function(n);
                pre_results[n] = result;
                return result;
            }
        }
        return external_funcion;
    })()`
    return eval(code);
}
const hardRecursiveFunction = (code) => {
    const condicoesCASE = /if\s*(-?\d+)\s*:/g;
    const condicoesIF = /if\s*(<=|>=|[<>])\s*([-+]{0,1}\d+):\s*(.+)/g;

    const numerosEncontrados = [];
    let match;

    let hasconditions = true;
    code = code.replaceAll('^', '**')
    // Iterar sobre todas as correspondências
    while ((match = condicoesCASE.exec(code)) !== null) {
        numerosEncontrados.push(parseInt(match[1])); // Capturar o número encontrado
    }

    if (numerosEncontrados.length == 0) {
        numerosEncontrados.push(0)
        hasconditions = false;
    }
    let pre_code = '';

    while ((match = condicoesIF.exec(code)) !== null) {
        pre_code += `\nif(n ${match[1]} ${match[2]})return ${match[3]};`;
        code = (code.substring(0, match.index) + code.substring(condicoesIF.lastIndex)).trim();
        condicoesIF.lastIndex = 0;
        // code = code.replace(condicoesIF, '',1)

    }

    const n_minimo = Math.min(...numerosEncontrados);
    if (hasconditions) {
        code = code.replaceAll(':', ': return ');
        code = code.replaceAll('if', 'case ');
        code = code.replace('otherwise', 'default');
        code = `(n)=>{${pre_code}\n switch(n) {\n${code}\n}} `;
    } else {

        code = code.replaceAll(/otherwise\s*:/g, '')

        code = `(n)=>{${pre_code}\n return ${code}\n}`;
    }
    code = `(()=>{
            const local_function = ${code};
            const pre_results = {};
            const external_funcion = (n) => {
                if (n in pre_results) {
                    return pre_results[n];
                } else {
                    const result = local_function(n);
                    pre_results[n] = result;
                    return result;
                }
            }
            return external_funcion;
        })()`


    return { f: eval(code), n_minimo }
}


const getURLParams = () => {
    const queryStringB64 = window.location.search;
    const queryString = atob(queryStringB64.substring(1));
    const urlParams = new URLSearchParams(queryString);
    // faz um json da querystring
    const params = Object.fromEntries(urlParams.entries());
    return { ...params }
}
const setURLParams = (params) => {
    const queryString = new URLSearchParams(params).toString();
    const queryStringB64 = btoa(queryString);
    window.history.replaceState(null, null, `?${queryStringB64}`);
}


