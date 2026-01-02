"use client"

import { sendContactEmail } from "@/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactFormSchema, ContactFormValues } from "@/lib/schemas/contact"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field"

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactEmail, null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  useEffect(() => {
    if (!state) return

    if (!state.success) {
      toast.error(state.message)
      return
    }

    toast.success(state.message)
  }, [state])

  return (
    <form action={formAction} className="max-w-md space-y-4 p-6 shadow-md">
      <FieldSet>
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>

                <Input
                  placeholder="Your name"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>

                <Input
                  placeholder="you@example.com"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="subject"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Subject</FieldLabel>

                <Input
                  placeholder="Subject..."
                  data-invalid={fieldState.invalid}
                  {...field}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="message"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Message</FieldLabel>

                <Textarea
                  placeholder="Your message..."
                  aria-invalid={fieldState.invalid}
                  {...field}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending..." : "Send"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
