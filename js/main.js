import escolhePalavras from './funcoesEscolhaPalavras.js';

window.onload = () => {
    const controles = {
        painelPalavras: document.getElementById("painel-palavras"),
        botaoIniciar: document.getElementById("botao-iniciar"),
        botaoCancelar: document.getElementById("botao-cancelar"),
        seletorTempo: document.getElementById("seletor-tempo"),
        seletorQuantidade: document.getElementById("seletor-quantidade"),
        outputTempo: document.getElementById("output-tempo"),
        painelInferior: document.getElementById("painel-inferior"),
        palavraLembrada: document.getElementById("palavra-lembrada"),
        botaoInserir: document.getElementById("botao-inserir"),
        listaLembradas: document.getElementById("lista-lembradas"),
        botaoRemoverSelecionadas: document.getElementById("botao-remover-selecionadas")
    };

    const auxiliar = {
        timer: null,
        escolhidas: null
    };

    controles.botaoIniciar.onclick = () => exibirPalavras(controles, auxiliar);
    controles.botaoCancelar.onclick = () => limparPainel(controles, auxiliar);
    controles.seletorTempo.oninput = () => selecionarTempo(controles);
    controles.botaoInserir.onclick = () => inserirPalavra(controles);
    controles.palavraLembrada.onkeydown = (evento) => inserirPalavraComEnter(controles, evento);
    controles.botaoRemoverSelecionadas.onclick = () => removerPalavrasSelecionadas(controles);

    habilitarElementos(false, controles.botaoCancelar);
    controles.painelInferior.style.display = "none";
    controles.palavraLembrada.value = "";
    selecionarTempo(controles);
};

function exibirPalavras(controles, auxiliar) {
    habilitarElementos(true, controles.botaoCancelar);
    habilitarElementos(false, controles.botaoIniciar, controles.seletorTempo, controles.seletorQuantidade);

    if (controles.botaoIniciar.innerHTML === "Iniciar") {
        auxiliar.escolhidas = escolhePalavras(Number(controles.seletorQuantidade.value));
        auxiliar.timer = window.setInterval(marcarTempo, 100, controles, auxiliar);
        gerarExibicaoPalavras(controles, auxiliar);
    } else {
        controles.botaoIniciar.innerHTML = "Iniciar";
        controles.botaoCancelar.innerHTML = "Limpar";
        habilitarElementos(false, controles.palavraLembrada, controles.botaoInserir, controles.listaLembradas, controles.botaoRemoverSelecionadas);
        controles.listaLembradas.selectedIndex = -1;
    }
    controles.painelPalavras.style.display = "block";
}

function gerarExibicaoPalavras(controles, auxiliar) {
    let escolhidas = auxiliar.escolhidas;

    while (controles.painelPalavras.hasChildNodes()) {
        controles.painelPalavras.removeChild(controles.painelPalavras.firstChild);
    }

    for (let i = 0; i < escolhidas.length; i++) {
        let newOutput = document.createElement("output");
        newOutput.textContent = escolhidas[i];
        controles.painelPalavras.appendChild(newOutput);
    }
}

function limparPainel(controles, auxiliar) {
    controles.painelPalavras.style.display = "none";
    habilitarElementos(false, controles.botaoCancelar);
    controles.botaoIniciar.innerHTML = "Iniciar";
    habilitarElementos(true, controles.botaoIniciar, controles.seletorTempo, controles.seletorQuantidade, controles.palavraLembrada,
        controles.botaoInserir, controles.botaoRemoverSelecionadas);

    if (controles.botaoCancelar.innerHTML === "Limpar") {
        controles.botaoCancelar.innerHTML = "Cancelar";
        controles.painelInferior.style.display = "none";
        controles.palavraLembrada.value = "";

        while (controles.listaLembradas.hasChildNodes()) {
            controles.listaLembradas.removeChild(controles.listaLembradas.firstChild);
        }
    }

    window.clearInterval(auxiliar.timer);
    selecionarTempo(controles);
}

function selecionarTempo(controles) {
    controles.outputTempo.innerHTML = controles.seletorTempo.value;
}

function marcarTempo(controles, auxiliar) {
    let texto = controles.outputTempo.innerHTML;
    let tempo = new Date(`2024-10-10 12:${texto}`);
    tempo.setTime(tempo.getTime() - 1000);
    controles.outputTempo.innerHTML = tempo.toLocaleTimeString("pt-BR", { minute: '2-digit', second: '2-digit' });

    if (controles.outputTempo.innerHTML === "00:00") {
        window.clearInterval(auxiliar.timer);
        habilitarElementos(true, controles.botaoIniciar);
        habilitarElementos(false, controles.botaoCancelar);
        controles.painelPalavras.style.display = "none";
        controles.botaoIniciar.innerHTML = "Conferir";
        controles.listaLembradas.size = controles.seletorQuantidade.value;
        controles.painelInferior.style.display = "block";
    }
}

function inserirPalavra(controles) {
    let palavra = controles.palavraLembrada.value;
    let lista = controles.listaLembradas;
    habilitarElementos(true, lista);
    lista.selectedIndex = -1;

    if (palavra.trim() !== "") {
        let newOption = document.createElement("option");
        newOption.text = palavra;
        lista.add(newOption);

        if (lista.length === lista.size) {
            habilitarElementos(false, controles.botaoInserir, controles.palavraLembrada);
        }
    }

    controles.palavraLembrada.value = "";
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
        lista.remove(lista.selectedIndex);

        if (controles.palavraLembrada.disabled) {
            habilitarElementos(true, controles.botaoInserir, controles.palavraLembrada);
        }
    }
}

function habilitarElementos(habilitar) {
    for (let i = 1; i < arguments.length; i++) {
        arguments[i].disabled = !habilitar;
    }
}

