CUCKWARE CLEAN MODULAR SETUP

1) BACK UP YOUR OLD BOT FOLDER FIRST
   Copy your current bot folder somewhere safe before replacing files.

2) EXTRACT THIS ZIP
   Right-click the zip > Extract All.

3) COPY FILES INTO YOUR BOT FOLDER
   Copy everything from the extracted folder into your bot folder.
   Choose Replace Files if Windows asks.

4) KEEP YOUR REAL .env
   This zip includes .env.example, not your real .env.
   Your real .env must contain:
   TOKEN=your_discord_bot_token

5) INSTALL DEPENDENCIES IF NEEDED
   npm install

6) START BOT
   node index.js

7) TEST PREFIX
   ,help
   ,prefix !
   !help

8) CONFIG
   Open config.json and replace PASTE_YOUR_USER_ID_HERE with your Discord User ID.
   Add your ID to nukeWhitelist so you can use nuke.

9) BLACKLIST
   Edit blacklist.json or use:
   ,blacklist word
   ,whitelist word
   ,blacklistlist

10) RAILWAY
   Push to GitHub after testing locally:
   git add .
   git commit -m "Clean modular bot"
   git push
