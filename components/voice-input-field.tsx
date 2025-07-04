"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useVoice } from "@/components/voice-provider"
import { Mic, MicOff, Play, Square } from "lucide-react"
import type { SpeechRecognition } from "web-speech-api"

interface VoiceInputFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  onSubmit?: () => void
  className?: string
  disabled?: boolean
}

export function VoiceInputField({
  value,
  onChange,
  placeholder,
  multiline = false,
  onSubmit,
  className,
  disabled,
}: VoiceInputFieldProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const { speak, stopSpeaking, isVoiceEnabled, currentLanguage } = useVoice()

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = currentLanguage === "bn" ? "bn-BD" : "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        onChange(value + finalTranscript)
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
    setRecognition(recognition)
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setRecognition(null)
    }
    setIsListening(false)
  }

  const handlePlayText = () => {
    if (value.trim()) {
      speak(value, currentLanguage)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !multiline && onSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }

  const InputComponent = multiline ? Textarea : Input

  return (
    <div className="relative">
      <InputComponent
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pr-24 ${className}`}
        disabled={disabled}
        onKeyPress={handleKeyPress}
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={isListening ? stopListening : startListening}
          disabled={disabled}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handlePlayText}
          disabled={disabled || !value.trim()}
          title="Play text as speech"
        >
          <Play className="h-4 w-4" />
        </Button>
        {onSubmit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            title="Submit"
          >
            <Square className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
