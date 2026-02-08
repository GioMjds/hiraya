# AI Coding Rules and Standards

## Code Quality Standards

### No Comments Policy
- Do not write inline comments in code
- Do not write block comments
- Do not write JSDoc comments unless explicitly requested
- Code should be self-documenting through clear naming
- Use descriptive variable and function names instead of comments

### Clean Code Requirements
- Write code without placeholder data or mock content
- Minimal comments only for complex logic that cannot be simplified
- Keep functions and methods short and focused
- Remove all console.log statements before committing
- Remove all debugging code before committing
- Do not leave TODO comments in production code
- Do not leave FIXME comments in production code

## Security Rules

### Input Validation
- Validate all user inputs on both client and server
- Sanitize data before rendering to prevent XSS
- Use parameterized queries for database operations
- Never interpolate user input directly into queries

### Authentication and Authorization
- Never store passwords in plain text
- Never log sensitive information
- Never expose API keys in client-side code
- Always verify user permissions before actions
- Use secure session management with httpOnly cookies
- Store tokens in cookies, not localStorage or sessionStorage

### Data Protection
- Never commit .env files
- Never commit credentials or secrets
- Never expose internal error messages to users
- Sanitize error messages in production

## Code Structure

### File Organization
- One component per file
- Group related files in folders
- Use index files for barrel exports
- Keep files under 300 lines when possible

### Naming Conventions
- PascalCase for components and types
- camelCase for variables and functions
- SCREAMING_SNAKE_CASE for constants
- kebab-case for file names in app directory
- PascalCase for component file names

### TypeScript Requirements
- Always define types for function parameters
- Always define return types for functions
- Never use any type unless absolutely necessary
- Use interfaces for object shapes
- Use type for unions and primitives

## React and Next.js Patterns

### Component Guidelines
- Use Server Components by default for better SEO and performance
- Add 'use client' directive only when necessary:
  - Using React hooks (useState, useEffect, etc.)
  - Using browser APIs (window, document, localStorage)
  - Using event handlers (onClick, onChange, etc.)
  - Using Context providers that need interactivity
- Use functional components only
- Prefer named exports
- Extract reusable logic into custom hooks (client-side only)
- Keep components focused on single responsibility
- Use composition over inheritance
- Use dynamic imports with next/dynamic for heavy client components

### Server vs Client Component Decision Tree
**Use Server Components (default) when:**
- Fetching data from APIs or databases
- Accessing backend resources directly
- Keeping sensitive information on server (API keys, tokens)
- Reducing client-side JavaScript bundle
- Rendering static content
- SEO is important

**Use Client Components when:**
- Need interactivity and event listeners
- Need React hooks (useState, useEffect, useContext)
- Need browser-only APIs
- Need custom hooks
- Building interactive forms with real-time validation
- Using third-party libraries that depend on browser APIs

### State Management
- Use Zustand for global client state only when necessary
- Use React Context for client-side shared state
- Use URL search params for shareable state
- Prefer server state over client state when possible
- Use useState for local component state (client components only)
- Avoid prop drilling beyond 2 levels

### Zustand Store Guidelines (Client-Side Only)
- Create stores in stores directory with descriptive names
- Separate interface for States and Actions
- Use shallow equality for selectors when needed
- Keep stores focused on single domain
- Mark store files with 'use client' directive
- Use only for truly global client state that can't be server state

### Data Fetching Architecture

#### Server Components (Primary Pattern)
- Fetch data directly in Server Components using native fetch
- Use async/await in Server Components
- Leverage Next.js caching and revalidation
- Pass data as props to Client Components

```tsx
// app/posts/page.tsx (Server Component)
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return <PostsList posts={posts} />
}
```

#### API Layer with Native Fetch
- Organize API functions in repositories directory
- Create reusable endpoint creators with createEndpoint
- Use fetch with proper typing for all HTTP methods
- Implement auth headers using cookies
- Type all API responses with TypeScript interfaces

```tsx
// repositories/posts/api.ts
import { createEndpoint } from '@/lib/fetch'

const http = createEndpoint('/posts')

export const posts = {
  getAll: () => http.get<Post[]>('/', { 
    next: { tags: ['posts'] } 
  }),
  getById: (id: string) => http.get<Post>(`/${id}`, {
    next: { tags: ['posts', `post-${id}`] }
  }),
  create: (data: CreatePostData) => http.post<Post, CreatePostData>('/', data, {
    auth: true
  }),
  update: (id: string, data: UpdatePostData) => http.put<Post, UpdatePostData>(`/${id}`, data, {
    auth: true
  }),
  delete: (id: string) => http.delete<void>(`/${id}`, {
    auth: true
  })
}
```

#### Server Actions (Forms and Mutations)
- Create Server Actions in `actions.ts` files
- Mark functions with 'use server' directive
- Use for form submissions and data mutations
- Use revalidateTag or revalidatePath after mutations
- Pass Server Actions to form action prop or useFormState

```tsx
// repositories/posts/actions.ts
'use server'

import { posts } from './api'
import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string
  }
  
  await posts.create(data)
  revalidateTag('posts')
}

export async function deletePost(id: string) {
  await posts.delete(id)
  revalidateTag('posts')
  revalidateTag(`post-${id}`)
}
```

#### Client-Side Data Fetching (When Necessary)
- Use only for real-time data or user-triggered fetches
- Use useEffect or event handlers in Client Components
- Consider using SWR or React Query for client-side caching if needed
- Prefer Server Components and Server Actions when possible

```tsx
// Only when server-side fetching is not suitable
'use client'

import { useEffect, useState } from 'react'

export function RealTimeStats() {
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetch('/api/stats').then(r => r.json())
      setStats(data)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return <div>{/* Render stats */}</div>
}
```

### Forms and Mutations

#### Server Actions with Progressive Enhancement
- Use Next.js Form component for progressive enhancement
- Server Actions work without JavaScript enabled
- Handle form submissions server-side for better UX

```tsx
// app/posts/new/page.tsx (Server Component)
import { createPost } from '@/repositories/posts/actions'
import { Form } from 'next/form'

export default function NewPostPage() {
  return (
    <Form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </Form>
  )
}
```

#### Client-Side Form Validation
- Use 'use client' for real-time validation
- Combine with Server Actions for submissions
- Use useFormState for pending states and errors

```tsx
'use client'

import { useFormState } from 'react-dom'
import { createPost } from '@/repositories/posts/actions'
import { Form } from "next/form"

export function PostForm() {
  const [state, formAction] = useFormState(createPost, null)
  
  return (
    <Form action={formAction}>
      <input name="title" required />
      {state?.errors?.title && <span>{state.errors.title}</span>}
      <button type="submit" disabled={state?.pending}>
        {state?.pending ? 'Creating...' : 'Create Post'}
      </button>
    </Form>
  )
}
```

### Framer Motion / Motion
- Import from 'motion/react' for animations
- Put all animation variant components in `lib/motion.tsx`
- Use motion.div, motion.span, etc. for animated elements
- Use AnimatePresence for exit animations
- Define reusable animation variants
- Use viewport: { once: true } for scroll animations
- Wrap each Motion variant components in a function
- Mark motion components with 'use client' directive

### Performance

#### Server Component Optimization
- Fetch data in parallel using Promise.all
- Use streaming with Suspense boundaries
- Implement proper loading.tsx files
- Cache API responses with appropriate strategies

#### Client Component Optimization
- Memoize expensive calculations with useMemo
- Memoize callbacks with useCallback when passing to children
- Use React.memo for pure components
- Lazy load routes and heavy components
- Use next/dynamic for code splitting

### Signs that needs to memoize
- Component re-renders often but props are stable
- Expensive render logic or deep component trees
- Passing functions or objects as props
- Component consumes global state but only needs a slice
- Child components in large lists
- Layouts and shared shells re-render often
- Profiling confirms wasted renders

### Do NOT memoize when
- Component is cheap to render
- Props change frequently
- Component render only occasionally
- Memoization add cognitive complexity without significant benefit

## Next.js App Router Patterns

### Server and Client Components Strategy
- Default to Server Components for all new components
- Only add 'use client' when truly necessary
- Keep Client Components as leaf nodes when possible
- Pass Server Components as children to Client Components
- Fetch data in Server Components, pass to Client Components as props

### Server Component Patterns
```tsx
// Server Component - fetches data directly
export default async function UserProfile({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  
  return (
    <div>
      <h1>{user.name}</h1>
      <ClientInteractiveButton userId={user.id} />
    </div>
  )
}
```

### Passing Server Components to Client Components
```tsx
// Client Component that accepts Server Component children
'use client'

export function Tabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(0)
  return <div>{children}</div>
}

// Server Component uses Client Component
export default async function Page() {
  const data = await fetchData()
  
  return (
    <Tabs>
      <ServerDataDisplay data={data} />
    </Tabs>
  )
}
```

### Caching and Revalidation
- Use fetch with next.revalidate for time-based revalidation
- Use revalidateTag for on-demand revalidation
- Use revalidatePath for path-based revalidation
- Tag cache entries for granular control

```tsx
// Time-based revalidation
const res = await fetch('/api/posts', {
  next: { revalidate: 3600 } // Revalidate every hour
})

// Tag-based revalidation
const res = await fetch('/api/posts', {
  next: { tags: ['posts'] }
})

// In Server Action
revalidateTag('posts') // Revalidate all 'posts' tagged fetches
revalidatePath('/posts') // Revalidate /posts page
```

### File-Based Routing

#### Group Routes (Organization)
**Use When:**
- Organizing routes without affecting URLs
- Applying different layouts to route sections
- Separating public and protected routes
- Organizing by feature domain or user role

**Implementation:**
```
app/
├── (marketing)/
│   ├── layout.tsx        # Marketing layout
│   ├── page.tsx          # Homepage
│   └── about/
├── (shop)/
│   ├── layout.tsx        # Shop layout
│   ├── products/
│   └── cart/
└── (account)/
    ├── layout.tsx        # Account layout
    ├── profile/
    └── orders/
```

**Rules:**
- Parentheses make folder invisible in URL structure
- Each group can have unique layout, loading, and error files
- Groups can be nested for complex organization
- Use clear, descriptive names that indicate purpose

#### Parallel Routes (@slot)
**Use When:**
- Rendering multiple page sections independently
- Different loading states for different sections
- Conditional rendering of UI sections
- Building complex dashboards or split views
- Creating modal experiences

**Implementation:**
```
app/
├── dashboard/
│   ├── @analytics/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── default.tsx   # REQUIRED
│   ├── @activity/
│   │   ├── page.tsx
│   │   └── default.tsx   # REQUIRED
│   ├── layout.tsx
│   └── page.tsx
```

**Layout Implementation:**
```tsx
export default function DashboardLayout({
  children,
  analytics,
  activity,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  activity: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <main>{children}</main>
      <aside>{analytics}</aside>
      <section>{activity}</section>
    </div>
  )
}
```

**Rules:**
- Slot names start with @ symbol
- Each slot MUST have default.tsx
- Slots receive independent loading and error states
- Access slots as props in parent layout
- Slots can have their own nested routes
- Maximum 3-4 slots per layout for maintainability
- Each slot operates independently during navigation

#### default.tsx (Critical for Parallel Routes)
**Purpose:**
- Prevents 404 during client-side navigation
- Provides fallback when slot doesn't match current route
- Handles soft navigation edge cases

**When to Create:**
- REQUIRED for every parallel route slot
- Optional for regular routes

**Implementation Patterns:**
```tsx
// Pattern 1: Return null (hide slot)
export default function Default() {
  return null
}

// Pattern 2: Return placeholder
export default function Default() {
  return <div>Select an item to view details</div>
}

// Pattern 3: Return loading state
export default function Default() {
  return <Skeleton />
}
```

**Rules:**
- Must be at same level as page.tsx in slot
- Executes during soft navigation only
- Does not affect hard refreshes or direct URL access
- Keep implementation simple
- Document why default exists

#### Intercepting Routes (Modals and Overlays)
**Use When:**
- Showing content in modal while preserving background
- Quick views without losing context
- Progressive enhancement patterns
- Login/signup modals
- Image galleries with lightbox

**Implementation:**
```
app/
├── feed/
│   └── page.tsx          # Feed page
├── @modal/
│   ├── default.tsx       # Returns null
│   └── (.)photo/
│       └── [id]/
│           └── page.tsx  # Modal view
└── photo/
    └── [id]/
        └── page.tsx      # Full page view
```

**Intercepting Patterns:**
- `(.)` - Same level
- `(..)` - One level up
- `(..)(..)` - Two levels up
- `(...)` - Root app directory

**Modal Implementation:**
```tsx
'use client'

export default function PhotoModal({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  return (
    <Modal onClose={() => router.back()}>
      <PhotoDetail id={params.id} />
    </Modal>
  )
}
```

**Rules:**
- Always provide both modal and full page versions
- Use router.back() to close modals
- Test direct URL access
- Handle browser navigation correctly
- Combine with parallel routes for best results
- Modal route should mirror full page route structure

#### Dynamic Routes
**Single Parameter [param]:**
```
app/
├── blog/
│   └── [slug]/
│       └── page.tsx
```

**Catch-All [...param]:**
```
app/
├── docs/
│   └── [...slug]/
│       └── page.tsx
```
Matches: `/docs/a`, `/docs/a/b`, `/docs/a/b/c`

**Optional Catch-All [[...param]]:**
```
app/
├── shop/
│   └── [[...categories]]/
│       └── page.tsx
```
Matches: `/shop`, `/shop/clothing`, `/shop/clothing/shirts`

**Rules:**
- Use [param] for single required segments
- Use [...param] for multiple required segments
- Use [[...param]] when root path should also match
- Always validate params in component
- Type params with TypeScript
- Use generateStaticParams for static generation

**Typing Params:**
```tsx
interface PageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page({ params, searchParams }: PageProps) {
  // Implementation
}
```

#### Route Segment Config
**Performance Options:**
```tsx
export const dynamic = 'auto' | 'force-dynamic' | 'force-static' | 'error'
export const dynamicParams = true | false
export const revalidate = false | 0 | number
export const fetchCache = 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'default-no-store' | 'only-no-store' | 'force-no-store'
export const runtime = 'nodejs' | 'edge'
export const preferredRegion = 'auto' | 'home' | string | string[]
export const maxDuration = number
```

**Common Patterns:**
```tsx
// Static page with hourly revalidation
export const dynamic = 'force-static'
export const revalidate = 3600

// Dynamic API route on edge
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

// Cached data with fallback
export const fetchCache = 'force-cache'
export const revalidate = 60

// Error on dynamic usage
export const dynamic = 'error'
```

**Rules:**
- Set at page or layout level
- More specific configs override parent configs
- Use force-static for truly static content
- Use edge runtime for global, low-latency needs
- Set revalidate for time-sensitive content
- Document why each config is chosen

### Middleware and Routing Protection
- Use `proxy.ts` at root for route protection
- Implement role-based access control in proxy
- Handle authentication state with cookies
- Redirect unauthenticated users appropriately
- Use matcher config to specify protected routes

```tsx
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
}
```

## Advanced Next.js Routing Patterns

### Modal with Background Context
```
app/
├── layout.tsx
├── @modal/
│   ├── default.tsx
│   └── (.)items/
│       └── [id]/
│           └── page.tsx
└── items/
    ├── page.tsx
    └── [id]/
        └── page.tsx
```

**Implementation:**
```tsx
// app/layout.tsx
export default function RootLayout({ children, modal }) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}

// app/@modal/(.)items/[id]/page.tsx
'use client'
export default function ItemModal({ params }) {
  const router = useRouter()
  return (
    <Modal onClose={() => router.back()}>
      <ItemDetails id={params.id} />
    </Modal>
  )
}
```

### Multi-Panel Dashboards
```
app/
├── dashboard/
│   ├── @header/
│   │   ├── default.tsx
│   │   └── page.tsx
│   ├── @sidebar/
│   │   ├── default.tsx
│   │   └── [...path]/
│   │       └── page.tsx
│   ├── @main/
│   │   ├── default.tsx
│   │   └── [...path]/
│   │       └── page.tsx
│   └── layout.tsx
```

### Conditional Slot Rendering
```tsx
export default function Layout({ header, sidebar, main, children }) {
  const { hasAccess } = useAuth()
  
  return (
    <div>
      {header}
      <div className="flex">
        {hasAccess && sidebar}
        <main>{main || children}</main>
      </div>
    </div>
  )
}
```

### Route-Specific Error Handling
```
app/
├── global-error.tsx          # Root layout errors only
├── error.tsx                 # App-level errors
├── dashboard/
│   ├── error.tsx            # Dashboard errors
│   └── settings/
│       └── error.tsx        # Settings errors
```

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Progressive Loading States
```
app/
├── dashboard/
│   ├── loading.tsx          # Whole dashboard loading
│   ├── @analytics/
│   │   └── loading.tsx      # Analytics slot loading
│   └── @team/
│       └── loading.tsx      # Team slot loading
```

### Static Generation with Dynamic Routes
```tsx
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export const dynamic = 'force-static'
export const revalidate = 3600

export default async function Page({ params }) {
  const post = await getPost(params.slug)
  return <Article post={post} />
}
```

## Styling Rules

### Tailwind CSS
- Use Tailwind utility classes
- Extract repeated patterns into components
- Use CSS variables for theme values
- Maintain consistent spacing scale
- Mobile-first responsive design

### Color and Theme
- Use defined color palette only
- Maintain consistent opacity values
- Use semantic color naming
- Support dark mode patterns

## API and Data

### Backend Architecture
- Next.js frontend communicates with separate NestJS backend
- Do NOT create API routes (route handlers) in Next.js app/api directory
- All API logic lives in the NestJS backend
- Next.js acts as the presentation layer only

### Repository Layer Pattern
- Create repository modules in repositories directory
- Each feature has its own repository folder
- Repository contains api.ts and actions.ts files
- api.ts contains all endpoint calls using createEndpoint
- actions.ts contains Server Actions for form submissions

```
repositories/
├── auth/
│   ├── api.ts           # Auth API endpoints
│   ├── actions.ts       # Auth Server Actions
│   └── types.ts         # Auth type definitions
├── posts/
│   ├── api.ts           # Posts API endpoints
│   ├── actions.ts       # Posts Server Actions
│   └── types.ts         # Posts type definitions
└── users/
    ├── api.ts           # Users API endpoints
    ├── actions.ts       # Users Server Actions
    └── types.ts         # Users type definitions
```

### API Layer (api.ts)
- Use createEndpoint to create typed HTTP client for each feature
- Define all CRUD operations with proper typing
- Use next cache options for appropriate caching strategy
- Set auth: true for authenticated endpoints

```tsx
// repositories/posts/api.ts
import { createEndpoint } from '@/lib/fetch'
import { Post, CreatePostData, UpdatePostData } from './types'

const http = createEndpoint('/posts')

export const posts = {
  getAll: () => http.get<Post[]>('/', { 
    next: { tags: ['posts'], revalidate: 60 } 
  }),
  
  getById: (id: string) => http.get<Post>(`/${id}`, {
    next: { tags: ['posts', `post-${id}`] }
  }),
  
  create: (data: CreatePostData) => http.post<Post, CreatePostData>('/', data, {
    auth: true
  }),
  
  update: (id: string, data: UpdatePostData) => 
    http.put<Post, UpdatePostData>(`/${id}`, data, {
      auth: true
    }),
  
  delete: (id: string) => http.delete<void>(`/${id}`, {
    auth: true
  })
}
```

### Server Actions Layer (actions.ts)
- Mark with 'use server' directive
- Use for form submissions and mutations
- Call api.ts functions to communicate with backend
- Use revalidateTag or revalidatePath after mutations
- Handle errors appropriately

```tsx
// repositories/posts/actions.ts
'use server'

import { posts } from './api'
import { revalidateTag } from 'next/cache'
import { CreatePostData } from './types'

export async function createPost(data: CreatePostData) {
  try {
    await posts.create(data)
    revalidateTag('posts')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create post' }
  }
}

export async function deletePost(id: string) {
  try {
    await posts.delete(id)
    revalidateTag('posts')
    revalidateTag(`post-${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete post' }
  }
}
```

### Data Fetching Best Practices
- Prefer Server Components for data fetching
- Use fetch with proper caching strategies
- Handle loading states with loading.tsx
- Handle error states with error.tsx
- Handle empty states in components
- Use Server Actions for mutations

## Git and Version Control

### Commit Guidelines
- Write clear commit messages
- One logical change per commit
- Reference issue numbers when applicable
- Do not commit generated files
- Do not commit node_modules

### Branch Strategy
- Create feature branches for new work
- Keep branches focused and short-lived
- Delete merged branches

## Testing Requirements

### Test Coverage
- Write tests for business logic
- Write tests for API endpoints
- Write tests for utility functions
- Test error scenarios
- Test Server Actions
- Test Server Components

### Test Quality
- Use descriptive test names
- One assertion per test when possible
- Mock external dependencies
- Clean up after tests

## Accessibility

### WCAG Compliance
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation
- Maintain color contrast ratios
- Support screen readers

### Interactive Elements
- Buttons for actions
- Links for navigation
- Proper focus management
- Clear focus indicators

## Error Handling

### User-Facing Errors
- Display friendly error messages
- Provide recovery actions when possible
- Log errors for debugging
- Never expose stack traces
- Use error.tsx boundaries for graceful degradation

### Development Errors
- Use TypeScript strict mode
- Handle null and undefined cases
- Validate external data shapes
- Use error boundaries

## Dependency Management

### Package Selection
- Prefer well-maintained packages
- Check bundle size impact
- Review security advisories
- Pin major versions
- Avoid packages that only work client-side when server alternatives exist

### Updates
- Regularly update dependencies
- Test after updates
- Review changelogs for breaking changes