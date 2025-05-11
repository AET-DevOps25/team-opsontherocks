# Client Application

A Vite + React + TypeScript + Tailwind CSS project using \[shadcn/ui] components and animations via `tailwindcss-animate`.

---

## Tech Stack

* **Vite**: Fast development server and build tool.
* **React (v19)**: Component-driven UI library.
* **TypeScript**: Typed JavaScript for safety and clarity.
* **Tailwind CSS**: Utility-first CSS framework.
* **shadcn/ui**: Accessible, fully-typed React components styled with Tailwind.
* **tailwindcss-animate**: Plugin providing ready-to-use animation utilities.

---

## Adding shadcn/ui Components

Since the `components/ui` folder is already initialized when you cloned this repo, you can skip any setup steps and jump straight to adding or customizing components:

1. **Add a new component** (e.g., a button):

   ```bash
   npx shadcn@latest add button
   ```

   Replace `toast` with any supported component name.

2. **Import and use** in your code:

   ```tsx
   import { Button } from '@/components/ui/button'

   function Example() {
     return <Button>Click me</Button>
   }
   ```

3. **Customize** variants or design tokens by editing files in `components/ui` or extending your Tailwind config.

---

## Running Locally (Without Docker)

1. **Install dependencies**:

   ```bash
   npm install
   ```

   > **Note:** You can also run `npm ci` in CI/CD environments for faster, deterministic installs from `package-lock.json`.

2. **Start the dev server**:

   ```bash
   npm run dev
   ```

3. **Open** your browser at `http://localhost:5173` (default Vite port).

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview** the production build:

   ```bash
   npm run preview
   ```

---

## Running with Docker

1. **Build the image**:

   ```bash
   docker build -t client .
   ```
2. **Run the container**:

   ```bash
   docker run --rm -p 8080:8080 client
   ```
3. **Open** your browser at `http://localhost:8080`.


