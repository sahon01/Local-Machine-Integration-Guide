"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface VoiceContextType {
  isVoiceEnabled: boolean
  currentLanguage: "en" | "bn"
  speak: (text: string, language?: "en" | "bn") => void
  stopSpeaking: () => void
  toggleVoice: () => void
  setLanguage: (language: "en" | "bn") => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "bn">("en")
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback(
    (text: string, language: "en" | "bn" = currentLanguage) => {
      if (!isVoiceEnabled || !window.speechSynthesis) return

      // Stop any current speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Set voice based on language
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find((v) =>
        language === "bn"
          ? v.lang.includes("bn") || v.lang.includes("hi") // Fallback to Hindi for Bengali
          : v.lang.includes("en"),
      )

      if (voice) {
        utterance.voice = voice
      }

      utterance.lang = language === "bn" ? "bn-BD" : "en-US"
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      setCurrentUtterance(utterance)
      window.speechSynthesis.speak(utterance)
    },
    [isVoiceEnabled, currentLanguage],
  )

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setCurrentUtterance(null)
  }, [])

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled((prev) => !prev)
    if (!isVoiceEnabled) {
      stopSpeaking()
    }
  }, [isVoiceEnabled, stopSpeaking])

  const setLanguage = useCallback((language: "en" | "bn") => {
    setCurrentLanguage(language)
  }, [])

  return (
    <VoiceContext.Provider
      value={{
        isVoiceEnabled,
        currentLanguage,
        speak,
        stopSpeaking,
        toggleVoice,
        setLanguage,
      }}
    >
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider")
  }
  return context
}
