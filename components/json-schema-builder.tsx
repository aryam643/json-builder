"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SchemaField } from "./schema-field"
import { JsonDisplay } from "./json-display"

export type FieldType = "text" | "number" | "boolean" | "array" | "object" | "email" | "url" | "date"

export interface SchemaFieldData {
  id: string
  key: string
  type: FieldType
  required: boolean
  children?: SchemaFieldData[]
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export function JsonSchemaBuilder() {
  const [fields, setFields] = useState<SchemaFieldData[]>([
    {
      id: generateId(),
      key: "name",
      type: "text",
      required: true,
    },
  ])

  const addRootField = useCallback(() => {
    const newField: SchemaFieldData = {
      id: generateId(),
      key: `field_${fields.length + 1}`,
      type: "text",
      required: false,
    }
    setFields((prev) => [...prev, newField])
  }, [fields.length])

  const updateField = useCallback((fieldId: string, updates: Partial<SchemaFieldData>) => {
    const updateFieldRecursive = (fieldsList: SchemaFieldData[]): SchemaFieldData[] => {
      return fieldsList.map((field) => {
        if (field.id === fieldId) {
          return { ...field, ...updates }
        }
        if (field.children) {
          return { ...field, children: updateFieldRecursive(field.children) }
        }
        return field
      })
    }
    setFields((prev) => updateFieldRecursive(prev))
  }, [])

  const deleteField = useCallback((fieldId: string) => {
    const deleteFieldRecursive = (fieldsList: SchemaFieldData[]): SchemaFieldData[] => {
      return fieldsList.filter((field) => {
        if (field.id === fieldId) return false
        if (field.children) {
          field.children = deleteFieldRecursive(field.children)
        }
        return true
      })
    }
    setFields((prev) => deleteFieldRecursive(prev))
  }, [])

  const addChildField = useCallback((parentId: string) => {
    const newChild: SchemaFieldData = {
      id: generateId(),
      key: "nested_field",
      type: "text",
      required: false,
    }

    const addChildRecursive = (fieldsList: SchemaFieldData[]): SchemaFieldData[] => {
      return fieldsList.map((field) => {
        if (field.id === parentId) {
          return {
            ...field,
            children: [...(field.children || []), newChild],
          }
        }
        if (field.children) {
          return { ...field, children: addChildRecursive(field.children) }
        }
        return field
      })
    }
    setFields((prev) => addChildRecursive(prev))
  }, [])

  const jsonOutput = useMemo(() => {
    const generateJson = (fieldsList: SchemaFieldData[]): Record<string, any> => {
      const result: Record<string, any> = {}

      fieldsList.forEach((field) => {
        switch (field.type) {
          case "text":
          case "email":
          case "url":
            result[field.key] = "sample text"
            break
          case "number":
            result[field.key] = 42
            break
          case "boolean":
            result[field.key] = true
            break
          case "date":
            result[field.key] = "2024-01-01"
            break
          case "array":
            result[field.key] = ["item1", "item2"]
            break
          case "object":
            result[field.key] = field.children ? generateJson(field.children) : {}
            break
          default:
            result[field.key] = null
        }
      })

      return result
    }

    return generateJson(fields)
  }, [fields])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Schema Builder</CardTitle>
            <Button onClick={addRootField} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Field
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
          {fields.map((field, index) => (
            <SchemaField
              key={field.id}
              field={field}
              onUpdate={updateField}
              onDelete={deleteField}
              onAddChild={addChildField}
              canDelete={fields.length > 1}
              level={0}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-xl">JSON Output</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonDisplay data={jsonOutput} />
        </CardContent>
      </Card>
    </div>
  )
}
