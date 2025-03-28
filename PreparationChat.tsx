"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Message, PreparationState } from "@/types/preparation"
import { ArrowDown, CheckCircle, Circle } from "lucide-react"

interface PreparationChatProps {
  id: string
  title: string
  initialMessages: Message[]
  onProgressUpdate: (progress: number) => void
}

export function PreparationChat({ id, title, initialMessages, onProgressUpdate }: PreparationChatProps) {
  const [state, setState] = useState<PreparationState>({
    messages: initialMessages,
    progress: 0,
    currentStep: 0,
    quizAnswers: {},
    exerciseCompleted: false,
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    const scrollArea = scrollRef.current
    if (!scrollArea) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }

    scrollArea.addEventListener("scroll", handleScroll)
    return () => scrollArea.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }

  const handleQuizAnswer = (messageId: string, answer: string) => {
    setState((prev) => {
      const message = prev.messages.find((m) => m.id === messageId)
      if (!message || prev.quizAnswers[messageId]) return prev

      const isCorrect = message.correctAnswer === answer
      const newMessages = [...prev.messages]

      // Add feedback message
      newMessages.push({
        id: `feedback-${messageId}`,
        role: "system",
        content: isCorrect ? "Correct! Well done." : `Not quite. The correct answer is: ${message.correctAnswer}`,
        type: "feedback",
      })

      // If correct, add next message if available
      if (isCorrect && prev.currentStep < initialMessages.length - 1) {
        newMessages.push(initialMessages[prev.currentStep + 1])
      }

      const newProgress = Math.min(100, prev.progress + (isCorrect ? 25 : 0))

      onProgressUpdate(newProgress)

      return {
        ...prev,
        messages: newMessages,
        quizAnswers: { ...prev.quizAnswers, [messageId]: answer },
        currentStep: isCorrect ? prev.currentStep + 1 : prev.currentStep,
        progress: newProgress,
      }
    })
  }

  const handleExerciseComplete = (messageId: string) => {
    setState((prev) => {
      if (prev.exerciseCompleted) return prev

      const newMessages = [...prev.messages]

      // Add completion message
      newMessages.push({
        id: `complete-${messageId}`,
        role: "system",
        content: "Great job completing the exercise! Let's move on to the next topic.",
        type: "feedback",
      })

      // Add next message if available
      if (prev.currentStep < initialMessages.length - 1) {
        newMessages.push(initialMessages[prev.currentStep + 1])
      }

      const newProgress = Math.min(prev.progress + 25, 100)
      onProgressUpdate(newProgress)

      return {
        ...prev,
        messages: newMessages,
        exerciseCompleted: true,
        currentStep: prev.currentStep + 1,
        progress: newProgress,
      }
    })
  }

  return (
    <Card className="flex flex-col h-[600px] relative">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {state.messages.map((message) => (
            <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {message.type === "quiz" ? (
                  <div className="space-y-2">
                    <p className="font-medium">{message.content}</p>
                    <div className="grid gap-2">
                      {message.options?.map((option) => (
                        <Button
                          key={option}
                          variant={state.quizAnswers[message.id] === option ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => handleQuizAnswer(message.id, option)}
                          disabled={state.quizAnswers[message.id] !== undefined}
                        >
                          <div className="flex items-center">
                            {state.quizAnswers[message.id] === option ? (
                              <CheckCircle className="mr-2 h-4 w-4" />
                            ) : (
                              <Circle className="mr-2 h-4 w-4" />
                            )}
                            {option}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : message.type === "exercise" ? (
                  <div className="space-y-2">
                    <p className="font-medium">{message.content}</p>
                    <Button onClick={() => handleExerciseComplete(message.id)} disabled={state.exerciseCompleted}>
                      {state.exerciseCompleted ? "Completed" : "Mark as Complete"}
                    </Button>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </Card>
  )
}

