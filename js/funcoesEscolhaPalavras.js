import palavras from './palavras.js';

/** 
 * Retorna uma lista de palavras aleatórias.
 */
function escolhePalavras(quantPalavras) {
    embaralhaPalavras();
    return palavras.slice(0, quantPalavras);
}//fim de escolhePalavras

/** 
 * Embaralha a ordem do array de strigs do arquivo palavras.js.
 * Usa o algoritmo de Fisher-Yates.
 */
function embaralhaPalavras() {
    for (let i = palavras.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let k = palavras[i];
        palavras[i] = palavras[j];
        palavras[j] = k;
    }
}//fim de embaralhaPalavras

export default escolhePalavras;