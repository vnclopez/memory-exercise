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
        botaoRemoverSelecionadas: document.getElementById("botao-remover-selecionadas"),
        outputAcertos: document.getElementById("output-acertos")
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

    habilitarElementos(false, controles.botaoCancelar);
    controles.painelInferior.style.display = "none";
    controles.palavraLembrada.value = "";
    selecionarTempo(controles);
};

function realizarExibicaoPalavras(controles, auxiliar) {
    habilitarElementos(true, controles.botaoCancelar);
    habilitarElementos(false, controles.botaoIniciar, controles.seletorTempo, controles.seletorQuantidade);

    if (controles.botaoIniciar.textContent === "Iniciar") {
        auxiliar.escolhidas = escolhePalavras(Number(controles.seletorQuantidade.value));
        auxiliar.timer = window.setInterval(marcarTempo, 100, controles, auxiliar);
        gerarElementosDeExibicaoPalavras(controles, auxiliar);
    } else {
        controles.botaoIniciar.textContent = "Iniciar";
        controles.botaoCancelar.textContent = "Limpar";
        habilitarElementos(false, controles.palavraLembrada, controles.botaoInserir, controles.listaLembradas, controles.botaoRemoverSelecionadas);
        controles.listaLembradas.selectedIndex = -1;
        marcarPalavrasLembradas(controles);
    }
    exibirPalavras(true, controles);
}

function gerarElementosDeExibicaoPalavras(controles, auxiliar) {
    let escolhidas = auxiliar.escolhidas;
    let painelPalavras = controles.painelPalavras;

    while (painelPalavras.hasChildNodes()) {
        painelPalavras.removeChild(painelPalavras.firstChild);
    }

    for (let i = 0; i < escolhidas.length; i++) {
        let newOutput = document.createElement("output");
        newOutput.textContent = escolhidas[i];
        newOutput.style.visibility = "hidden";
        painelPalavras.appendChild(newOutput);
    }
}

function exibirPalavras(visivel, controles) {
    let outputs = controles.painelPalavras.children;

    for (let output of outputs) {
        output.style.visibility = (visivel) ? "visible" : "hidden";
    }
}

function limparPainel(controles, auxiliar) {
    exibirPalavras(false, controles);
    habilitarElementos(false, controles.botaoCancelar);
    controles.botaoIniciar.textContent = "Iniciar";
    habilitarElementos(true, controles.botaoIniciar, controles.seletorTempo, controles.seletorQuantidade, controles.palavraLembrada,
        controles.botaoInserir, controles.botaoRemoverSelecionadas);
    controles.outputTempo.style.color = "black";

    if (controles.botaoCancelar.textContent === "Limpar") {
        controles.botaoCancelar.textContent = "Cancelar";
        controles.painelInferior.style.display = "none";
        controles.palavraLembrada.value = "";
        controles.outputAcertos.textContent = "";

        while (controles.listaLembradas.hasChildNodes()) {
            controles.listaLembradas.removeChild(controles.listaLembradas.firstChild);
        }
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
        habilitarElementos(true, controles.botaoIniciar);
        habilitarElementos(false, controles.botaoCancelar);
        exibirPalavras(false, controles);
        controles.botaoIniciar.textContent = "Conferir";
        controles.listaLembradas.size = controles.seletorQuantidade.value;
        controles.painelInferior.style.display = "block";
        controles.outputTempo.style.color = "black";
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

function marcarPalavrasLembradas(controles) {
    let lembradas = controles.listaLembradas.options;
    let outputs = controles.painelPalavras.children;
    let acertos = 0;

    for (let item of outputs) {

        for (let i = 0; i < lembradas.length; i++) {
            if (item.textContent.toLowerCase() === lembradas[i].text.toLowerCase()) {
                item.style.color = "blue";
                acertos++;
                break;
            }
        }
    }
    exibirPorcentagemAcertos(controles, acertos, outputs.length);
}

function exibirPorcentagemAcertos(controles, acertos, totalPalavras) {
    let porcentagem = (acertos * 100) / totalPalavras;
    controles.outputAcertos.textContent = `Lembrou ${acertos} de ${totalPalavras} palavras. ${porcentagem.toFixed(0)}% de acertos`;
}

