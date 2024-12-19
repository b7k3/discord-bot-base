export async function clearText(string) {
    let markDAgua = [
        /\*\*👤 USUÁRIO:\*\* \w+/g,
        /\*\*🤖 BY:\*\* @\w+/g,
        /👤 USUÁRIO: Kozlov/,
        /🤖 BY: @AnoninoBuscasOfcBot/,
        /\*\*✅ Canal:\*\* @\w+/g,
        /\*\*✅ Grupo:\*\* @\w+/g,
        /✅ Canal: @\w+/g,
        /✅ Grupo: @\w+/g,
        /\*\*/g, 
        /\•/g, 
        /\`/g, 
        /👤 DADOS PESSOAIS/,
        /DADOS PESSOAIS:/,
        /🏘/,
        /️/,
        /️/,
        /👤/,
        /• DADOS BÁSICOS: /,
        /📃 ABRA O DOCUMENTO A CIMA PARA VER A LISTA DE MORADORES DA LOCALIDADE./,
        /DADOS BÁSICOS:/,
        /📩/,
        /📞/,
        /🏡/
    ];

    let str = string;

    markDAgua.forEach((f) => {
        let rex = RegExp(f, "gi");
        str = str.replace(rex, '');
    });

    str = str.replace(/^\s+/gm, '');
    str = str.trim();
    str = str.replace(/^\s*[\r\n]/gm, '');

    let lines = str.split('\n');
    let filteredLines = lines.filter(line => !line.startsWith('🔍 CONSULTA DE ') && !line.startsWith('RESULTADO ') && !line.startsWith('🔎 LOGINS ENCONTRADOS 🔎') && !line.startsWith('🔍 MORADORES ENCONTRADOS 🔍') && !line.startsWith("🔎 CONSULTA DE") && !line.startsWith("CONSULTA: "));
    str = filteredLines.join('\n');

    return str;
}

export async function removeWaterMark(string) {
    const markDAgua = [
        /\*\*👤 USUÁRIO:\*\* \w+/g,
        /\*\*🤖 BOT: \*\*\*\*@\w+\*\*/g,
        /👤 USUÁRIO: Kozlov/,
        /👤 USUÁRIO: \w+/g,
        /🤖 BY: @AnoninoBuscasOfcBot/,
        /\*\*✅ Canal:\*\* @\w+/g,
        /\*\*✅ Grupo:\*\* @\w+/g,
        /✅ Canal: @\w+/g,
        /✅ Grupo: @\w+/g,
        /\*\*\🔍 CONSULTA DE \w+ 🔍\*\*/,
        /🔍 CONSULTA DE \w+ 🔍/,
        /\*\*\🔍 CONSULTA DE \w+ DATABIT 🔍\*\*/,
        /\*\*\🔍 CONSULTA DE \w+ SUS 🔍\*\*/,
        /\*\*\🔎 CONSULTA DE \w+ 🔎\*\*/,
        /👤 USUÁRIO: \[Rob\]\(tg:\/\/user\?id=7251650449\)/,
        /🤖 BOT: @BINGSIXBOT/
    ];

    let str = string;
    markDAgua.forEach((f) => {
        let rex = RegExp(f, "gi");
        str = str.replace(rex, '');
    })
    str = str.trim();
    return str
}
