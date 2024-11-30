import escolhePalavras from './funcoesEscolhaPalavras.js';

window.onload = () => {
    const controles = {
        painelPalavrasEsquerdo: document.getElementById("painel-palavras-esquerdo"),
        painelPalavrasDireito: document.getElementById("painel-palavras-direito"),
        mensagemInicial: document.getElementById("mensagem-inicial"),
        botaoIniciar: document.getElementById("botao-iniciar"),
        botaoCancelar: document.getElementById("botao-cancelar"),
        seletorTempo: document.getElementById("seletor-tempo"),
        seletorQuantidade: document.getElementById("seletor-quantidade"),
        outputTempo: document.getElementById("output-tempo"),
        painelInferior: document.getElementById("painel-inferior"),
        blocoInputPalavra: document.getElementById("bloco-input-palavra"),
        blocoBotoesLista: document.getElementById("bloco-botoes-lista"),
        inputPalavra: document.getElementById("input-palavra"),
        botaoInserir: document.getElementById("botao-inserir"),
        listaLembradas: document.getElementById("lista-lembradas"),
        botaoRemoverSelecionadas: document.getElementById("botao-remover-selecionadas"),
        outputAcertos: document.getElementById("output-acertos"),
        listaSubstituta: document.getElementById("lista-substituta")
    };

    const auxiliar = {
        timer: null,
        escolhidas: null
    };

    controles.botaoIniciar.onclick = () => executarBotaoIniciar(controles, auxiliar);
    controles.botaoCancelar.onclick = () => executarBotaoCancelar(controles, auxiliar);
    controles.seletorTempo.oninput = () => selecionarTempo(controles);
    controles.botaoInserir.onclick = () => inserirPalavra(controles);
    controles.inputPalavra.onkeydown = (evento) => inserirPalavraComEnter(controles, evento);
    controles.botaoRemoverSelecionadas.onclick = () => removerPalavrasSelecionadas(controles);
    controles.listaSubstituta.onclick = () => acessarListaLembradas(controles);
    controles.listaLembradas.oninput = () => marcarSelecaoNaListaSubstituta(controles);

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

function executarBotaoIniciar(controles, auxiliar) {
    habilitarElementos(true, controles.botaoCancelar);
    habilitarElementos(false, controles.botaoIniciar, controles.seletorTempo, controles.seletorQuantidade);

    if (controles.botaoIniciar.textContent === "Iniciar") {
        iniciarExercicio(controles, auxiliar);
    } else {
        prepararControlesParaConferir(controles);
    }

    exibirPalavras(true, controles);

}// fim de executarBotaoIniciar

function iniciarExercicio(controles, auxiliar) {
    auxiliar.escolhidas = escolhePalavras(Number(controles.seletorQuantidade.value));
    auxiliar.timer = window.setInterval(marcarTempo, 100, controles, auxiliar);
    preencherPainelPalavras(controles, auxiliar);
    controles.mensagemInicial.style.opacity = "0";
    controles.blocoInputPalavra.style.opacity = "1";
    controles.blocoBotoesLista.style.opacity = "1";
}// fim de iniciarExercicio

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

function prepararControlesParaConferir(controles) {
    controles.botaoCancelar.textContent = "Limpar";
    habilitarElementos(false, controles.inputPalavra, controles.listaLembradas);
    controles.blocoInputPalavra.style.opacity = "0";
    controles.blocoBotoesLista.style.opacity = "0";
    controles.listaLembradas.selectedIndex = -1;
    marcarSelecaoNaListaSubstituta(controles);
    controles.listaSubstituta.ariaDisabled = "true";
    marcarPalavrasLembradas(controles);

    window.setTimeout(() => {
        controles.botaoInserir.style.display = "none";
        controles.botaoRemoverSelecionadas.style.display = "none";
        controles.inputPalavra.value = "";
    }, 1000);

}// fim de prepararControlesParaConferir

function exibirPalavras(visivel, controles) {
    const divs = [controles.painelPalavrasEsquerdo, controles.painelPalavrasDireito];

    for (let div of divs) {
        div.style.opacity = (visivel) ? "1" : "0";
    }
}// fim de exibirPalavras

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

        window.setTimeout(() => {
            controles.outputAcertos.textContent = "";
            limparLista(controles.listaSubstituta);
        }, 1000);
    }

    window.clearInterval(auxiliar.timer);
    selecionarTempo(controles);

}// fim de executarBotaoCancelar

function selecionarTempo(controles) {
    controles.outputTempo.textContent = controles.seletorTempo.value;
}// fim de selecionarTempo

function marcarTempo(controles, auxiliar) {
    let texto = controles.outputTempo.textContent;
    let tempo = new Date(`2024-10-10 12:${texto}`);
    tempo.setTime(tempo.getTime() - 1000);
    controles.outputTempo.textContent = tempo.toLocaleTimeString("pt-BR", { minute: '2-digit', second: '2-digit' });

    if (controles.outputTempo.textContent === "00:10") {
        controles.outputTempo.style.color = "red";
    }

    if (controles.outputTempo.textContent === "00:00") {
        configurarControlesAposTimerZerado(controles, auxiliar);
    }
}// fim de marcarTempo

function configurarControlesAposTimerZerado(controles, auxiliar) {
    window.clearInterval(auxiliar.timer);
    habilitarElementos(true, controles.botaoIniciar, controles.botaoInserir, controles.inputPalavra);
    habilitarElementos(false, controles.botaoCancelar, controles.botaoRemoverSelecionadas);
    exibirPalavras(false, controles);
    controles.botaoIniciar.textContent = "Conferir";
    controles.botaoInserir.style.display = "inline";
    controles.botaoRemoverSelecionadas.style.display = "inline";
    controles.painelInferior.style.opacity = "1";
    controles.outputTempo.style.color = "black";
    controles.outputAcertos.style.opacity = "0";
    limparLista(controles.listaLembradas);

    if (navigator.maxTouchPoints === 0)
        controles.inputPalavra.focus();

}// fim de configurarControlesAposTimerZerado

function islistaLembradasNaoMultilinha(controles) {
    return controles.listaLembradas.offsetHeight < 50;
}// fim de islistaLembradasNaoMultilinha

function limparLista(lista) {
    while (lista.hasChildNodes()) {
        lista.removeChild(lista.firstChild);
    }
}// fim de limparLista

function inserirPalavra(controles) {
    let palavra = controles.inputPalavra.value;
    let lista = controles.listaLembradas;
    let quantidadeMaxima = Number(controles.seletorQuantidade.value);

    lista.selectedIndex = -1;
    marcarSelecaoNaListaSubstituta(controles);

    if (palavra.trim() !== "") {
        let newOption = document.createElement("option");
        newOption.text = palavra;
        lista.add(newOption);
        newOption.scrollIntoView();
        habilitarElementos(true, lista, controles.botaoRemoverSelecionadas);

        if (lista.length === quantidadeMaxima) {
            habilitarElementos(false, controles.botaoInserir, controles.inputPalavra);
        }

        if (islistaLembradasNaoMultilinha(controles)) {
            inserirPalavraNaListaSubstituta(controles, palavra);
        }
    }

    controles.inputPalavra.value = "";

}// fim de inserirPalavra

function inserirPalavraNaListaSubstituta(controles, palavra) {
    controles.listaSubstituta.ariaDisabled = "false";

    let newOutput = document.createElement("output");
    newOutput.textContent = palavra;
    controles.listaSubstituta.appendChild(newOutput);
    newOutput.scrollIntoView();

}// fim de inserirPalavraNaListaSubstituta

function inserirPalavraComEnter(controles, evento) {

    if (evento.keyCode === 13) {
        inserirPalavra(controles);

        return false;
    }
}// fim de inserirPalavraComEnter

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

function habilitarElementos(habilitar) {
    for (let i = 1; i < arguments.length; i++) {
        arguments[i].disabled = !habilitar;
    }
}// fim de habilitarElementos

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

function exibirPorcentagemAcertos(controles, acertos, totalPalavras) {
    let porcentagem = (acertos * 100) / totalPalavras;
    controles.outputAcertos.innerText = `Lembrou ${acertos} de ${totalPalavras} palavras \n${porcentagem.toFixed(0)}% de acertos`;
    controles.outputAcertos.style.opacity = "1";

}// fim de exibirPorcentagemAcertos

function acessarListaLembradas(controles) {

    if (controles.listaSubstituta.ariaDisabled === "false") {
        controles.listaLembradas.showPicker();
    }
}// fim de acessarListaLembradas

function marcarSelecaoNaListaSubstituta(controles) {
    if (controles.listaSubstituta.ariaDisabled === "false") {
        const lembradas = controles.listaLembradas.options;
        const substitutaLembradas = controles.listaSubstituta.children;

        for (let i = 0; i < lembradas.length; i++) {
            if (lembradas[i].selected && substitutaLembradas[i].style.color !== "white") {
                substitutaLembradas[i].style.backgroundColor = "#0078d7";
                substitutaLembradas[i].style.color = "white";
                substitutaLembradas[i].scrollIntoView();
            }

            if (!lembradas[i].selected) {
                substitutaLembradas[i].style.backgroundColor = "white";
                substitutaLembradas[i].style.color = (controles.listaLembradas.disabled) ? "#999" : "black";//REFATORAR
            }
        }
    }
}// fim de marcarSelecaoNaListaSubstituta