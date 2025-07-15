# Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Supabase. Features smooth animations, dynamic content management, and a beautiful gradient design.

## ✨ Features

- **Modern Design**: Beautiful gradient backgrounds with glassmorphism effects
- **Responsive Layout**: Optimized for all device sizes
- **Dynamic Content**: Content managed through Supabase database
- **Smooth Animations**: Powered by Framer Motion
- **Admin Panel**: Secure admin interface for content management
- **Performance Optimized**: Built with Next.js App Router
- **TypeScript**: Fully typed for better development experience

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://typescriptlang.org)
- **Database**: [Supabase](https://supabase.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://framer.com/motion)
- **Icons**: [Lucide React](https://lucide.dev)
- **Deployment**: [Vercel](https://vercel.com)

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin panel
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utility libraries
│   ├── supabaseClient.ts  # Supabase configuration
│   └── useAdminAuth.ts    # Admin authentication hook
├── public/                # Static assets
└── ...config files
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Create the following tables in your Supabase database:
   
   ```sql
   -- Profile table
   CREATE TABLE profile (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     bio TEXT,
     location TEXT,
     skills TEXT[],
     socials JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Projects table
   CREATE TABLE projects (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     stack TEXT[],
     github TEXT,
     live TEXT,
     image TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see your portfolio.

## 🎨 Customization

### Adding Content

1. **Profile Information**: Update your profile data in the Supabase `profile` table
2. **Projects**: Add your projects to the `projects` table
3. **Styling**: Modify colors and styles in [`app/globals.css`](app/globals.css)
4. **Components**: Edit the main page component in [`app/page.tsx`](app/page.tsx)

### Admin Panel

Access the admin panel at `/admin` to manage your content through a user-friendly interface.

## 📱 Pages

- **Home** (`/`): Landing page with hero section and featured projects
- **About** (`/about`): Detailed information about you
- **Projects** (`/projects`): Complete portfolio of your work
- **Contact** (`/contact`): Contact form and information
- **Admin** (`/admin`): Content management interface

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to a Git repository
2. Import your project on Vercel
3. Add your environment variables
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔧 Configuration Files

- [`next.config.ts`](next.config.ts): Next.js configuration
- [`tailwind.config.ts`](tailwind.config.ts): Tailwind CSS configuration  
- [`tsconfig.json`](tsconfig.json): TypeScript configuration
- [`postcss.config.mjs`](postcss.config.mjs): PostCSS configuration

## 📦 Key Dependencies

- **next**: React framework
- **react**: UI library
- **typescript**: Type safety
- **@supabase/supabase-js**: Database client
- **framer-motion**: Animations
- **tailwindcss**: Utility-first CSS
- **lucide-react**: Icon library

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you have any questions or need help with setup, feel free to open an issue or contact me.

---

Built with ❤️ using Next.js and Supabase