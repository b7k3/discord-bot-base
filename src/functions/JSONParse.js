
export async function JSONParse({ string, module }) {

    switch (module) {

        case "email": {
            const records = string.trim().split(/NOME:/).slice(1);
            return records.map(record => {
                const lines = record.trim().split(/\n/);
                const data = {};
                let address = {};
                let emailInfo = {}
                data['NOME'] = lines[0].trim();
                lines.slice(1).forEach(line => {

                    if (line.endsWith(":")) {
                        return
                    }

                    const [key, ...value] = line.split(': ');

                    const joinedValue = value.join(': ');

                    if (key === 'PRIORIDADE' || key === 'SCORE' || key === 'PESSOAL' || key === 'ESTRUTURA') {
                        emailInfo[key] = joinedValue;
                    } else if (key === 'TIPO' || key === 'LOGRADOURO' || key === 'NÚMERO' || key === 'BAIRRO' || key === 'CIDADE' || key === 'UF' || key === 'CEP' || key === 'COMPLEMENTO') {
                        address[key] = joinedValue;
                    } else {
                        data[key] = joinedValue;
                    }
                });

                if (Object.keys(emailInfo).length > 0) {
                    data['INFORMAÇÕES_DO_EMAIL'] = [emailInfo];
                }

                if (Object.keys(address).length > 0) {
                    data['ENDEREÇO'] = [address];
                }

                return data;
            });
        }

        case "score": {
            const lines = string.trim().split('\n');
            const result = {};
            const scoreData = [];
            const mosaicData = [];
            let inScoreData = false;
            let inMosaicData = false;
            let currentScore = {};
            let currentMosaic = {};

            lines.forEach(line => {
                if (line.startsWith(':') && line.endsWith(":")) {
                    return
                }
                if (line.startsWith('DADOS DO SCORE:')) {
                    inScoreData = true;
                    inMosaicData = false;
                    return;
                }

                if (line.startsWith('SERASA MOSAIC:')) {
                    inMosaicData = true;
                    inScoreData = false;
                    return;
                }

                if (inScoreData) {
                    const [key, value] = line.split(':').map(str => str.trim());
                    currentScore[key.replace(/\s+/g, '_')] = value;
                    if (key === 'SCORE CSB8 FAIXA') {
                        scoreData.push(currentScore);
                        currentScore = {};
                    }
                } else if (inMosaicData) {
                    const [key, value] = line.split(':').map(str => str.trim());
                    currentMosaic[key.replace(/\s+/g, '_')] = value;
                    if (key === 'CLASSE MOSAIC SECUNDÁRIO') {
                        mosaicData.push(currentMosaic);
                        currentMosaic = {};
                    }
                } else {
                    const [key, value] = line.split(':').map(str => str.trim());
                    result[key.replace(/\s+/g, '_')] = value;
                }
            });

            result.DADOS_DO_SCORE = scoreData;
            result.SERASA_MOSAIC = mosaicData;
            return result;
        }

        case "placa": {
            const lines = string.trim().split('\n');
            const data = {};
            let lastKey = '';

            lines.forEach(line => {
                if (line.trim() === '') return;

                const [key, ...value] = line.split(': ');

                if (key === "FATURADO:" || key === "PROPRIETÁRIO:") {
                    return
                }

                if (key === "CPF/CNPJ") {
                    return data[key] = "SEM INFORMACAO";
                } else if (key === "RENAVAM") {
                    return data[key] = "SEM INFORMACAO";
                }

                const joinedValue = value.join(': ');

                if (key in data && Array.isArray(data[key])) {
                    data[key].push(joinedValue);
                } else if (key in data) {
                    data[key] = [data[key], joinedValue];
                } else {
                    data[key] = joinedValue;
                }
            });

            return data;
        }

        case "cepBasic": {

            const lines = string.split("\n")
            const data = {}

            lines.forEach(res => {
                if (!res) {
                    return
                }

                const [key, value] = res.split(": ")
                data[key] = value
            })
            return data
        }

        case "cep": {
            const records = string.trim().split(/RESULTADO:/).slice(1);
            return records.map(record => {
                const lines = record.trim().split(/\n/);
                const data = {};
                let address = {};

                lines.forEach(line => {
                    if (line.endsWith(":") || line.includes("RESULTADO:")) {
                        return;
                    }

                    if (!line.includes(":")) {
                        return
                    }

                    const [key, ...value] = line.split(': ');

                    const joinedValue = value.join(': ').trim();

                    if (key === 'LOGRADOURO' || key === 'NÚMERO' || key === 'BAIRRO' || key === 'CIDADE' || key === 'CEP') {
                        address[key] = joinedValue;
                    } else {
                        data[key] = joinedValue;
                    }
                });

                if (Object.keys(address).length > 0) {
                    data['ENDEREÇO'] = [address];
                }

                return data;
            });
        }

        case "chassi": {
            const lines = string.trim().split('\n');
            const data = {};
            let lastKey = '';

            lines.forEach(line => {
                if (line.trim() === '') return;

                const [key, ...value] = line.split(': ');

                if (key === "FATURADO:" || key === "PROPRIETÁRIO:") {
                    return
                }


                const joinedValue = value.join(': ');

                if (key in data && Array.isArray(data[key])) {
                    data[key].push(joinedValue);
                } else if (key in data) {
                    data[key] = [data[key], joinedValue];
                } else {
                    data[key] = joinedValue;
                }
            });

            return data;
        }

        case "nome": {
            const regex = /NOME:.*?(?=(NOME:|$))/gs;
            const blocks = [...string.matchAll(regex)].map(match => match[0].trim());

            return blocks.map(block => {
                const lines = block.split('\n').map(line => line.trim());
                const obj = {};
                lines.forEach(line => {
                    const [key, value] = line.split(': ').map(str => str.trim());
                        obj[key] = value;
                });
                return obj;
            });
        }

        case "nome3": {
            const records = string.trim().split(/NOME:/).slice(1);
            return records.map(record => {
                const lines = record.trim().split(/\n/);
                const data = {};
                let address = {};
                data['NOME'] = lines[0].trim();
                lines.slice(1).forEach(line => {
                    if (line.endsWith(":")) {
                        return
                    }

                    const [key, ...value] = line.split(': ');

                    const joinedValue = value.join(': ');
                    if (key === "NASCIMENTO") {

                        const date = new Date(joinedValue);

                        const day = date.getUTCDate().toString().padStart(2, "0");
                        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
                        const year = date.getUTCFullYear();

                        const formattedDate = `${day}/${month}/${year}`;
                        data[key] = formattedDate;

                    } else if (key === 'TIPO' || key === 'LOGRADOURO' || key === 'NÚMERO' || key === 'BAIRRO' || key === 'CIDADE' || key === 'UF' || key === 'CEP') {
                        address[key] = joinedValue;
                    } else {
                        data[key] = joinedValue;
                    }
                });
                if (Object.keys(address).length > 0) {
                    data['ENDEREÇO'] = [address];
                }
                return data;
            });
        }

        case "telefone": {
            const regex = /NOME:.*?(?=(NOME:|$))/gs;
            const blocks = [...string.matchAll(regex)].map(match => match[0].trim());


            const results = blocks.map(block => {

                const addressMatch = block.match(/ENDEREÇO:[\s\S]*?(?=(NOME:|$))/);

                function blockToObject(block) {
                    const obj = {};
                    block.split('\n').map(line => line.trim()).forEach(line => {
                        const [key, value] = line.split(': ').map(str => str.trim());
                        if (key && value) {
                            obj[key] = value;
                        }
                    });
                    return obj;
                }



                let addressObj = {};

                if (addressMatch) {
                    addressObj = blockToObject(addressMatch[0].replace(/^ENDEREÇO:\s*/, ''));
                }

                const mainBlock = block.replace(/ENDEREÇO:[\s\S]*?(?=(NOME:|$))/g, '');
                const mainObj = blockToObject(mainBlock);

                mainObj['ENDEREÇO'] = [addressObj];

                return mainObj;
            });
            return results
        }


        case "foto-rj": {
            const obj = {};
            string.split('\n').forEach(line => {
                const [key, value] = line.split(': ').map(str => str.trim());
                if (key && value) {
                    obj[key] = value;
                }
            });
            return obj;
        }

        case "internet": {
            const records = string.trim().split(/Registro em\s+/).filter(Boolean);
            const jsonList = [];

            records.forEach(record => {
                const siteMatch = record.split("\n")[0].split(":")[0]
                const idMatch = record.match(/ID:\s*([^\s]+)/);
                const phoneMatch = record.match(/Telefone:\s*([^\s]+)/);
                const emailMatch = record.match(/Email:\s*([^\s]+)/);

                if (siteMatch && idMatch && phoneMatch && emailMatch) {
                    jsonList.push({
                        SITE: siteMatch.trim(),
                        ID: idMatch[1].trim(),
                        TELEFONE: phoneMatch[1].trim(),
                        EMAIL: emailMatch[1].trim()
                    });
                }
            });

            return jsonList;
        }

        case "compras": {
            const lines = string.trim().split('\n');
            const client = {
                CPF: '',
                RG: '',
                NOME: '',
                NASCIMENTO: '',
                SEXO: '',
                COMPRAS: []
            };

            let currentProduct = null;

            lines.forEach(line => {
                const [key, value] = line.split(': ').map(str => str.trim());

                if (key === 'CPF') {
                    client.CPF = value;
                } else if (key === 'RG') {
                    client.RG = value;
                } else if (key === 'NOME') {
                    client.NOME = value;
                } else if (key === 'NASCIMENTO') {
                    client.NASCIMENTO = value;
                } else if (key === 'SEXO') {
                    client.SEXO = value;
                } else if (key === 'PRODUTO') {
                    if (currentProduct) {

                        const compraExistente = client.COMPRAS.find(compra =>
                            compra.PRODUTO === currentProduct.PRODUTO &&
                            compra.DETALHE === currentProduct.DETALHE &&
                            compra.QUANTIDADE === currentProduct.QUANTIDADE &&
                            compra.PREÇO === currentProduct.PREÇO
                        );

                        if (!compraExistente) {
                            client.COMPRAS.push(currentProduct);
                        }
                    }
                    currentProduct = { PRODUTO: value, DETALHE: '', QUANTIDADE: 0, PREÇO: 0 };
                } else if (key === 'DETALHE') {
                    if (value === "null") {
                        return currentProduct.DETALHE = "";
                    }
                    currentProduct.DETALHE = value;
                } else if (key === 'QUANTIDADE') {
                    currentProduct.QUANTIDADE = parseInt(value);
                } else if (key === 'PREÇO') {
                    currentProduct.PREÇO = parseFloat(value);
                }
            });


            if (currentProduct) {
                const compraExistente = client.COMPRAS.find(compra =>
                    compra.PRODUTO === currentProduct.PRODUTO &&
                    compra.DETALHE === currentProduct.DETALHE &&
                    compra.QUANTIDADE === currentProduct.QUANTIDADE &&
                    compra.PREÇO === currentProduct.PREÇO
                );

                if (!compraExistente) {
                    client.COMPRAS.push(currentProduct);
                }
            }

            return client
        }

        case "impostos": {
            let lines = string.split('\n');
            let jsonObject = {};
            let impostosArray = [];
            let currentImposto = null;
            let inImpostosSection = false;

            lines.forEach(line => {
                let [key, value] = line.split(':').map(str => str.trim());

                if (key === 'IMPOSTOS') {
                    inImpostosSection = true;
                    return;
                }

                if (inImpostosSection) {
                    if (key === 'BANCO' && currentImposto) {
                        impostosArray.push(currentImposto);
                        currentImposto = {};
                    }

                    if (!currentImposto) {
                        currentImposto = {};
                    }
                    currentImposto[key.toUpperCase()] = value;

                } else {
                    jsonObject[key.toUpperCase()] = value;
                }
            });

            if (currentImposto) {
                impostosArray.push(currentImposto);
            }

            if (impostosArray.length > 0) {
                jsonObject['IMPOSTOS'] = impostosArray;
            }

            return jsonObject
        }

        case "nascimento": {
            let lines = string.split('\n');
            let jsonArray = [];
            let currentObject = {};

            lines.forEach(line => {
                let [key, value] = line.split(':').map(str => str.trim());

                if (key === 'CPF' && Object.keys(currentObject).length > 0) {
                    jsonArray.push(currentObject);
                    currentObject = {};
                }

                if (key === 'NASCIMENTO') {
                    let [year, month, day] = value.split(' ')[0].split('-');
                    value = `${day}/${month}/${year}`;
                }

                currentObject[key.toUpperCase()] = value;
            });


            if (Object.keys(currentObject).length > 0) {
                jsonArray.push(currentObject);
            }

            return jsonArray
        }

        case "cpf2": {
            const lines = string.trim().split('\n');
            const jsonData = {};

            let currentSection = null;
            let currentSubSection = null;

            lines.forEach(line => {
                if (line.includes(':')) {
                    const [key, value] = line.split(':').map(part => part.trim());

                    if (key === "NASCIMENTO") {
                        const date = new Date(value);

                        const day = date.getUTCDate().toString().padStart(2, "0");
                        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
                        const year = date.getUTCFullYear();

                        const formattedDate = `${day}/${month}/${year}`;
                        jsonData[key] = formattedDate;
                    } else if (key === 'VACINAS DA COVID' || key === 'OUTRAS VACINAS') {
                        currentSection = key;
                        if (!jsonData[currentSection]) {
                            jsonData[currentSection] = [];
                        }
                    } else if (currentSection && (key === 'Tipo' || key === 'Vacina' || key === 'Lote' || key === 'Data de Aplicação')) {
                        if (!currentSubSection) {
                            currentSubSection = {};
                        }

                        if (key === "Data de Aplicação") {
                            const date = new Date(value);

                            const day = date.getUTCDate().toString().padStart(2, "0");
                            const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
                            const year = date.getUTCFullYear();

                            const formattedDate = `${day}/${month}/${year}`;
                            currentSubSection[key] = formattedDate;

                        } else {
                            currentSubSection[key] = value;
                        }

                        if (key === 'Data de Aplicação') {
                            jsonData[currentSection].push(currentSubSection);
                            currentSubSection = null;
                        }
                    } else if (key === 'TELEFONES') {
                        currentSection = key;
                        jsonData[key] = [];
                    } else if (currentSection === 'TELEFONES' && !isNaN(line.trim())) {
                        jsonData[currentSection].push(line.trim());
                    } else {
                        currentSection = null;
                        jsonData[key] = value;
                    }
                } else if (currentSection === 'TELEFONES' && !isNaN(line.trim())) {
                    jsonData[currentSection].push(line.trim());
                }
            });

            return jsonData;
        }
        case "cpf4": {
            let lines = string.split('\n');

            let jsonObject = {
                NOME: '',
                CPF: '',
                CNS: '',
                NASCIMENTO: '',
                SEXO: '',
                VIVO: false,
                MAE: '',
                PAI: '',
                ENDERECO: [],
                CONTATO: {
                    TELEFONE: '',
                    EMAIL: ''
                }
            };

            let currentSection = '';

            lines.forEach(line => {
                let [key, value] = line.split(':').map(str => str.trim());

                if (key === 'NOME') jsonObject.NOME = value;
                else if (key === 'CPF') jsonObject.CPF = value;
                else if (key === 'CNS') jsonObject.CNS = value;
                else if (key === 'NASCIMENTO') jsonObject.NASCIMENTO = value;
                else if (key === 'SEXO') jsonObject.SEXO = value;
                else if (key === 'VIVO') jsonObject.VIVO = JSON.parse(value);
                else if (key === 'MÃE') jsonObject.MAE = value;
                else if (key === 'PAI') jsonObject.PAI = value;
                else if (key === 'ENDEREÇO') currentSection = 'endereco';
                else if (key === 'CONTATO') currentSection = 'contato';

                if (currentSection === 'endereco') {
                    if (key !== 'ENDEREÇO' && key !== 'CONTATO') {
                        jsonObject.ENDERECO[0] = jsonObject.ENDERECO[0] || {};
                        jsonObject.ENDERECO[0][key.toUpperCase()] = value;
                    }
                } else if (currentSection === 'contato') {
                    if (key === 'TELEFONE') jsonObject.CONTATO.TELEFONE = value;
                    else if (key === 'EMAIL') jsonObject.CONTATO.EMAIL = value;
                }
            });

            return jsonObject
        }

        case "cpf": {
            const lines = string.trim().split('\n');
            const result = {};

            let currentCategory = null;
            let currentItem = null;

            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return;

                if (trimmedLine.endsWith(':')) {

                    currentCategory = trimmedLine.slice(0, -1);

                    if (currentCategory === "DATA DESLIGAMENTO" || currentCategory === "RAZÃO SOCIAL") {
                        return
                    }

                    if (currentCategory === 'IMPOSTO DE RENDA' || currentCategory === 'POSSÍVEIS PARENTES' || currentCategory === "EMPREGOS") {
                        result[currentCategory] = [];
                    } else {
                        result[currentCategory] = [];
                    }
                    return;
                }

                if (currentCategory) {
                    if (currentCategory === 'EMAILS' || currentCategory === 'ENDEREÇOS' || currentCategory === 'TELEFONES') {
                        result[currentCategory].push(trimmedLine);
                    } else if (currentCategory === 'EMPREGOS') {

                        if (line.startsWith(`RAZÃO SOCIAL`)) {
                            currentItem = { "RAZÃO SOCIAL": trimmedLine.split(":")[1] };
                            result[currentCategory].push(currentItem);
                        } else if (line.startsWith(`CNPJ`)) {
                            if (currentItem) currentItem["CNPJ"] = trimmedLine.split(": ")[1]
                        } else if (line.startsWith(`DATA ADIMISSÃO`)) {
                            if (currentItem) currentItem["DATA ADIMISSÃO"] = trimmedLine.split(": ")[1]
                        } else if (line.startsWith(`DATA DESLIGAMENTO`)) {
                            if (currentItem) currentItem["DATA DESLIGAMENTO"] = trimmedLine.split(": ")[1]
                        }

                    } else if (currentCategory === 'POSSÍVEIS PARENTES') {

                        if (line.startsWith(`NOME`)) {
                            currentItem = { "NOME": trimmedLine.split(": ")[1] };
                            result[currentCategory].push(currentItem);
                        } else if (line.startsWith(`CPF`)) {
                            if (currentItem) currentItem["CPF"] = trimmedLine.split(": ")[1]
                        } else if (line.startsWith(`PARENTESCO`)) {
                            if (currentItem) currentItem["PARENTESCO"] = trimmedLine.split(": ")[1]
                        }

                    } else if (currentCategory === 'IMPOSTO DE RENDA') {

                        if (line.startsWith(`INSTITUIÇÃO BANCÁRIA`)) {
                            currentItem = { "INSTITUIÇÃO BANCÁRIA": trimmedLine.split(": ")[1] };
                            result[currentCategory].push(currentItem);
                        } else if (line.startsWith(`CÓD. AGENCIA`)) {
                            if (currentItem) currentItem["CÓD. AGENCIA"] = trimmedLine.split(": ")[1]
                        } else if (line.startsWith(`LOTE`)) {
                            if (currentItem) currentItem["LOTE"] = trimmedLine.split(": ")[1]
                        } else if (line.startsWith(`SIT. RECEITA FEDERAL`)) {
                            if (currentItem) currentItem["SIT. RECEITA FEDERAL"] = trimmedLine.split(": ")[1]
                        }

                    } else if (currentCategory === 'COMPRAS') {
                        if (line.startsWith('PRODUTO')) {
                            currentItem = { PRODUTO: trimmedLine.split(": ")[1] };
                            result[currentCategory].push(currentItem);
                        } else if (line.startsWith('DETALHE')) {
                            if (currentItem) currentItem.DETALHE = trimmedLine.split(": ")[1]
                        } else if (line.startsWith('QUANTIDADE')) {
                            if (currentItem) currentItem.QUANTIDADE = trimmedLine.split(": ")[1]
                        } else if (line.startsWith('PREÇO')) {
                            if (currentItem) currentItem['PREÇO'] = Number(trimmedLine.split(": ")[1]).toFixed(2);
                        }
                    }
                } else {
                    const [key, ...value] = trimmedLine.split(':');
                    if (key === "OBITO") {
                        return result[key.trim()] = JSON.parse(value.join())
                    }
                    result[key.trim()] = value.join(':').trim();
                }
            });

            return result;
        }
    }
}