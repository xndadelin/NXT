'use client';

import { useState } from "react";
import { Burger, Container, Group } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";

import classes from "@/app/styles/Navbar.module.css"
import Link from "next/link";

const Navbar: React.FC = () => {
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
    ))

    return (
        <header className={classes.header}>
            <Container className={classes.inner}>
                <Link style={{ textDecoration: 'none', color: 'inherit' }} href="/" className={classes.logo}>
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
    )
}


export { Navbar }