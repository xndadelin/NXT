'use client';
import { useState } from "react";
import { Modal, ActionIcon, Image } from "@mantine/core";
import useUser from "@/app/utils/queries/user/useUser";

export default function LuigiWidget() {
     const luigiImage = "https://hackclub.com/stickers/single%20neuron%20activated.png";
     const [opened, setOpened] = useState<boolean>(false);
     const { user, loading } = useUser();
     if(!user && !loading) return null;

     return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Luigi - Your AI assistant"
                size="lg"
                centered
                fullScreen
            >   
                <div>
                    asdlkjadlas
                </div>
            </Modal>
            <div
                style={{
                    position: 'fixed',
                    left: 20,
                    bottom: 20,
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ActionIcon
                    onClick={() => setOpened(true)}
                    size={64}
                    radius='xl'
                    variant="transparent"
                    aria-label="Open Luigi AI Assistant"
                    style={{
                        padding: 0,
                        backgroundColor: 'transparent'
                    }}
                >
                    <Image
                        src={luigiImage}
                        alt="Luigi AI assistant"
                        width={64}
                        height={64}
                        style={{ borderRadius: '50%' }}
                    />
                </ActionIcon>
            </div>
        </>
     )
}