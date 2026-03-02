import Link from "next/link";
import Image from "next/image";
import { Button, Title, Text, Stack, Container } from "@mantine/core";
import { Logo } from "@/assets/images";
export default function HomePage() {
  return (
    <Container
      size="sm"
      className="min-h-screen flex flex-col justify-center items-center text-center"
    >
      <Stack align="center" gap="lg">
        <Image src={Logo} alt="Stockwise Logo" width={240} height={240} />

        <Text size="lg" c="dimmed">
          Smart inventory management for Food & Beverage brands.
        </Text>

        <Stack w="100%" mt="md">
          <Link href="/login">
            <Button size="md" fullWidth>
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button variant="outline" size="md" fullWidth>
              Register
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}
