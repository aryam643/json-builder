"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JsonPreviewProps {
  schema: any
}

export function JsonPreview({ schema }: JsonPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>JSON Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
          <pre>{JSON.stringify(schema, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  )
}
