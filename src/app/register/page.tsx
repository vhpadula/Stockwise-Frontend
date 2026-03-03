"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { UsersService } from "@/services/Users";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Name must have at least 3 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await UsersService.registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      router.push("/login");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setErrorMessage(
        axiosError.response?.data?.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      size="xs"
      className="min-h-screen flex justify-center items-center"
    >
      <Paper p="xl" radius="md" withBorder className="w-full">
        <Title order={2} mb="md" className="text-center">
          Create an Account
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder="Your Name"
            {...form.getInputProps("name")}
            mb="sm"
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            {...form.getInputProps("email")}
            mb="sm"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            mb="sm"
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            {...form.getInputProps("confirmPassword")}
            mb="sm"
          />

          {errorMessage && (
            <Text color="red" size="sm" mb="sm">
              {errorMessage}
            </Text>
          )}

          <Button type="submit" fullWidth loading={loading}>
            Register
          </Button>
        </form>

        <Group justify="space-between" mt="md">
          <Text size="sm">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </Text>
        </Group>
      </Paper>
    </Container>
  );
}
