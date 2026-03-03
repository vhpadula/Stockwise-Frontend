"use client";

import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Container,
  Notification,
} from "@mantine/core";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard/products"); // redirect after login
    } catch (err: unknown) {
      type ErrorResponse = {
        response?: {
          data?: {
            detail?: string;
          };
        };
      };

      const errorObj = err as ErrorResponse;

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof errorObj.response?.data?.detail === "string"
      ) {
        setError(errorObj.response!.data!.detail!);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      size="sm"
      className="min-h-screen flex justify-center items-center"
    >
      <form onSubmit={handleSubmit} className="w-full">
        <Stack gap="md">
          <Title order={2} className="text-center">
            Login
          </Title>

          {error && <Notification color="red">{error}</Notification>}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} fullWidth>
            Login
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
