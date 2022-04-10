/** Gera um ID usando a data e hora atual */
export function gerarId(prefixo: string) {
    return `${prefixo}${Date.now()}`;
}
