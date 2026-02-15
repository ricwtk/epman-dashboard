<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldSeparator,
  FieldDescription
} from "@/components/ui/field"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-vue-next";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ref, watch } from "vue"
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import type { FirebaseError } from "firebase/app"
const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const showResetForm = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push({ name: "schoollist" });
  } catch (error) {
    const firebaseError = error as FirebaseError;
    errorMessage.value = firebaseError.message;
    successMessage.value = "";
  }
};

const handleResetPassword = async () => {
  try {
    await authStore.resetPassword(email.value);
    successMessage.value = "Check your email to reset your password!";
    errorMessage.value = "";
    showResetForm.value = false;
  } catch (error) {
    const firebaseError = error as FirebaseError;
    errorMessage.value = firebaseError.message;
    successMessage.value = "";
  }
};

watch(showResetForm, (newValue, oldValue) => {
  if (newValue) {
    errorMessage.value = "";
    successMessage.value = "";
    password.value = "";
  }
});

</script>

<template>
  <!-- <div class="flex flex-col gap-6"> -->
  <div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-xl">
            Welcome to EPMan Dashboard
          </CardTitle>
          <CardDescription>
            The Engineering Programme Management Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form v-if="!showResetForm" @submit.prevent="handleLogin">
            <Field>
              <Alert v-if="successMessage">
                <CheckCircle2Icon />
                <AlertTitle>{{ successMessage }}</AlertTitle>
              </Alert>
              <Alert v-if="errorMessage" variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{{ errorMessage }}</AlertTitle>
              </Alert>
            </Field>
            <FieldGroup>
              <Field>
                <FieldLabel for="email">
                  Email
                </FieldLabel>
                <Input
                  v-model="email"
                  id="email"
                  type="email"
                  placeholder="name@sunway.edu.my"
                  required
                />
              </Field>
              <Field>
                <div class="flex items-center">
                  <FieldLabel for="password">
                    Password
                  </FieldLabel>
                  <a
                    @click.prevent="showResetForm = true"
                    class="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <Input
                  v-model="password"
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" variant="outline">Login</Button>
              </Field>
              <FieldDescription class="text-center">
                Don't have an account? Email admin to create your account.
              </FieldDescription>
            </FieldGroup>
          </form>
          <form v-else @submit.prevent="handleResetPassword">
            <Field>
              <Alert v-if="successMessage">
                <CheckCircle2Icon />
                <AlertTitle>{{ successMessage }}</AlertTitle>
              </Alert>
              <Alert v-if="errorMessage" variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{{ errorMessage }}</AlertTitle>
              </Alert>
            </Field>
            <FieldGroup>
              <Field>
                <FieldLabel for="email">
                  Email
                </FieldLabel>
                <Input
                  v-model="email"
                  id="email"
                  type="email"
                  placeholder="name@sunway.edu.my"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" variant="outline">Reset Password</Button>
                <Button variant="ghost" @click.prevent="showResetForm = false">Return to Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
  <!-- </div> -->
</template>
