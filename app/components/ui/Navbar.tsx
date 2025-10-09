'use client';

import { useState } from "react";
import { Burger, Container, Group } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";

import classes from "@/app/styles/Navbar.module.css"

const Navbar: React.FC = () => {
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState("Home");

    const tabs = ["About", "Features", "Community"].map((tab) => (
        <a
          key={tab}
          href={`#${tab.toLowerCase()}`}
          className={classes.link}
          data-active={active === tab || undefined}
          onClick={(e) => {
            e.preventDefault();
            setActive(tab);
          }}
        >
            {tab}
        </a>
    ))
    return (
        <header className={classes.header}>
            <Container className={classes.inner}>
                <span className={classes.logo}>NXT</span>
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