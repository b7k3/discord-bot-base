export async function checkModule({ module }) {
    const modules = ["cpf", "nome", "placa", "telefone", "cnpj", "cep", "ip", "site"]

    if (!modules.includes(String(module))) {
        return false
    } else {
        return true
    }
    
}
