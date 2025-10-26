<div align="center">
  <a href="https://moonshot.hackclub.com" target="_blank">
    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/35ad2be8c916670f3e1ac63c1df04d76a4b337d1_moonshot.png" 
         alt="This project is part of Moonshot, a 4-day hackathon in Florida visiting Kennedy Space Center and Universal Studios!" 
         style="width: 100%;">
  </a>
</div>

# NextCTF 🚩

NextCTF is an open-source Capture The Flag (CTF) platform for learning and practicing cybersecurity through challenges & contests.

## Some key features
- Dynamic scoring for challenges
- Challenges across multiple categories (web, crypto, pwn, RE, forensics)
- Contests 
- Leaderbord 
- Writeups
- Learn page

## Requirements to run it on you localhost
- Node.js 20+
- Yarn
- Docker
- Supabase instance

## Local setup
1. Clone the repo
```bash
git clone https://github.com/xndadelin/NXT.git
cd NXT
```

2. Copy environment file
```bash
cp .env.example .env
```

3. Set environment variables in `.env`
- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_ANON_KEY=

## Production
```bash
yarn build
yarn start
```

## Docker
Build: 
```bash
docker build -t nxt-app .
```
Run: 
```bash
docker run --env-file .env -p 3000:3000 nxt-app
```

## Testing
```bash
yarn test
```

## Contributing
Open issues or PRs on Github. Pls write clear commit messages.
