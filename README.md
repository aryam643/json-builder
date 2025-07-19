# JSON Schema Builder

A dynamic JSON Schema Builder built with Next.js, React, and ShadCN UI. Create complex JSON schemas with nested structures, multiple field types, and real-time preview.

## Features

- **Dynamic Field Management**: Add, edit, and delete fields on the fly
- **Multiple Field Types**: Support for Text, Number, Boolean, Email, URL, Date, Array, and Object
- **Nested Structures**: Create complex nested objects with unlimited depth
- **Real-time Preview**: Live JSON output with copy functionality

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/aryam643/json-schema-builder.git
cd json-schema-builder
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Add Fields**: Click "Add Field" to create new schema fields
2. **Edit Field Names**: Click on any field name to edit it
3. **Choose Field Types**: Select from 8 different field types
4. **Create Nested Objects**: Use "Object" type and click "Add" to create nested fields
5. **Toggle Required**: Click the Required/Optional badge to toggle field requirements
6. **Copy JSON**: Use the copy button to copy the generated JSON schema

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy with one click

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [ShadCN UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons

## License

This project is licensed under the MIT License.
