"use client"
import { useForm, useFieldArray } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldRow } from "./field-row"
import { JsonPreview } from "./json-preview"

export interface FieldData {
  id: string
  name: string
  type: "String" | "Number" | "Nested"
  children?: FieldData[]
}

interface FormData {
  fields: FieldData[]
}

export function SchemaBuilder() {
  const { control, watch, setValue } = useForm<FormData>({
    defaultValues: {
      fields: [
        {
          id: "1",
          name: "field1",
          type: "String",
          children: [],
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  })

  const watchedFields = watch("fields")

  const addField = () => {
    const newField: FieldData = {
      id: Date.now().toString(),
      name: `field${fields.length + 1}`,
      type: "String",
      children: [],
    }
    append(newField)
  }

  const updateField = (index: number, updatedField: FieldData) => {
    setValue(`fields.${index}`, updatedField)
  }

  const deleteField = (index: number) => {
    remove(index)
  }

  const generateJsonSchema = (fields: FieldData[]): any => {
    const schema: any = {}

    fields.forEach((field) => {
      if (field.type === "String") {
        schema[field.name] = "Sample String"
      } else if (field.type === "Number") {
        schema[field.name] = 0
      } else if (field.type === "Nested" && field.children) {
        schema[field.name] = generateJsonSchema(field.children)
      }
    })

    return schema
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Schema Builder</TabsTrigger>
          <TabsTrigger value="json">JSON Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Build Your Schema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <FieldRow
                  key={field.id}
                  field={field}
                  index={index}
                  onUpdate={(updatedField) => updateField(index, updatedField)}
                  onDelete={() => deleteField(index)}
                  canDelete={fields.length > 1}
                />
              ))}

              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={addField}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Field
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json">
          <JsonPreview schema={generateJsonSchema(watchedFields)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
