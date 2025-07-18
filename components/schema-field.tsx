"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react"
import type { SchemaFieldData, FieldType } from "./json-schema-builder"

interface SchemaFieldProps {
  field: SchemaFieldData
  onUpdate: (fieldId: string, updates: Partial<SchemaFieldData>) => void
  onDelete: (fieldId: string) => void
  onAddChild: (parentId: string) => void
  canDelete: boolean
  level: number
}

const fieldTypeOptions: { value: FieldType; label: string; color: string }[] = [
  { value: "text", label: "Text", color: "bg-blue-100 text-blue-800" },
  { value: "number", label: "Number", color: "bg-green-100 text-green-800" },
  { value: "boolean", label: "Boolean", color: "bg-purple-100 text-purple-800" },
  { value: "email", label: "Email", color: "bg-orange-100 text-orange-800" },
  { value: "url", label: "URL", color: "bg-cyan-100 text-cyan-800" },
  { value: "date", label: "Date", color: "bg-pink-100 text-pink-800" },
  { value: "array", label: "Array", color: "bg-yellow-100 text-yellow-800" },
  { value: "object", label: "Object", color: "bg-red-100 text-red-800" },
]

export function SchemaField({ field, onUpdate, onDelete, onAddChild, canDelete, level }: SchemaFieldProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [keyValue, setKeyValue] = useState(field.key)

  const handleKeyChange = useCallback(
    (newKey: string) => {
      setKeyValue(newKey)
      onUpdate(field.id, { key: newKey })
    },
    [field.id, onUpdate],
  )

  const handleTypeChange = useCallback(
    (newType: FieldType) => {
      const updates: Partial<SchemaFieldData> = { type: newType }
      if (newType === "object" && !field.children) {
        updates.children = []
      } else if (newType !== "object") {
        updates.children = undefined
      }
      onUpdate(field.id, updates)
    },
    [field.id, onUpdate],
  )

  const toggleRequired = useCallback(() => {
    onUpdate(field.id, { required: !field.required })
  }, [field.id, field.required, onUpdate])

  const handleAddChild = useCallback(() => {
    onAddChild(field.id)
  }, [field.id, onAddChild])

  const currentFieldType = fieldTypeOptions.find((option) => option.value === field.type)
  const canHaveChildren = field.type === "object"
  const hasChildren = field.children && field.children.length > 0

  return (
    <div className={`${level > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`}>
      <Card className="shadow-sm border-l-4 border-l-indigo-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            {canHaveChildren && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 h-8 w-8 hover:bg-gray-100"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}

            <div className="flex-1 min-w-0">
              <Input
                value={keyValue}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="Enter field name"
                className="font-medium"
              />
            </div>

            <Select value={field.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${option.color.split(" ")[0]}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge
              variant={field.required ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={toggleRequired}
            >
              {field.required ? "Required" : "Optional"}
            </Badge>

            {canHaveChildren && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddChild}
                className="gap-1 bg-green-50 hover:bg-green-100 border-green-200"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            )}

            {canDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(field.id)} className="px-2">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {currentFieldType && <Badge className={`${currentFieldType.color} text-xs`}>{currentFieldType.label}</Badge>}

          {canHaveChildren && isExpanded && hasChildren && (
            <div className="mt-4 space-y-3 border-t pt-4">
              {field.children!.map((child) => (
                <SchemaField
                  key={child.id}
                  field={child}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                  canDelete={true}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
