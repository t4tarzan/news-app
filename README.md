# News App with OmniHuman-1 Integration

A modern news application built with Next.js that features integration with ByteDance's OmniHuman-1 AI model for generating human-like video presentations of news content.

## Features

- Modern news interface
- OmniHuman-1 video generation capability
  - Upload reference images
  - Add audio for lip-sync and gestures
  - Generate realistic human videos
- Built with modern tech stack:
  - Next.js 14+
  - TypeScript
  - Tailwind CSS
  - ESLint

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app directory containing all routes and components
  - `/omnihuman` - OmniHuman-1 interface implementation
- `/public` - Static assets
- `memories.md` - Development log and important information

## Development

This project follows these development practices:
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Git for version control
- Vercel for deployment

## Deployment

The app is configured for deployment on Vercel. Each push to the main branch triggers an automatic deployment.

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all TypeScript and ESLint checks pass
4. Create a pull request

## License

MIT
