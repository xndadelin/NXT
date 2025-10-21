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
