import { EmbedBuilder, WebhookClient } from "discord.js";
import "dotenv/config"

export async function log({ status, module, query, user, ip}) {
    const webhookClient = new WebhookClient({ url: process.env.WEBHOOK });

    const embed = new EmbedBuilder()
    .setTitle("Nova Requisição!")
    .setColor("Green")
    .setDescription(`### - <:securityshield:1271554424002707629> Status: \`${status}\`\n### - <:db:1271551333966676109> Módulo: \`${module}\`\n### - <:search:1271550947214102640> Consulta: \`${query}\`\n### - <:user:1271557191891030111> Usuário: \`${user}\`\n### - <:global:1271558332670283827> IP:  \`${ip}\``)
    .setTimestamp()

    return webhookClient.send({ embeds: [embed]})
}