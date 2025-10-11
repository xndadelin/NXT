"use client";

import { useState } from "react";
import { Burger, Container, Group } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import useUser from "@/app/utils/queries/user/useUser";

import classes from "@/app/styles/Navbar.module.css";
import Link from "next/link";
import Header from "../header/Header";
import Loading from "./Loading";
import { Error } from "./Error";

const Navbar: React.FC = () => {
  const { user, error } = useUser();
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState("Home");

  const tabs = ["About", "Features", "Community"].map((tab) => (
    <a
      key={tab}
      href={`/#${tab.toLowerCase()}`}
      className={classes.link}
      data-active={active === tab || undefined}
      onClick={() => {
        setActive(tab);
      }}
    >
      {tab}
    </a>
  ));

  if (error) return <Error number={500} />;

  return !user ? (
    <header className={classes.header}>
      <Container className={classes.inner}>
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          href="/"
          className={classes.logo}
        >
          NXT
        </Link>
        <Group gap={5} visibleFrom="sm">
          {tabs}
        </Group>
        <Burger
          opened={opened}
          onClick={toggle}
          size="sm"
          className={classes.burger}
          hiddenFrom="sm"
        />
      </Container>
    </header>
  ) : (
    <Header />
  );
};

export { Navbar };
