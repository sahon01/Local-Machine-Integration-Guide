"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { VoiceInputField } from "@/components/voice-input-field"
import { CheckCircle, Plus, Clock } from "lucide-react"
import { useVoice } from "@/components/voice-provider"

const initialTasks = [
  {
    id: 1,
    title: "Review pull request #123",
    completed: false,
    priority: "high",
    dueTime: "10:00",
    project: "AI Dashboard",
  },
  {
    id: 2,
    title: "Update documentation",
    completed: true,
    priority: "medium",
    dueTime: "11:30",
    project: "API Project",
  },
  {
    id: 3,
    title: "Fix responsive design issues",
    completed: false,
    priority: "high",
    dueTime: "15:00",
    project: "E-commerce",
  },
  {
    id: 4,
    title: "Prepare client presentation",
    completed: false,
    priority: "urgent",
    dueTime: "13:30",
    project: "Client Work",
  },
]

export function TaskManager() {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState("")
  const { speak } = useVoice()

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updated = { ...task, completed: !task.completed }
          if (updated.completed) {
            speak(`Task completed: ${updated.title}`)
          }
          return updated
        }
        return task
      }),
    )
  }

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: "medium",
        dueTime: "",
        project: "",
      }
      setTasks((prev) => [...prev, task])
      setNewTask("")
      speak(`New task added: ${newTask}`)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Task Manager
        </CardTitle>
        <CardDescription>Track your daily tasks and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new task */}
          <div className="flex gap-2">
            <VoiceInputField
              value={newTask}
              onChange={setNewTask}
              placeholder="Add a new task..."
              onSubmit={addTask}
              className="flex-1"
            />
            <Button onClick={addTask} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Task list */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className={`border rounded-lg p-3 ${task.completed ? "bg-gray-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />
                  <div className="flex-1">
                    <div className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {task.dueTime && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Clock className="h-3 w-3" />
                          <span>{task.dueTime}</span>
                        </div>
                      )}
                      {task.project && (
                        <Badge variant="outline" className="text-xs">
                          {task.project}
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Task summary */}
          <div className="border-t pt-4">
            <div className="text-sm text-slate-600">
              {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
