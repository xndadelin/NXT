import { Loader, Center } from "@mantine/core";

export default function Loading() {
  return (
    <Center h="calc(100vh - 400px)">
      <Loader size="xl" type="dots" />
    </Center>
  );
}
