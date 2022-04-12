import Dinero from 'dinero.js'

export type Dinheiro = Dinero.Dinero;

/** Gera um ID usando a data e hora atual */
export function gerarId(prefixo: string) {
    return `${prefixo}${Date.now()}`;
}

export function getValorMonetario(valor: string): Dinheiro {
    if (!valor.includes(',') && !valor.includes('.')) {
        valor = `${valor},00`;
    }

    const valorLimpo = valor
        .replace('R$', '')
        .replace(',', '')
        .replace('.', '')
        .trim();

    const valorConvertido = Number.parseFloat(valorLimpo);
    if (isNaN(valorConvertido)) {
        throw new Error(`Valor ${valor} não é um número válido`);
    }

    return Dinero({
        amount: valorConvertido,
        currency: 'BRL'
    });
}