import escolhePalavras from './funcoesEscolhaPalavras.js';

/** 
 * 
 */
window.onload = () => {
    const controles = {
        painelPalavrasEsquerdo: document.querySelector(".painel-palavras-esquerdo"),
        painelPalavrasDireito: document.querySelector(".painel-palavras-direito"),
        mensagemInicial: document.querySelector(".mensagem-inicial"),
        botaoIniciar: document.querySelector(".botao-iniciar"),
        botaoCancelar: document.querySelector(".botao-cancelar"),
        seletorTempo: document.querySelector(".seletor-tempo"),
        seletorQuantidade: document.querySelector(".seletor-quantidade"),
        outputTempo: document.querySelector(".output-tempo"),
        painelInferior: document.querySelector(".painel-inferior"),
        blocoInputPalavra: document.querySelector(".bloco-input-palavra"),
        blocoBotoesLista: document.querySelector(".bloco-botoes-lista"),
        inputPalavra: document.querySelector(".input-palavra"),
        botaoInserir: document.querySelector(".botao-inserir"),
        listaLembradas: document.querySelector(".lista-lembradas"),
        botaoRemoverSelecionadas: document.querySelector(".botao-remover-selecionadas"),
        outputAcertos: document.querySelector(".output-acertos"),
        listaSubstituta: document.querySelector(".lista-substituta")
    };

    const auxiliar = {
        timer: null,
        escolhidas: null,
        tempo: new Date()
    };

    controles.botaoIniciar.onclick = () => executarBotaoIniciar(controles, auxiliar);
    controles.botaoCancelar.onclick = () => executarBotaoCancelar(controles, auxiliar);
    controles.seletorTempo.oninput = () => selecionarTempo(controles);
    controles.botaoInserir.onclick = () => inserirPalavra(controles);
    controles.inputPalavra.onkeydown = (evento) => inserirPalavraComEnter(controles, evento);
    controles.botaoRemoverSelecionadas.onclick = () => removerPalavrasSelecionadas(controles);
    controles.listaSubstituta.onclick = () => acessarListaLembradas(controles);
    controles.listaLembradas.oninput = () => selecionarNaListaSubstituta(controles);

    habilitarElementos(false, controles.botaoCancelar, controles.listaLembradas, controles.inputPalavra);
    controles.painelInferior.style.opacity = "0";
    controles.inputPalavra.value = "";
    selecionarTempo(controles);

    if (islistaLembradasNaoMultilinha(controles)) {
        controles.listaSubstituta.style.visibility = "visible";
        controles.listaLembradas.style.visibility = "hidden";
        controles.listaSubstituta.ariaDisabled = "true";
    }

};//fim de onload

/** 
 * 
 */
function habilitarElementos(habilitar) {
    for (let i = 1; i < arguments.length; i++) {
        arguments[i].disabled = !habilitar;
    }
}// fim de habilitarElementos

/** 
 * 
 */
function selecionarTempo(controles) {
    controles.outputTempo.textContent = controles.seletorTempo.value;
}// fim de selecionarTempo

/** 
 * Função que informa se o select listaLembradas que foi definido como multiple não está sendo exibido no navegador no formato multilinha.
 * Vários navegadores mobile não exibem os selects multiple no formato multilinha como no desktop.
 * Caso retorne true, a lista substituta que é um div, será exibida no lugar da listaLembradas. 
 * Mas é apenas uma substituição visual para manter a aparência do select multiple igual a do desktop. 
 * As funcionalidades de select ainda são da lista original.
 */
function islistaLembradasNaoMultilinha(controles) {
    return controles.listaLembradas.offsetHeight < 50;
}// fim de islistaLembradasNaoMultilinha

/** 
 * 
 */
function executarBotaoIniciar(controles, auxiliar) {
    habilitarElementos(true, controles.botaoCancelar);
    habilitarElementos(false, controles.botaoIniciar, controles.seletorTempo, controles.seletorQuantidade);

    if (controles.botaoIniciar.textContent === "Iniciar") {
        iniciarExercicio(controles, auxiliar);
    } else {
        executarFuncaoConferir(controles);
    }

    exibirPalavras(true, controles);

}// fim de executarBotaoIniciar

/** 
 * 
 */
function iniciarExercicio(controles, auxiliar) {
    auxiliar.escolhidas = escolhePalavras(Number(controles.seletorQuantidade.value));
    //auxiliar.timer = window.setInterval(marcarTempo, 1000, controles, auxiliar);
    auxiliar.timer = window.setInterval(marcarTempo, 100, controles, auxiliar);
    preencherPainelPalavras(controles, auxiliar);

    controles.mensagemInicial.style.opacity = "0";
    controles.blocoInputPalavra.style.opacity = "1";
    controles.blocoBotoesLista.style.opacity = "1";

}// fim de iniciarExercicio

/** 
 * 
 */
function marcarTempo(controles, auxiliar) {
    let texto = controles.outputTempo.textContent;
    let tempo = auxiliar.tempo;

    // A data e hora escolhidas são aleatórias, pois o que interessa aqui neste contexto são os minutos e os segundos. 
    // O método parse precisa de uma data completa.
    tempo.setTime(Date.parse(`2024-01-01T12:${texto}`) - 1000);

    controles.outputTempo.textContent = tempo.toLocaleTimeString("pt-BR", { minute: '2-digit', second: '2-digit' });

    if (controles.outputTempo.textContent === "00:10") {
        controles.outputTempo.style.color = "red";
    }

    if (controles.outputTempo.textContent === "00:00") {
        setControlesAposTimerZerado(controles, auxiliar);
    }
}// fim de marcarTempo

/** 
 * 
 */
function setControlesAposTimerZerado(controles, auxiliar) {
    window.clearInterval(auxiliar.timer);
    habilitarElementos(true, controles.botaoIniciar, controles.botaoInserir, controles.inputPalavra);
    habilitarElementos(false, controles.botaoCancelar, controles.botaoRemoverSelecionadas);
    exibirPalavras(false, controles);
    controles.botaoIniciar.textContent = "Conferir";
    controles.outputTempo.style.color = "black";
    controles.botaoInserir.style.display = "inline";
    controles.botaoRemoverSelecionadas.style.display = "inline";
    controles.painelInferior.style.opacity = "1";
    controles.outputAcertos.style.opacity = "0";
    //limparLista(controles.listaLembradas); Foi para executarBotaoCancelar - RETIRAR DEPOIS DOS TESTES

    if (navigator.maxTouchPoints === 0)
        controles.inputPalavra.focus();

}// fim de setControlesAposTimerZerado

/** 
 * 
 */
function preencherPainelPalavras(controles, auxiliar) {
    const escolhidas = auxiliar.escolhidas;
    let painelPalavrasEsquerdo = controles.painelPalavrasEsquerdo;
    let painelPalavrasDireito = controles.painelPalavrasDireito;

    limparLista(painelPalavrasEsquerdo);
    limparLista(painelPalavrasDireito);

    for (let i = 0; i < escolhidas.length; i++) {
        let newOutput = document.createElement("output");
        newOutput.textContent = escolhidas[i];

        if (i < (escolhidas.length / 2))
            painelPalavrasEsquerdo.appendChild(newOutput);
        else
            painelPalavrasDireito.appendChild(newOutput);
    }
}// fim de preencherPainelPalavras

/** 
 * 
 */
function limparLista(lista) {
    while (lista.hasChildNodes()) {
        lista.removeChild(lista.firstChild);
    }
}// fim de limparLista

/** 
 * 
 */
function executarFuncaoConferir(controles) {
    controles.botaoCancelar.textContent = "Limpar";
    habilitarElementos(false, controles.inputPalavra, controles.listaLembradas);
    controles.blocoInputPalavra.style.opacity = "0";
    controles.blocoBotoesLista.style.opacity = "0";
    controles.listaLembradas.selectedIndex = -1;
    selecionarNaListaSubstituta(controles); // Desmarca a "seleção"(se houver) na lista substituta
    controles.listaSubstituta.ariaDisabled = "true";
    marcarPalavrasLembradas(controles);

    // Para esperar o término das transitions de opacity
    window.setTimeout(() => {
        controles.botaoInserir.style.display = "none";
        controles.botaoRemoverSelecionadas.style.display = "none";
        controles.inputPalavra.value = "";
    }, 1000);

}// fim de executarFuncaoConferir

/** 
 * 
 */
function exibirPalavras(visivel, controles) {
    controles.painelPalavrasEsquerdo.style.opacity = (visivel) ? "1" : "0";
    controles.painelPalavrasDireito.style.opacity = (visivel) ? "1" : "0";
}// fim de exibirPalavras

/** 
 * Passa as palavras corretamente lembradas para a cor verde e negrito no painel de palavras.
 */
function marcarPalavrasLembradas(controles) {
    const lembradas = controles.listaLembradas.options;
    const outputsEsquerdo = controles.painelPalavrasEsquerdo.children;
    const outputsDireito = controles.painelPalavrasDireito.children;
    const outputs = [];
    let acertos = 0;

    for (let item of outputsEsquerdo) {
        outputs.push(item);
    }

    for (let item of outputsDireito) {
        outputs.push(item);
    }

    for (let item of outputs) {

        for (let i = 0; i < lembradas.length; i++) {
            if (item.textContent.toLowerCase() === lembradas[i].text.toLowerCase()) {
                item.style.color = "#059761";
                item.style.fontWeight = 'bold';
                acertos++;
                break;
            }
        }
    }
    exibirPorcentagemAcertos(controles, acertos, outputs.length);

}// fim de marcarPalavrasLembradas

/** 
 * 
 */
function exibirPorcentagemAcertos(controles, acertos, totalPalavras) {
    let porcentagem = (acertos * 100) / totalPalavras;
    controles.outputAcertos.innerText = `Lembrou ${acertos} de ${totalPalavras} palavras \n${porcentagem.toFixed(0)}% de acertos`;
    controles.outputAcertos.style.opacity = "1";

}// fim de exibirPorcentagemAcertos

/** 
 * 
 */
function executarBotaoCancelar(controles, auxiliar) {
    exibirPalavras(false, controles);
    habilitarElementos(false, controles.botaoCancelar);
    controles.botaoIniciar.textContent = "Iniciar";
    habilitarElementos(true, controles.botaoIniciar, controles.seletorTempo, controles.seletorQuantidade);
    controles.outputTempo.style.color = "black";
    controles.mensagemInicial.style.opacity = "1";

    if (controles.botaoCancelar.textContent === "Limpar") {
        controles.botaoCancelar.textContent = "Cancelar";
        controles.painelInferior.style.opacity = "0";

        // Para esperar o término da transition de opacity do painelInferior
        window.setTimeout(() => {
            limparLista(controles.listaLembradas);
            controles.outputAcertos.textContent = "";
            limparLista(controles.listaSubstituta);
        }, 1000);
    }

    window.clearInterval(auxiliar.timer);
    selecionarTempo(controles);

}// fim de executarBotaoCancelar

/** 
 * 
 */
function inserirPalavra(controles) {
    let palavra = controles.inputPalavra.value;
    let lista = controles.listaLembradas;
    let quantidadeMaxima = Number(controles.seletorQuantidade.value);

    lista.selectedIndex = -1;
    selecionarNaListaSubstituta(controles); // Desmarca a "seleção"(se houver) na lista substituta

    if (palavra.trim() !== "") {
        let newOption = document.createElement("option");
        newOption.text = palavra;
        lista.add(newOption);
        newOption.scrollIntoView();
        habilitarElementos(true, lista, controles.botaoRemoverSelecionadas);

        if (lista.length === quantidadeMaxima) {
            habilitarElementos(false, controles.botaoInserir, controles.inputPalavra);
        }

        // Se a lista substituta estiver sendo exibida, então a palavra deve ser inserida lá também
        if (islistaLembradasNaoMultilinha(controles)) {
            inserirPalavraNaListaSubstituta(controles, palavra);
        }
    }

    controles.inputPalavra.value = "";

}// fim de inserirPalavra

/** 
 * 
 */
function inserirPalavraComEnter(controles, evento) {

    if (evento.keyCode === 13) {
        inserirPalavra(controles);

        return false;
    }
}// fim de inserirPalavraComEnter

/** 
 * 
 */
function removerPalavrasSelecionadas(controles) {
    let lista = controles.listaLembradas;
    let tam = lista.selectedOptions.length;

    for (let i = 0; i < tam; i++) {
        if (controles.listaSubstituta.ariaDisabled === "false") {
            controles.listaSubstituta.removeChild(controles.listaSubstituta.children[lista.selectedIndex]);
        }

        lista.remove(lista.selectedIndex);

        if (controles.inputPalavra.disabled) {
            habilitarElementos(true, controles.botaoInserir, controles.inputPalavra);
        }
    }

    if (controles.listaLembradas.length === 0) {
        habilitarElementos(false, controles.botaoRemoverSelecionadas, controles.listaLembradas);
        controles.listaSubstituta.ariaDisabled = "true";
    }
}// fim de removerPalavrasSelecionadas

/** 
 *  Faz com que a lista substituta que é um div, simule o comportamento de inserção de itens de um select multiple.
 */
function inserirPalavraNaListaSubstituta(controles, palavra) {
    controles.listaSubstituta.ariaDisabled = "false";

    let newOutput = document.createElement("output");
    newOutput.textContent = palavra;
    controles.listaSubstituta.appendChild(newOutput);
    newOutput.scrollIntoView();

}// fim de inserirPalavraNaListaSubstituta

/** 
 *  Faz com que a lista substituta quando for clicada em um navegador mobile, 
 *  se comporte como um select multiple, ou seja, mostre o dialog com opções selecionáveis da listaLembradas.
 */
function acessarListaLembradas(controles) {

    if (controles.listaSubstituta.ariaDisabled === "false") {
        controles.listaLembradas.showPicker();
    }
}// fim de acessarListaLembradas

/** 
 *  Faz com que a lista substituta simule visualmente a seleção de itens como num select multiple,
 *  pintando o background dos itens selecionados de azul com cor de fonte branca.
 */
function selecionarNaListaSubstituta(controles) {
    
    if (controles.listaSubstituta.ariaDisabled === "false") {
        const lembradas = controles.listaLembradas.options;
        const substitutaLembradas = controles.listaSubstituta.children;

        for (let i = 0; i < lembradas.length; i++) {

            if (lembradas[i].selected && substitutaLembradas[i].style.color !== "white") {
                substitutaLembradas[i].style.backgroundColor = "#0078d7";
                substitutaLembradas[i].style.color = "white";
                substitutaLembradas[i].scrollIntoView();
            }

            if (!lembradas[i].selected && substitutaLembradas[i].style.color === "white") {
                substitutaLembradas[i].style.backgroundColor = "white";
                substitutaLembradas[i].style.color = "black";
            }

            if (controles.listaLembradas.disabled) {
                substitutaLembradas[i].style.color = "#999";
            }
        }
    }
}// fim de selecionarNaListaSubstituta