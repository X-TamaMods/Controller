console.clear()
require('../Control/Ctrl');
const fs = require('fs');
const pino = require('pino');
const path = require('path');
const speed = require('performance-now');
const os = require('os');
const nou = require("node-os-utils");
const chalk = require('chalk');
const readline = require('readline');
const FileType = require('file-type');
const { exec } = require('child_process');
const { say } = require('cfonts')
const { Boom } = require('@hapi/boom');
const TelegramBot = require("node-telegram-bot-api");
const { default: WAConnection, generateWAMessageFromContent, 
prepareWAMessageMedia, useMultiFileAuthState, Browsers, DisconnectReason, makeInMemoryStore, makeCacheableSignalKeyStore, fetchLatestWaWebVersion, proto, PHONENUMBER_MCC, getAggregateVotesInPollMessage } = require(global.baileys);

const { isUrl, generateMessageTag, getBuffer, getSizeMedia, formatp, runtime, fetchJson, await, sleep } = require('../System/function');
const { welcomeBanner, promoteBanner } = require("../System/welcome")

const pairingCode = true
const DataBase = require('../Access/database.js');
const database = new DataBase();
(async () => {
const loadData = await database.read()
if (loadData && Object.keys(loadData).length === 0) {
global.db = {
users: {},
groups: {},
database: {},
settings : {}, 
...(loadData || {}),
}
await database.write(global.db)
} else {
global.db = loadData
}
setInterval(async () => {
if (global.db) await database.write(global.db)
}, 3500)
})()
  let timestamp = speed();
  let latensi = speed() - timestamp;
  var tot = nou.drive.info();

  // Waktu Lokal VPS
  const localTime = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour12: false
  });

  // Status Jaringan (ping ke google)
  let networkStatus = 'Unknown';
  try {
    require('child_process').execSync('ping -c 1 google.com', { stdio: 'ignore' });
    networkStatus = 'Online';
  } catch (err) {
    networkStatus = 'Offline';
  }

  // IP Publik VPS
  let publicIP = 'Tidak Diketahui';
  try {
    publicIP = require('child_process').execSync('curl -s ifconfig.me').toString().trim();
  } catch (e) {}

  // CPU & RAM Usage
  const cpuUsage = os.loadavg()[0].toFixed(2); // 1 menit average load
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemPercent = ((totalMem - freeMem) / totalMem * 100).toFixed(2);

  // Informasi OS Lengkap
  const osInfo = `${os.type()} ${os.release()} (${os.arch()})`;
  const hostname = os.hostname();

  // Uptime VPS
  const vpsUptime = runtime(os.uptime());
console.log(
  chalk.white.bold(
    chalk.hex("#5BC0F8")( // 🎨 biru muda
`
⠀⣠⠾⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⢦⠀
⢰⠇⠀⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠈⣧
⠘⡇⠀⠸⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠀⠀⣿
⠀⡇⠘⡄⢱⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⢁⡆⢀⡏
⠀⠹⣄⠹⡀⠙⣄⠀⠀⠀⠀⠀⢀⣤⣴⣶⣶⣶⣾⣶⣶⣶⣶⣤⣀⠀⠀⠀⠀⠀⢀⠜⠁⡜⢀⡞⠀
⠀⠀⠘⣆⢣⡄⠈⢣⡀⢀⣤⣾⣿⣿⢿⠉⠉⠉⠉⠉⠉⠉⣻⢿⣿⣷⣦⣄⠀⡰⠋⢀⣾⢡⠞⠀⠀
⠀⠀⠀⠸⣿⡿⡄⡀⠉⠙⣿⡿⠁⠈⢧⠃⠀⠀⠀⠀⠀⠀⢷⠋⠀⢹⣿⠛⠉⢀⠄⣞⣧⡏⠀⠀⠀
⠀⠀⠀⠀⠸⣿⣹⠘⡆⠀⡿⢁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢻⡆⢀⡎⣼⣽⡟⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣹⣿⣇⠹⣼⣷⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⣳⡜⢰⣿⣟⡀⠀⠀⠀⠀
⠀⠀⠀⠀⡾⡉⠛⣿⠴⠳⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠳⢾⠟⠉⢻⡀⠀⠀⠀
⠀⠀⠀⠀⣿⢹⠀⢘⡇⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠀⡏⠀⡼⣾⠇⠀⠀⠀
⠀⠀⠀⠀⢹⣼⠀⣾⠀⣀⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣄⡀⢹⠀⢳⣼⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣇⠀⠸⣾⠁⠀⠀⠀⠀⠀⢀⡾⠀⠀⠀⠰⣄⠀⠀⠀⠀⠀⠀⣹⡞⠀⣀⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠈⣇⠱⡄⢸⡛⠒⠒⠒⠒⠚⢿⣇⠀⠀⠀⢠⣿⠟⠒⠒⠒⠒⠚⡿⢀⡞⢹⠇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡞⢰⣷⠀⠑⢦⣄⣀⣀⣠⠞⢹⠀⠀⠀⣸⠙⣤⣀⣀⣀⡤⠞⠁⢸⣶⢸⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠰⣧⣰⠿⣄⠀⠀⠀⢀⣈⡉⠙⠏⠀⠀⠀⠘⠛⠉⣉⣀⠀⠀⠀⢀⡟⣿⣼⠇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡿⠀⠘⠷⠤⠾⢻⠞⠋⠀⠀⠀⠀⠀⠀⠀⠘⠛⣎⠻⠦⠴⠋⠀⠹⡆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠸⣿⡀⢀⠀⠀⡰⡌⠻⠷⣤⡀⠀⠀⠀⠀⣠⣶⠟⠋⡽⡔⠀⡀⠀⣰⡟⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⢷⣄⡳⡀⢣⣿⣀⣷⠈⠳⣦⣀⣠⡾⠋⣸⡇⣼⣷⠁⡴⢁⣴⠟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠻⣶⡷⡜⣿⣻⠈⣦⣀⣀⠉⠀⣀⣠⡏⢹⣿⣏⡼⣡⡾⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣻⡄⠹⡙⠛⠿⠟⠛⡽⠀⣿⣻⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡏⢏⢿⡀⣹⢲⣶⡶⢺⡀⣴⢫⢃⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣷⠈⠷⠭⠽⠛⠛⠛⠋⠭⠴⠋⣸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣷⣄⡀⢀⣀⣠⣀⣀⢀⣀⣴⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠀⠀⠀⠈⠉⠉⠁⠀⠀⠀⠀⠀
`
    )
  )
);
console.log(chalk.hex("#5BC0F8")("━━━━━━━━━━━[ BOT CONNECT ]━━━━━━━━━━━"));
console.log(`💻 OS : ${osInfo}`);
console.log(`🖥 CPU : ${os.cpus().length} Core`);
console.log(`📊 RAM : ${formatp(totalMem)}`); 
console.log(`🕐 UPTIME : ${vpsUptime}`);
console.log(`🌐 NETWORK : ${publicIP}`);
console.log(chalk.hex("#5BC0F8")("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
console.log(chalk.green(`✅ BOT IS ONLINE AND READY TO ROCK!`));
console.log(`🌐 IP PANEL : ${publicIP}`);
const { MessagesUpsert, Solving } = require('../Access/message')

async function startingBot() {
const store = await makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { state, saveCreds } = await useMultiFileAuthState('session');
	
const TamaOfficial = await WAConnection({
version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
browser: ['Ubuntu', 'Safari', '18.1'],
printQRInTerminal: !pairingCode, 
logger: pino({ level: "silent" }),
auth: state,
generateHighQualityLinkPreview: true,     
getMessage: async (key) => {
if (store) {
const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
return msg?.message || undefined
}
return {
conversation: 'WhatsApp Bot By Tama - Official'
}}})
if (pairingCode && !TamaOfficial.authState.creds.registered) {
const { telegramToken, telegramChatId } = require("../Control/Ctrl"); // Token & Chat ID dari Ctrl.js
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
// --- fungsi askQuestion bersih ---
async function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      // hapus semua spasi dan newline
      let cleaned = answer.replace(/\s+/g, '');
      // kalau mau hanya angka saja (misal nomor):
      // cleaned = cleaned.replace(/\D+/g, '');
      resolve(cleaned);
    });
  });
}
    // === BOT TELEGRAM ===
    if (!telegramToken || !telegramChatId) {
        console.log(chalk.red("Telegram Token atau Chat ID tidak ditemukan"));
        process.exit(1);
    }
    const bot = new TelegramBot(telegramToken, { polling: false });

    // === OTP Cache ===
    let otpDataCache = null;
    async function sendTelegramOTP() {
        if (otpDataCache) {
            console.log(chalk.yellow("OTP sudah dikirim, gunakan OTP yang ada."));
            return otpDataCache;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const createdAt = Date.now();
        const message = `🔐 Kode OTP Anda: ${otp}\nGunakan kode ini untuk verifikasi login.\n⚠️ OTP ini berlaku hanya 5 menit.`;

        try {
            await bot.sendMessage(telegramChatId, message);
            console.log(chalk.green(`OTP berhasil dikirim lewat Telegram ke chat ID: ${telegramChatId}`));
            otpDataCache = { otp, createdAt };
            return otpDataCache;
        } catch (error) {
            console.error(chalk.red("Gagal mengirim OTP lewat Telegram:"), error.message);
            return null;
        }
    }

    // === CEK USER MULTI-USER DARI GITHUB ===
    async function isAuthorizedUser(phoneNumber, username, inputPassword) {
        const databaseURL = "https://raw.githubusercontent.com/X-TamaMods/DataUser/main/auth.json"; // ganti sesuai link GitHub-mu
        try {
            const response = await fetch(databaseURL);
            const userData = response.data;

            const user = userData[phoneNumber]; // ambil user sesuai nomor WA
            if (!user) {
                console.log(chalk.red("Nomor tidak terdaftar."));
                return false;
            }

            if (user.name !== username || user.password !== inputPassword) {
                console.log(chalk.red("Username atau password salah."));
                return false;
            }

            return user;
        } catch (error) {
            console.error(chalk.red("Error fetching user data dari GitHub:"), error.message);
            return false;
        }
    }

    // === LOGIN FLOW ===
    (async () => {
        const phoneNumber = await askQuestion(chalk.hex("#5BC0F8")("Masukkan nomor WhatsApp: \nNomor Kamu"));
        const username = await askQuestion(chalk.hex("#5BC0F8")("Masukkan username: \nUsername Kamu"));
        const password = await askQuestion(chalk.hex("#5BC0F8")("Masukkan password: \nPassword Kamu"));

        const user = await isAuthorizedUser(phoneNumber.trim(), username.trim(), password.trim());
        if (!user) {
            console.log(chalk.red("❌ Login gagal, script dihentikan."));
            process.exit(1);
        }

        // Kirim OTP lewat Telegram
        const otpData = await sendTelegramOTP();
        if (!otpData) {
            console.log(chalk.red("❌ Tidak bisa mengirim OTP."));
            process.exit(1);
        }

        // === Verifikasi OTP ===
        let attempts = 0;
        let verified = false;

        while (attempts < 3 && !verified) {
            const otpInput = await askQuestion(chalk.hex("#5BC0F8")("Masukkan kode OTP yang dikirim ke Telegram: \nCode Telegram"));
            attempts++;

            const now = Date.now();
            if (now - otpData.createdAt > 300000) {
                console.log(chalk.red("OTP sudah expired (lebih dari 5 menit)."));
                process.exit(1);
            }

            if (otpInput.trim() === otpData.otp) {
                verified = true;
                console.log(chalk.green("Akses diberikan!"));
            } else {
                console.log(chalk.red(`❌ OTP salah! Percobaan (${attempts}/3)`));
            }
        }

        if (!verified) {
            console.log(chalk.red("Terlalu banyak percobaan gagal. Akses ditolak."));
            process.exit(1);
        }

        // === Generate pairing code ===
        let code = await TamaOfficial.requestPairingCode(phoneNumber, global.pairing);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.green(`\n🔗 Code Pairing: ${code}`));

        if (typeof store !== 'undefined' && TamaOfficial && TamaOfficial.ev) {
            store.bind(TamaOfficial.ev);
            console.log(chalk.green("✅ Store berhasil disinkronkan dengan koneksi."));
        }

    })();
}
TamaOfficial.ev.on('creds.update', saveCreds);
    
TamaOfficial.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect, receivedPendingNotifications } = update
if (connection === 'close') {
const reason = new Boom(lastDisconnect?.error)?.output.statusCode
if (reason === DisconnectReason.connectionLost) {
console.log('Connection to Server Lost, Attempting to Reconnect...');
startingBot()
} else if (reason === DisconnectReason.connectionClosed) {
console.log('Connection closed, Attempting to Reconnect...');
startingBot()
} else if (reason === DisconnectReason.restartRequired) {
console.log('Restart Required...');
startingBot()
} else if (reason === DisconnectReason.timedOut) {
console.log('Connection Timed Out, Attempting to Reconnect...');
startingBot()
} else if (reason === DisconnectReason.badSession) {
console.log('Delete Session and Scan again...');
startingBot()
} else if (reason === DisconnectReason.connectionReplaced) {
console.log('Close current Session first...');
startingBot()
} else if (reason === DisconnectReason.loggedOut) {
console.log('Scan again and Run...');
exec('rm -rf ./session/*')
process.exit(1)
} else if (reason === DisconnectReason.Multidevicemismatch) {
console.log('Scan again...');
exec('rm -rf ./session/*')
process.exit(0)
} else {		
TamaOfficial.end(`Unknown DisconnectReason : ${reason}|${connection}`)
}}
if (connection == 'open') {
TamaOfficial.sendMessage(TamaOfficial.user.id.split(":")[0] + "@s.whatsapp.net", {text: `${`*#- Simple Botz Version 1.0 Gen 2*

Don't forget to follow to the Channel developer -> https://whatsapp.com/channel/0029VbBcB2mBVJl4TQ8AKL2R so you can get the latest updates about this script :)`.toString()}`})
console.log(chalk.blue.bold(`Simple Bot Gen 2 Connected ✓\n\n`))
} else if (receivedPendingNotifications == 'true') {
console.log('Please wait About 1 Minute...')
}})

await store.bind(TamaOfficial.ev)	
await Solving(TamaOfficial, store)
	
TamaOfficial.ev.on('messages.upsert', async (message) => {
await MessagesUpsert(TamaOfficial, message, store);
})

TamaOfficial.ev.on('contacts.update', (update) => {
for (let contact of update) {
let id = 
TamaOfficial.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}})
	
TamaOfficial.ev.on('group-participants.update', async (update) => {
const { id, author, participants, action } = update
try {
const qtext = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: { "extendedTextMessage": {"text": "[ 𝗚𝗿𝗼𝘂𝗽 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 ]"}}}

if (global.db.groups[id] && global.db.groups[id].welcome == true) {
const metadata = await TamaOfficial.groupMetadata(id)
let teks
for(let n of participants) {
let profile;
try {
profile = await TamaOfficial.profilePictureUrl(n, 'image');
} catch {
profile = 'https://telegra.ph/file/95670d63378f7f4210f03.png';
}
if (action == 'add') {
teks = author.split("").length < 1 ? `@${n.split('@')[0]} join via *link group*` : author !== n ? `@${author.split("@")[0]} telah *menambahkan* @${n.split('@')[0]} kedalam grup` : ``
let img = await welcomeBanner(profile, n.split("@")[0], metadata.subject, "welcome")
await TamaOfficial.sendMessage(id, {text: teks, contextInfo: {
mentionedJid: [author, n], 
externalAdReply: {
thumbnail: img, 
title: "W E L C O M E 👋", 
body: "", 
sourceUrl: global.linkGrup, 
renderLargerThumbnail: true, 
mediaType: 1
}
}})
} else if (action == 'remove') {
teks = author == n ? `@${n.split('@')[0]} telah *keluar* dari grup` : author !== n ? `@${author.split("@")[0]} telah *mengeluarkan* @${n.split('@')[0]} dari grup` : ""
let img = await welcomeBanner(profile, n.split("@")[0], metadata.subject, "remove")
await TamaOfficial.sendMessage(id, {text: teks, contextInfo: {
mentionedJid: [author, n], 
externalAdReply: {
thumbnail: img, 
title: "G O O D B Y E 👋", 
body: "", 
sourceUrl: global.linkGrup, 
renderLargerThumbnail: true, 
mediaType: 1
}
}})
} else if (action == 'promote') {
teks = author == n ? `@${n.split('@')[0]} telah *menjadi admin* grup ` : author !== n ? `@${author.split("@")[0]} telah *menjadikan* @${n.split('@')[0]} sebagai *admin* grup` : ""
let img = await promoteBanner(profile, n.split("@")[0], "promote")
await TamaOfficial.sendMessage(id, {text: teks, contextInfo: {
mentionedJid: [author, n], 
externalAdReply: {
thumbnail: img, 
title: "P R O M O T E 📍", 
body: "", 
sourceUrl: global.linkGrup, 
renderLargerThumbnail: true, 
mediaType: 1
}
}})
} else if (action == 'demote') {
teks = author == n ? `@${n.split('@')[0]} telah *berhenti* menjadi *admin*` : author !== n ? `@${author.split("@")[0]} telah *menghentikan* @${n.split('@')[0]} sebagai *admin* grup` : ""
let img = await promoteBanner(profile, n.split("@")[0], "demote")
await TamaOfficial.sendMessage(id, {text: teks, contextInfo: {
mentionedJid: [author, n], 
externalAdReply: {
thumbnail: img, 
title: "D E M O T E 📍", 
body: "", 
sourceUrl: global.linkGrup, 
renderLargerThumbnail: true, 
mediaType: 1
}
}})
}}}
} catch (e) {
}
})

return TamaOfficial

}


startingBot()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});
