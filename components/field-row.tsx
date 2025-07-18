"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react"
import type { FieldData } from "./schema-builder"

interface FieldRowProps {
  field: FieldData
  index: number
  onUpdate: (field: FieldData) => void
  onDelete: () => void
  canDelete: boolean
  level?: number
}

export function FieldRow({ field, index, onUpdate, onDelete, canDelete, level = 0 }: FieldRowProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const updateFieldName = (name: string) => {
    onUpdate({ ...field, name })
  }

  const updateFieldType = (type: "String" | "Number" | "Nested") => {
    const updatedField = { ...field, type }
    if (type === "Nested" && !field.children) {
      updatedField.children = []
    } else if (type !== "Nested") {
      delete updatedField.children
    }
    onUpdate(updatedField)
  }

  const addNestedField = () => {
    if (field.type === "Nested") {
      const newChild: FieldData = {
        id: Date.now().toString(),
        name: `nested_field${(field.children?.length || 0) + 1}`,
        type: "String",
        children: [],
      }
      onUpdate({
        ...field,
        children: [...(field.children || []), newChild],
      })
    }
  }

  const updateNestedField = (childIndex: number, updatedChild: FieldData) => {
    if (field.children) {
      const newChildren = [...field.children]
      newChildren[childIndex] = updatedChild
      onUpdate({ ...field, children: newChildren })
    }
  }

  const deleteNestedField = (childIndex: number) => {
    if (field.children) {
      const newChildren = field.children.filter((_, i) => i !== childIndex)
      onUpdate({ ...field, children: newChildren })
    }
  }

  const indentStyle = {
    marginLeft: `${level * 24}px`,
  }

  return (
    <div style={indentStyle}>
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            {field.type === "Nested" && (
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-1 h-6 w-6">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}

            <div className="flex-1">
              <Input
                value={field.name}
                onChange={(e) => updateFieldName(e.target.value)}
                placeholder="Field name"
                className="font-medium"
              />
            </div>

            <Select value={field.type} onValueChange={updateFieldType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Number">Number</SelectItem>
                <SelectItem value="Nested">Nested</SelectItem>
              </SelectContent>
            </Select>

            {field.type === "Nested" && (
              <Button variant="outline" size="sm" onClick={addNestedField} className="px-3 bg-transparent">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}

            {canDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete} className="px-3">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {field.type === "Nested" && isExpanded && field.children && field.children.length > 0 && (
            <div className="space-y-3 mt-4 border-t pt-4">
              {field.children.map((child, childIndex) => (
                <FieldRow
                  key={child.id}
                  field={child}
                  index={childIndex}
                  onUpdate={(updatedChild) => updateNestedField(childIndex, updatedChild)}
                  onDelete={() => deleteNestedField(childIndex)}
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
