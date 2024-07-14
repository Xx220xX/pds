/**
 * Class for generating FIR filters.
 * @param {number} df - The sampling frequency of the signal.
 * @param {number} f0 - The lower frequency of the filter.
 * @param {number} f1 - The upper frequency of the filter.
 * @param {number} Fs - The sampling frequency of the filter.
 * @param {number} delta - The ripple.
 * @return {Object} An object containing the filter coefficients, the filter order, the filter name, and the stopband ripple.
 */
const FIR = (() => {
    const PI2 = 2 * Math.PI;
    const PI4 = 4 * Math.PI;
    const fat = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1.1240007277776077e+21, 2.585201673888498e+22, 6.204484017332394e+23, 1.5511210043330986e+25, 4.0329146112660565e+26, 1.0888869450418352e+28, 3.0488834461171384e+29, 8.841761993739701e+30, 2.6525285981219103e+32, 8.222838654177922e+33, 2.631308369336935e+35, 8.683317618811886e+36, 2.9523279903960412e+38, 1.0333147966386144e+40, 3.719933267899012e+41, 1.3763753091226343e+43, 5.23022617466601e+44, 2.0397882081197442e+46, 8.159152832478977e+47, 3.3452526613163803e+49, 1.4050061177528798e+51, 6.041526306337383e+52, 2.6582715747884485e+54, 1.1962222086548019e+56, 5.5026221598120885e+57, 2.5862324151116818e+59, 1.2413915592536073e+61, 6.082818640342675e+62, 3.0414093201713376e+64, 1.5511187532873822e+66, 8.065817517094388e+67, 4.2748832840600255e+69, 2.308436973392414e+71, 1.2696403353658276e+73, 7.109985878048635e+74, 4.052691950487722e+76, 2.350561331282879e+78, 1.3868311854568986e+80, 8.320987112741392e+81, 5.075802138772248e+83, 3.146997326038794e+85, 1.98260831540444e+87, 1.2688693218588417e+89, 8.247650592082472e+90, 5.443449390774431e+92, 3.647111091818868e+94, 2.4800355424368305e+96, 1.711224524281413e+98, 1.197857166996989e+100, 8.504785885678622e+101, 6.123445837688608e+103, 4.4701154615126834e+105, 3.3078854415193856e+107, 2.480914081139539e+109, 1.8854947016660498e+111, 1.4518309202828584e+113, 1.1324281178206295e+115, 8.946182130782973e+116, 7.156945704626378e+118, 5.797126020747366e+120, 4.75364333701284e+122, 3.945523969720657e+124, 3.314240134565352e+126, 2.8171041143805494e+128, 2.4227095383672724e+130, 2.107757298379527e+132, 1.8548264225739836e+134, 1.6507955160908452e+136, 1.4857159644817607e+138, 1.3520015276784023e+140, 1.24384140546413e+142, 1.1567725070816409e+144, 1.0873661566567424e+146, 1.0329978488239052e+148, 9.916779348709491e+149, 9.619275968248206e+151, 9.426890448883242e+153, 9.33262154439441e+155, 9.33262154439441e+157, 9.425947759838354e+159, 9.614466715035121e+161, 9.902900716486175e+163, 1.0299016745145622e+166];

    /**
     * Calculates the factorial of a given number recursively.
     *
     * @param {number} n - The number for which to calculate the factorial.
     * @return {number} The factorial of the given number.
     */
    const fatoral = (n) => {
        if (fat.length <= n) {
            fat.push(fatoral(n - 1) * n)
        }
        return fat[n];
    }

    /**
     * Calculate the zeroth-order modified Bessel function of the first kind for a given input.
     *
     * @param {number} x - The input value for the function
     * @return {number} The result of the zeroth-order modified Bessel function
     */
    const I0 = (x, maxIterations = 100) => {
        let sum = 1;
        let term;
        let k = 1;
        do {
            const factorialK = fatoral(k);
            const numerator = Math.pow(x / 2, k);
            term = Math.pow(numerator / factorialK, 2);
            sum += term;
            k++;
        } while (term > 1e-15 && k < maxIterations); // Continue until the term is very small or max iterations reached

        return sum;
    }

    /**
     * Generates an array of values based on the given window function.
     *
     * @param {number} N - The length of the array.
     * @param {function} win - The window function to apply.
     * @return {Array} An array of values generated based on the window function.
     */
    const Gerarh_n = (N, wc, win) => {
        const n2 = N / 2;
        return Array(N + 1).fill().map((_, i) => {
            const n = i - n2;
            const w = win(i);
            if (n === 0) {
                return w * wc;
            }
            return Math.sin(wc * Math.PI * n) / (Math.PI * n) * w;
        });
    }
    const TFDFT = async (signal, w) => {
       
        fourier = (w) => {
            let s = { re: 0, im: 0 }
            for (let i = 0; i < signal.length; i++) {
                s.re += signal[i] * Math.cos(  w * i);
                s.im += signal[i] * Math.sin(- w * i);
            }
            return { abs: Math.sqrt(s.re * s.re + s.im * s.im), phase: Math.atan2(s.im, s.re) };
        }
        
        return w.map(fourier);
    }


    /**
     * Generates a rectangle window function with the specified parameters.
     *
     * @param {number} f0 - The lower frequency bound [Hz].
     * @param {number} f1 - The upper frequency bound [Hz].
     * @param {number} Fs - The sampling frequency [Hz].
     * @return {Object} An object containing the window function details and h coefficients.
     */
    const Rectangle = (f0, f1, Fs) => {

        const df = (f1 - f0) / Fs;
        const wc = (f0 + f1) / Fs
        const N = Math.ceil(0.9 / df);
        const window = (n) => (0 <= n <= N) ? 1 : 0;
        const h = Gerarh_n(N, wc, window)
        return {
            Fs, 
            wc,
            df,
            name: 'Rectangle',
            window,
            N,
            h,
            side_lobe_amplitude: -13,
            stopband_attenuation: -21,
        }
    }


    /**
     * A function that calculates the Hanning window parameters based on the input frequencies and sampling rate.
     *
     * @param {number} f0 - The lower frequency bound [Hz].
     * @param {number} f1 - The upper frequency bound [Hz].
     * @param {number} Fs - The sampling rate [Hz].
     * @return {Object} An object containing the calculated parameters for the Hanning window.
     */
    const Hanning = (f0, f1, Fs) => {
        const df = (f1 - f0) / Fs;
        const wc = (f0 + f1) / Fs
        const N = Math.ceil(3.1 / df);
        const window = (n) => (0 <= n <= N) ? (0.5 - 0.5 * Math.cos((PI2 * n) / N)) : 0;
        const h = Gerarh_n(N, wc, window)
        return {
            Fs, 
            wc,
            N, 
            df,
            name: 'Hanning',
            window,
            h,
            side_lobe_amplitude: -31,
            stopband_attenuation: -44,
        }
    }

    /**
     * Generates the Hamming window parameters based on the input frequencies and sampling rate.
     *
     * @param {number} f0 - The lower frequency bound [Hz].
     * @param {number} f1 - The upper frequency bound [Hz].
     * @param {number} Fs - The sampling rate [Hz].
     * @return {Object} An object containing the calculated parameters for the Hamming window.
     *                  The object has the following properties:
     *                  - name: The name of the window ('Hamming').
     *                  - Fs: The sampling rate [Hz].
     *                  - wc: The center frequency of the window [Hz].
     *                  - window: A function that calculates the Hamming window value for a given index.
     *                  - side_lobe_amplitude: The amplitude of the side lobes in decibels.
     *                  - stopband_attenuation: The attenuation of the stopband in decibels.
     *                  - N: The number of samples in the window.
     *                  - h: The Hamming window coefficients.
     */
    const Hamming = (f0, f1, Fs) => {
        const df = (f1 - f0) / Fs;
        const wc = (f0 + f1) / Fs
        const N = Math.ceil(3.3 / df);
        const window = n => (0 <= n <= N) ? (0.54 - 0.46 * Math.cos((PI2 * n) / N)) : 0;
        const h = Gerarh_n(N, wc, window);
        return {
            name: 'Hamming',
            f0, f1, Fs, wc,
            window,
            side_lobe_amplitude: -41,
            stopband_attenuation: -53,
            N,
            h
        }
    }

    /**
     * A function that calculates the Blackman window parameters based on the input frequencies and sampling rate.
     *
     * @param {number} f0 - The lower frequency bound [Hz].
     * @param {number} f1 - The upper frequency bound [Hz].
     * @param {number} Fs - The sampling rate [Hz].
     * @return {Object} An object containing the calculated parameters for the Blackman window.
     */
    const Blackman = (f0, f1, Fs) => {
        const df = (f1 - f0) / Fs;
        const wc = (f0 + f1) / Fs
        const N = Math.ceil(5.5 / df);
        const window = (n) => (0 <= n <= N) ? (0.42 - 0.5 * Math.cos((PI2 * n) / N) + 0.08 * Math.cos((PI4 * n) / N)) : 0;
        return {
            name: 'Blackman',
            Fs, wc,
            window,
            h: Gerarh_n(N, wc, window),
            side_lobe_amplitude: -57,
            stopband_attenuation: -74,
            N: N
        }
    }

    /**
     * Calculates the Kayser window parameters based on the input frequencies and sampling rate.
     *
     * @param {number} f0 - The lower frequency bound [Hz].
     * @param {number} f1 - The upper frequency bound [Hz].
     * @param {number} Fs - The sampling rate [Hz].
     * @param {number} delta - The attenuation factor.
     * @return {Object} An object containing the calculated parameters for the Kayser window.
     */
    const Kayser = (f0, f1, Fs, delta) => {
        const as = -20 * Math.log10(delta);
        const df = (f1 - f0) / Fs;
        const wc = (f0 + f1) / Fs
        const N = Math.ceil((as > 21) ? ((as - 7.95) / (14.36 * delta)) : (0.9 / df));
        const alpha = N / 2;
        const Beta = as > 50 ? 0.1102 * (as - 8.7) : (as > 21 ? (0.5842 * Math.pow(as - 21, 0.4) + 0.07886 * (as - 21)) : 0);
        const I0B = I0(Beta);
        /**
         * Calculate and return the value based on the input parameter.
         *
         * @param {number} n - The input parameter for the calculation.
         * @return {number} The calculated value based on the input.
         */
        const window = (n) => {
            if (0 <= n <= N) {
                return I0(Beta * Math.pow(1 - Math.pow((n - alpha) / (alpha), 2), 0.5)) / I0B;
            }
            return 0;
        }
        side_lobe_amplitude = -20 * Math.log10(1 - delta);
        stopband_attenuation = -20 * Math.log10(delta);
        return {
            Fs, wc, df, I0B,
            name: 'Kayser',
            as,
            alpha,
            Beta,
            window,
            h: Gerarh_n(N, wc, window),
            side_lobe_amplitude,
            stopband_attenuation,
            N: N
        }
    }
    return { Rectangle, Hanning, Hamming, Blackman, Kayser , TFDFT}
})();