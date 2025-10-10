import { useState } from "react";

import { IconChevronDown, IconSettings } from "@tabler/icons-react";
import { useMantineTheme, Tabs, Container, Group, Burger, Menu, UnstyledButton, Avatar, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import cx from 'clsx'
import Link from "next/link"; 
import classes from "@/app/components/header/header.module.css"



export default function Header() {
    const theme = useMantineTheme();
    const [opened, { toggle }] = useDisclosure(false);

    const user = {
        name: 'floricica',
        email: 'floricica@next.ro',
        image: 'https://avatars.githubusercontent.com/u/1486366?v=4'
    }

    const [userMenuOpened, setUserMenuOpened] = useState<boolean>(false);
    const tabs = ["Home", "Challenges", "Leaderboard", "Learn", "Community"].map((tab) => (
        <Tabs.Tab value={tab} key={tab}>
            {tab}
        </Tabs.Tab>
    ))

    return (
        <div className={classes.header}>
            <Container className={classes.inner}>
                <Group justify="space-between" align="center">

                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href="/" className={classes.logo}>
                        NXT
                    </Link>

                    <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

                    <Menu width={260} position="bottom-end" transitionProps={{ transition: 'pop-top-right'}} onClose={() => setUserMenuOpened(false)} onOpen={() => setUserMenuOpened(true)} withinPortal>
                        <Menu.Target>
                            <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                                <Group gap={7}>
                                    <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                                    <Text fw={500} size="sm" lh={1} mr={3}>
                                        {user.name}
                                    </Text>
                                    <IconChevronDown size={12} stroke={1.5} />
                                </Group>
                            </UnstyledButton>   
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Settings</Menu.Label>
                            <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>Account settings</Menu.Item>
                            <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>Logout</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Container>
            <Container size="md">   
                <Tabs
                    defaultValue={"Home"}
                    variant="outline"
                    visibleFrom="sm"
                    classNames={{
                        root: classes.tabs,
                        list: classes.tabsList,
                        tab: classes.tab,
                    }}
                >
                    <Tabs.List>{tabs}</Tabs.List>
                </Tabs>
            </Container>
        </div>
    )
}