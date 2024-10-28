import palavras from './palavras.js';

function escolhePalavras(quantPalavras) {
    embaralhaPalavras();
    return palavras.slice(0, quantPalavras);
}

function embaralhaPalavras() {
    for (let i = palavras.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let k = palavras[i];
        palavras[i] = palavras[j];
        palavras[j] = k;
    }
}

export default escolhePalavras;