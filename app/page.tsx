'use client';

import Image from "next/image";
import { HeroSection } from "./components/ui/HeroSection";
import { Divider, Text } from "@mantine/core";


export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 300px)",
      }}
    >
      <HeroSection />
      <svg
        style={{ marginTop: 140, marginBottom: 40 }}
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-down"
        
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 3.66a1 1 0 0 0 -1 1v5.585l-2.293 -2.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l4 4c.028 .028 .057 .054 .094 .083l.092 .064l.098 .052l.081 .034l.113 .034l.112 .02l.117 .006l.115 -.007l.114 -.02l.142 -.044l.113 -.054l.111 -.071a.939 .939 0 0 0 .112 -.097l4 -4l.083 -.094a1 1 0 0 0 -1.497 -1.32l-2.293 2.291v-5.584l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
      </svg>
      <section id="about">
        <Text 
          component="h1"
          style={{ textAlign: "center", fontSize: "2rem" }}
          fw={700}
          c={"var(--mantine-color-cyan-6)"}
        >
            About NextCTF
        </Text>
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 100,
          gap: 200,
        }}>
          <Text style={{ maxWidth: 600, textAlign: "left", marginTop: 20 }}>
            <Text component="span" fw={700} c="cyan">NextCTF </Text>
            is a {" "}
            <Text component="span" fw={700} c="red">Capture The Flag (CTF)</Text> platform designed to provide cybersecurity enthusiasts with challenges and competitions to up their skills!
            For begginers: CTF is a type of{" "}
            <Text component="span" fw={700}>cybersecurity contest</Text> where participants solve security related challenges to earn points, that can range from{" "}
            <Text component="span" c="teal" fw={700}> basic tasks like finding hidden flags in code </Text> to {" "}
            <Text component="span" c="grape" fw={700}> complex problems involving cryptography, web security, and reverse engineering.</Text>
            {" "} Points are {" "}
            <Text component="span" c="orange" fw={700}>dynamically allocated</Text> based on the number of people who have solved the challenge, making it more rewarding to solve harder problems.
          </Text>
          <Image
            src="https://em-content.zobj.net/source/apple/114/triangular-flag-on-post_1f6a9.png"
            alt="a triangular red flag on post"
            width={200}
            height={200}
          />
        </div>
      </section>
      <Divider my={80} w={200}/>
      <section id="features">
        <Text 
          component="h1"
          style={{ textAlign: "center", fontSize: "2rem" }}
          fw={700}
          c={"var(--mantine-color-cyan-6)"}
        >
            Features
        </Text>
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Image
            src="https://em-content.zobj.net/source/apple/96/white-medium-star_2b50.png"
            alt="a white star"
            width={200}
            height={200}
          />
          <div>
            <Text component="div" style={{ maxWidth: 600, textAlign: "right", marginTop: 20 }}>
              <Text component="span" fw={700} c={"cyan"}>NextCTF </Text> 
              offers a variety of features to enhance your CTF experience:
            </Text>
            
            <ul style={{
              listStyle: 'none',
              textAlign: "right",
              paddingLeft: 0,
              maxWidth: 600,
              marginTop: 10
            }}>
              <li style={{ marginBottom: 8 }}>
                <Text component="div">
                  <Text component="span" fw={700} c={"teal"}>Challenges</Text>: a wide range of challenges in categories like web security, cryptography, reverse engineering, and more.
                </Text>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Text component="div">
                  <Text component="span" fw={700} c="orange">Contests:</Text> regularly scheduled competitions where you can compete against others and climb the leaderboard!
                </Text>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Text component="div">
                  <Text component="span" fw={700} c="grape">Luigi:</Text> an AI-powered assistant that can help you with hints and guidance when you are stuck on a challenge.
                </Text>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Text component="div">
                  <Text component="span" fw={700} c="red">Track progress:</Text> keep an eye on your solved challenges, points, and ranking on the leaderboard.
                </Text>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Divider my={80} w={200}/>
    </div>
  );
}
