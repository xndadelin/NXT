import { useState } from "react";

import { IconChevronDown, IconSettings } from "@tabler/icons-react";
import { Tabs, Container, Group, Burger, Menu, UnstyledButton, Avatar, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import cx from 'clsx'
import Link from "next/link"; 
import classes from "@/app/components/header/header.module.css"
import logout from "@/app/utils/auth/logout";
import { notifications } from "@mantine/notifications";
import useUser from "@/app/utils/queries/user/useUser";
import { Error } from "../ui/Error";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from "react";

export default function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const router = useRouter();
    const { user: user_data, error: userError } = useUser();
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>('Home');
    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const path = pathname === "/" ? "Home" : pathname.split("/")[1];
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);

        const validTabs = ["Home", "Challenges", "Leaderboard", "Learn", "Community"];
        if (validTabs.includes(formattedPath)) {
            setActiveTab(formattedPath);
        } else {
            setActiveTab("Home");
        }
    }, [pathname]);

    const [userMenuOpened, setUserMenuOpened] = useState<boolean>(false);
    if (userError) return <Error number={500} />
    
    const user = {
        name: user_data?.user_metadata?.username,
        image: user_data?.user_metadata?.avatar_url || null,
    }

    const tabs = ["Home", "Challenges", "Leaderboard", "Learn", "Community"].map((tab) => (
        <Tabs.Tab value={tab} key={tab}>
            {tab}
        </Tabs.Tab>
    ))

    const onLogout = async () => {
        setLoading(true);
        setError(null);
        try {
            await logout();
            notifications.show({
                title: 'Success',
                message: 'You have been logged out successfully.',
                color: 'green',
            })
            router.push('/');
        } catch (error) {
            setError(String(error));
        } finally {
            setLoading(false);
        }
    }

    const getTabPath = (tab: string) => {
        return tab === "Home" ? "/" : `/${tab.toLowerCase()}`;
    }

    if (error) return <Error number={500} />


    return (
        <div className={classes.header}>
            <Container className={classes.inner}>
                <Group justify="space-between" align="center">

                    <Link style={{ textDecoration: 'none', color: 'inherit', margin: 0, padding: 0 }} href="/" className={classes.logo}>
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
                            <Link href="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>Account settings</Menu.Item>
                            </Link>
                            <Menu.Item color="red" onClick={onLogout} disabled={loading}>Logout</Menu.Item>
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
                    onChange={(value) => {
                        router.push(getTabPath(value as string));
                    }}
                    value={activeTab}
                >
                    <Tabs.List>{tabs}</Tabs.List>
                </Tabs>
            </Container>
        </div>
    )
}