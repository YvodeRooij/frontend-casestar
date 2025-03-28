"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Message, PracticeState, PracticeType, ChartData, TableData } from "@/types/practice"
import { cn } from "@/lib/utils"
import { Mic, MicOff, Send, Play, Pause, BarChart2, TableIcon, HelpCircle, Clock } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"

interface PracticeDojoProps {
  id: string
  title: string
  initialMessages: Message[]
  practiceType: PracticeType
  onProgressUpdate: (progress: number) => void
}

export function PracticeDojo({ id, title, initialMessages, practiceType, onProgressUpdate }: PracticeDojoProps) {
  const [state, setState] = useState<PracticeState>({
    messages: initialMessages,
    progress: 0,
    currentStep: 0,
    isAiSpeaking: false,
    isUserSpeaking: false,
  })

  const [userInput, setUserInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [activeDataView, setActiveDataView] = useState<string | null>(null)
  const [showFrameworks, setShowFrameworks] = useState(false)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [state.messages])

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    const newMessages = [
      ...state.messages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: userInput,
        contentType: "text",
      },
    ]

    setState((prev) => ({
      ...prev,
      messages: newMessages,
    }))

    setUserInput("")
    // In a real application, we would send this message to an AI or backend for processing
    // and then add the response to the messages
  }

  const startSpeechRecognition = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.onstart = () => {
        setState((prev) => ({ ...prev, isUserSpeaking: true }))
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setUserInput(transcript)
      }

      recognition.onend = () => {
        setState((prev) => ({ ...prev, isUserSpeaking: false }))
        handleSendMessage()
      }

      recognition.start()
    } else {
      console.error("Speech recognition not supported")
    }
  }

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play()
    setIsPlayingAudio(true)
    setState((prev) => ({ ...prev, isAiSpeaking: true }))

    audio.onended = () => {
      setIsPlayingAudio(false)
      setState((prev) => ({ ...prev, isAiSpeaking: false }))
    }
  }

  const renderChart = (data: ChartData) => {
    return (
      <div className="w-full h-64 bg-card p-4 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          {data.type === "line" && (
            <LineChart data={data.data}>
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          )}
          {data.type === "bar" && (
            <BarChart data={data.data}>
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          )}
          {data.type === "pie" && (
            <PieChart>
              <Pie data={data.data} dataKey="value" nameKey="name" fill="#8884d8" />
              <RechartsTooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    )
  }

  const renderTable = (data: TableData) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {data.headers.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const renderMessageContent = (message: Message) => {
    switch (message.contentType) {
      case "chart":
        return (
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => setActiveDataView(message.id)}
          >
            <BarChart2 className="w-4 h-4" />
            <span>View Chart</span>
          </Button>
        )
      case "table":
        return (
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => setActiveDataView(message.id)}
          >
            <TableIcon className="w-4 h-4" />
            <span>View Table</span>
          </Button>
        )
      case "audio":
        return (
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => playAudio(message.audioUrl!)}>
              {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <span>{message.content}</span>
          </div>
        )
      default:
        return <p>{message.content}</p>
    }
  }

  const renderInputArea = () => {
    return (
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={state.isUserSpeaking ? "destructive" : "default"}
                size="icon"
                onClick={startSpeechRecognition}
              >
                {state.isUserSpeaking ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{state.isUserSpeaking ? "Stop Recording" : "Start Recording"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input
          placeholder="Type your response or click the mic to speak..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          className="flex-1"
        />
        <Button onClick={handleSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const renderFrameworks = () => {
    const frameworks = [
      { name: "Porter's Five Forces", description: "Analyze competitive forces in an industry" },
      { name: "SWOT Analysis", description: "Evaluate Strengths, Weaknesses, Opportunities, and Threats" },
      { name: "4Ps of Marketing", description: "Product, Price, Place, and Promotion" },
      { name: "BCG Matrix", description: "Analyze product portfolio based on market growth and market share" },
    ]

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Consulting Frameworks</h3>
        {frameworks.map((framework, index) => (
          <Card key={index} className="p-4">
            <h4 className="font-medium">{framework.name}</h4>
            <p className="text-sm text-muted-foreground">{framework.description}</p>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-[600px] rounded-lg border">
      <ResizablePanel defaultSize={70}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            <ScrollArea ref={scrollRef} className="h-full">
              <AnimatePresence>
                <div className="p-4 space-y-4">
                  {state.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "rounded-lg px-4 py-2 max-w-[80%]",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.role === "interviewer"
                              ? "bg-muted"
                              : "bg-green-100",
                        )}
                      >
                        {renderMessageContent(message)}
                      </div>
                    </motion.div>
                  ))}
                  {state.isAiSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <span className="animate-pulse">AI is speaking...</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            </ScrollArea>
          </div>
          <div className="p-4 border-t">{renderInputArea()}</div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <Tabs defaultValue="data" className="h-full flex flex-col">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="data">Data View</TabsTrigger>
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          </TabsList>
          <TabsContent value="data" className="flex-1 p-4 bg-muted">
            <h3 className="text-lg font-semibold mb-4">Data View</h3>
            {activeDataView && (
              <Card className="p-4">
                {state.messages.find((m) => m.id === activeDataView)?.contentType === "chart" &&
                  renderChart(state.messages.find((m) => m.id === activeDataView)?.data as ChartData)}
                {state.messages.find((m) => m.id === activeDataView)?.contentType === "table" &&
                  renderTable(state.messages.find((m) => m.id === activeDataView)?.data as TableData)}
              </Card>
            )}
            {!activeDataView && <p className="text-muted-foreground">Select a chart or table to view the data.</p>}
          </TabsContent>
          <TabsContent value="frameworks" className="flex-1 p-4 bg-muted overflow-auto">
            {renderFrameworks()}
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

