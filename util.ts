import Dinero from 'dinero.js'

export type Dinheiro = Dinero.Dinero;

/** Gera um ID usando a data e hora atual */
export function gerarId(prefixo: string) {
    return `${prefixo}${Date.now()}`;
}

/** Converte uma string para um valor monetário que pode ser usado em contas em segurança através da biblioteca Dinero.js */
export function getValorMonetario(valor: string): Dinheiro {
    valor = valor.replace(',', '.');

    if (!valor.includes('.')) {
        valor = `${valor}.00`;
    } else if (valor.split('.')[1].length < 2) {
        // Adicionar um 0 a direita caso o número não possua 2 digitos depois da virgula (ex "R$1.3" se torna "R$1.30")
        while (valor.split('.')[1].length < 2) {
            valor = `${valor}0`
        }
    }

    const valorLimpo = valor
        .replace('R$', '')
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