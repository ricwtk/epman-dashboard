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
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
          <FieldGroup>
            <Field>
              <FieldLabel for="email">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="name@sunway.edu.my"
                required
              />
              <Button variant="outline">Get login link</Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  </div>
  <!-- </div> -->
</template>
