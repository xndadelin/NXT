# NextCTF 🚩

NextCTF is an open-source Capture The Flag (CTF) platform for learning and practicing cybersecurity through challenges & contests.

## Some key features
- Dynamic scoring for challenges
- Challenges across multiple categories (web, crypto, pwn, RE, forensics)
- Contests 
- Leaderbord 
- Writeups
- Learn page

## Requirement to run it on you localhost
- Node.js 20+
- Yarn
- Docker
- Supabase instance

## Local setup
1. Clone the rep
```git clone https://github.com/xndadelin/NXT.git
cd NXT
```

2. Copy environment file
```cp .env.example .env```

3. Set environment variables in `.env`
- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_ANON_KEY=

## Production
```yarn build
yarn start
```

## Docker
Build: ```docker build -t nxt-app .```
Run: ```docker run --env-file .env -p 3000:3000 nxt-app```

## Testing
```yarn test```

## Contributing
Open issues or PRs on Github. Pls write clear commit messages.
