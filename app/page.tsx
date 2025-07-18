"use client"

import { JsonSchemaBuilder } from "@/components/json-schema-builder"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dynamic JSON Schema Builder</h1>
          <p className="text-gray-600">Create complex JSON schemas with nested structures</p>
        </div>
        <JsonSchemaBuilder />
      </div>
    </div>
  )
}
