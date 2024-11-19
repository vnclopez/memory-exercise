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
        palavraLembrada: document.getElementById("palavra-lembrada"),
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

    controles.botaoIniciar.onclick = () => realizarExibicaoPalavras(controles, auxiliar);
    controles.botaoCancelar.onclick = () => limparPainel(controles, auxiliar);
    controles.seletorTempo.oninput = () => selecionarTempo(controles);
    controles.botaoInserir.onclick = () => inserirPalavra(controles);
    controles.palavraLembrada.onkeydown = (evento) => inserirPalavraComEnter(controles, evento);
    controles.botaoRemoverSelecionadas.onclick = () => removerPalavrasSelecionadas(controles);
    controles.listaSubstituta.onclick = () => acessarListaLembradas(controles);
    controles.listaLembradas.oninput = () => marcarSelecaoNaListaSubstituta(controles);

    habilitarElementos(false, controles.botaoCancelar, controles.listaLembradas, controles.palavraLembrada);
    controles.painelInferior.style.opacity = "0";
    controles.palavraLembrada.value = "";
    selecionarTempo(controles);
};

function realizarExibicaoPalavras(controles, auxiliar) {
    habilitarElementos(true, controles.botaoCancelar);
    habilitarElementos(false, controles.botaoIniciar, controles.seletorTempo, controles.seletorQuantidade, controles.botaoRemoverSelecionadas);

    if (controles.botaoIniciar.textContent === "Iniciar") {
        auxiliar.escolhidas = escolhePalavras(Number(controles.seletorQuantidade.value));
        auxiliar.timer = window.setInterval(marcarTempo, 100, controles, auxiliar);
        gerarElementosDeExibicaoPalavras(controles, auxiliar);
        controles.mensagemInicial.style.opacity = "0";
    } else {
        controles.botaoCancelar.textContent = "Limpar";
        habilitarElementos(false, controles.palavraLembrada, controles.botaoInserir, controles.listaLembradas);
        controles.listaLembradas.selectedIndex = -1;
        marcarSelecaoNaListaSubstituta(controles);
        controles.listaSubstituta.ariaDisabled = "true";
        marcarPalavrasLembradas(controles);
    }
    exibirPalavras(true, controles);
}

function gerarElementosDeExibicaoPalavras(controles, auxiliar) {
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
}

function exibirPalavras(visivel, controles) {
    const divs = [controles.painelPalavrasEsquerdo, controles.painelPalavrasDireito];

    for (let div of divs) {
        div.style.opacity = (visivel) ? "1" : "0";
    }
}

function limparPainel(controles, auxiliar) {
    exibirPalavras(false, controles);
    habilitarElementos(false, controles.botaoCancelar);
    controles.botaoIniciar.textContent = "Iniciar";
    habilitarElementos(true, controles.botaoIniciar, controles.seletorTempo, controles.seletorQuantidade);
    controles.outputTempo.style.color = "black";
    controles.mensagemInicial.style.opacity = "1";

    if (controles.botaoCancelar.textContent === "Limpar") {
        controles.botaoCancelar.textContent = "Cancelar";
        controles.painelInferior.style.opacity = "0";
    }

    window.clearInterval(auxiliar.timer);
    selecionarTempo(controles);
}

function selecionarTempo(controles) {
    controles.outputTempo.textContent = controles.seletorTempo.value;
}

function marcarTempo(controles, auxiliar) {
    let texto = controles.outputTempo.textContent;
    let tempo = new Date(`2024-10-10 12:${texto}`);
    tempo.setTime(tempo.getTime() - 1000);
    controles.outputTempo.textContent = tempo.toLocaleTimeString("pt-BR", { minute: '2-digit', second: '2-digit' });

    if (controles.outputTempo.textContent === "00:10") {
        controles.outputTempo.style.color = "red";
    }

    if (controles.outputTempo.textContent === "00:00") {
        window.clearInterval(auxiliar.timer);
        habilitarElementos(true, controles.botaoIniciar, controles.botaoInserir, controles.palavraLembrada);
        habilitarElementos(false, controles.botaoCancelar);
        exibirPalavras(false, controles);
        controles.botaoIniciar.textContent = "Conferir";
        controles.painelInferior.style.opacity = "1";
        controles.outputTempo.style.color = "black";
        controles.palavraLembrada.value = "";
        controles.outputAcertos.textContent = "";
        controles.outputAcertos.style.opacity = "0";
        limparLista(controles.listaLembradas);

        if (navigator.maxTouchPoints === 0)
            controles.palavraLembrada.focus();

        if (controles.listaLembradas.offsetHeight < 50) {
            controles.listaSubstituta.style.visibility = "visible";
            controles.listaLembradas.style.visibility = "hidden";
            controles.listaSubstituta.ariaDisabled = "true";
            limparLista(controles.listaSubstituta);
        }
    }
}

function limparLista(lista) {
    while (lista.hasChildNodes()) {
        lista.removeChild(lista.firstChild);
    }
}

function inserirPalavra(controles) {
    let palavra = controles.palavraLembrada.value;
    let lista = controles.listaLembradas;
    let quantidadeMaxima = Number(controles.seletorQuantidade.value);

    lista.selectedIndex = -1;

    if (palavra.trim() !== "") {
        let newOption = document.createElement("option");
        newOption.text = palavra;
        lista.add(newOption);
        newOption.scrollIntoView();
        habilitarElementos(true, lista, controles.botaoRemoverSelecionadas);

        if (lista.length === quantidadeMaxima) {
            habilitarElementos(false, controles.botaoInserir, controles.palavraLembrada);
        }

        if (controles.listaLembradas.offsetHeight < 50) {
            inserirPalavraNaListaSubstituta(controles, palavra)
            marcarSelecaoNaListaSubstituta(controles);
        }
    }

    controles.palavraLembrada.value = "";
}

function inserirPalavraNaListaSubstituta(controles, palavra) {
    controles.listaSubstituta.ariaDisabled = "false";

    let newOutput = document.createElement("output");
    newOutput.textContent = palavra;
    controles.listaSubstituta.appendChild(newOutput);
    newOutput.scrollIntoView();
}

function inserirPalavraComEnter(controles, evento) {

    if (evento.keyCode === 13) {
        inserirPalavra(controles);

        return false;
    }
}

function removerPalavrasSelecionadas(controles) {
    let lista = controles.listaLembradas;
    let tam = lista.selectedOptions.length;

    for (let i = 0; i < tam; i++) {
        if (controles.listaSubstituta.ariaDisabled === "false") {
            controles.listaSubstituta.removeChild(controles.listaSubstituta.children[lista.selectedIndex]);
        }

        lista.remove(lista.selectedIndex);

        if (controles.palavraLembrada.disabled) {
            habilitarElementos(true, controles.botaoInserir, controles.palavraLembrada);
        }
    }

    if (controles.listaLembradas.length === 0) {
        habilitarElementos(false, controles.botaoRemoverSelecionadas, controles.listaLembradas);
        controles.listaSubstituta.ariaDisabled = "true";
    }
}

function habilitarElementos(habilitar) {
    for (let i = 1; i < arguments.length; i++) {
        arguments[i].disabled = !habilitar;
    }
}

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
}

function exibirPorcentagemAcertos(controles, acertos, totalPalavras) {
    let porcentagem = (acertos * 100) / totalPalavras;
    controles.outputAcertos.innerText = `Lembrou ${acertos} de ${totalPalavras} palavras \n${porcentagem.toFixed(0)}% de acertos`;
    controles.outputAcertos.style.opacity = "1";
}

function acessarListaLembradas(controles) {

    if (controles.listaSubstituta.ariaDisabled === "false") {
        controles.listaLembradas.showPicker();
    }
}

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
}

