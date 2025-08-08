
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MessageFormProps {
  deviceId: string;
  onJsonCommand: (payload: object, deviceId: string) => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  message: z.string().min(1, "Message is required").max(200),
});

const presets = [
  {
    id: "custom",
    name: "Custom Message",
    title: "",
    message: "",
  },
  {
    id: "temp-high",
    name: "Alert: Temp High",
    title: "ALERT",
    message: "Temperature threshold exceeded. Check ventilation system.",
  },
  {
    id: "hum-high",
    name: "Alert: Humidity High",
    title: "ALERT",
    message: "Humidity threshold exceeded. Check dehumidifier.",
  },
  {
    id: "system-ok",
    name: "Status: System OK",
    title: "STATUS",
    message: "All systems nominal. Environment is stable.",
  },
];

export function MessageForm({ deviceId, onJsonCommand }: MessageFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
    },
  });

  function handlePresetChange(presetId: string) {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      form.setValue("title", preset.title);
      form.setValue("message", preset.message);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      command: "display_message",
      ...values,
    };
    onJsonCommand(payload, deviceId);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label>Presets</Label>
          <Select onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a preset message" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g. ALERT, STATUS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the message to display on the device."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </Form>
  );
}
