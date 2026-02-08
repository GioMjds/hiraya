# Code Standards

## File Length Rules

### Maximum Lines Per File
- **Components**: 200-300 lines maximum
- **Utilities/Helpers**: 100-150 lines maximum
- **Hooks**: 50-100 lines maximum
- **Configs**: 50-100 lines maximum
- **Stores**: 50-100 lines maximum
- **Repositories (api.ts)**: 100-150 lines maximum
- **Server Actions (actions.ts)**: 100-150 lines maximum
- **Types/Interfaces**: 50-100 lines maximum
- **Constants**: 50-100 lines maximum

### When to Split Files
Split a file when:
- It exceeds 300 lines
- It contains more than 3 distinct responsibilities
- It has more than 5 exported functions/components
- Testing becomes difficult due to complexity

## Project Organization

### Root Structure
```
project/
├── app/                     # Next.js App Router
├── components/              # Reusable components
|   ├── icons/               # SVG icon components
|   ├── layout/              # Layout components
|   |   features/            # Feature-specific components
|   |── shared/              # Shared components
|   └── ui/                  # Shadcn/ui components
├── configs/                 # Config components
|   hooks/                   # Custom React hooks
├── lib/                     # Utilities and configurations
├── public/                  # Static assets, metadata files
├── repositories/            # Backend API integration
├── stores/                  # Zustand global stores (client-side)
├── hooks/                   # Custom React hooks (client-side)
├── types/                   # Shared TypeScript types
├── utils/                   # Shared utilities and helper functions
└── proxy.ts                 # Route protection and auth
```

## Repository Layer Organization

### Repository Structure
Each feature domain has its own repository folder containing API integration and Server Actions.

```
repositories/
├── auth/
│   ├── api.ts              # Auth API endpoints
│   ├── actions.ts          # Auth Server Actions
│   └── types.ts            # Auth-specific types
├── posts/
│   ├── api.ts              # Posts API endpoints
│   ├── actions.ts          # Posts Server Actions
│   └── types.ts            # Posts-specific types
├── users/
│   ├── api.ts              # Users API endpoints
│   ├── actions.ts          # Users Server Actions
│   └── types.ts            # Users-specific types
└── comments/
    ├── api.ts              # Comments API endpoints
    ├── actions.ts          # Comments Server Actions
    └── types.ts            # Comments-specific types
```

### Repository File Patterns

#### api.ts Structure
Contains all HTTP calls to NestJS backend for a feature domain.

```typescript
// repositories/posts/api.ts
import { createEndpoint } from '@/lib/fetch'
import { Post, CreatePostData, UpdatePostData, PostsResponse } from './types'

const http = createEndpoint('/posts')

export const posts = {
  // GET endpoints
  getAll: (params?: { page?: number; limit?: number }) =>
    http.get<PostsResponse>('/', {
      params,
      next: { tags: ['posts'], revalidate: 60 }
    }),

  getById: (id: string) =>
    http.get<Post>(`/${id}`, {
      next: { tags: ['posts', `post-${id}`] }
    }),

  // POST endpoints
  create: (data: CreatePostData) =>
    http.post<Post, CreatePostData>('/', data, {
      auth: true
    }),

  // PUT endpoints
  update: (id: string, data: UpdatePostData) =>
    http.put<Post, UpdatePostData>(`/${id}`, data, {
      auth: true
    }),

  // DELETE endpoints
  delete: (id: string) =>
    http.delete<void>(`/${id}`, {
      auth: true
    })
}
```

**Best Practices:**
- Group methods by HTTP verb (GET, POST, PUT, PATCH, DELETE)
- Use createEndpoint for consistent base path
- Add proper TypeScript typing for requests and responses
- Use next.tags for cache invalidation
- Set auth: true for protected endpoints
- Use params for query parameters
- Keep API calls thin - no business logic here

#### actions.ts Structure
Contains Server Actions for form submissions and mutations.

```typescript
// repositories/posts/actions.ts
'use server'

import { posts } from './api'
import { revalidateTag, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreatePostData, UpdatePostData } from './types'

export async function createPost(formData: FormData) {
  const data: CreatePostData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    authorId: formData.get('authorId') as string
  }

  try {
    const post = await posts.create(data)
    revalidateTag('posts')
    redirect(`/posts/${post.id}`)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create post'
    }
  }
}

export async function updatePost(id: string, formData: FormData) {
  const data: UpdatePostData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string
  }

  try {
    await posts.update(id, data)
    revalidateTag('posts')
    revalidateTag(`post-${id}`)
    revalidatePath(`/posts/${id}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update post'
    }
  }
}

export async function deletePost(id: string) {
  try {
    await posts.delete(id)
    revalidateTag('posts')
    revalidateTag(`post-${id}`)
    revalidatePath('/posts')
    redirect('/posts')
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete post'
    }
  }
}
```

**Best Practices:**
- Always use 'use server' directive at top
- Extract data from FormData for form submissions
- Call api.ts functions to communicate with backend
- Use revalidateTag for cache invalidation
- Use revalidatePath for page revalidation
- Return success/error objects for client handling
- Use redirect for navigation after mutations
- Handle errors gracefully with try/catch
- Keep Server Actions focused on orchestration

#### types.ts Structure
Contains TypeScript types specific to the repository domain.

```typescript
// repositories/posts/types.ts

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export interface CreatePostData {
  title: string
  content: string
  authorId: string
}

export interface UpdatePostData {
  title?: string
  content?: string
}

export interface PostsResponse {
  data: Post[]
  total: number
  page: number
  limit: number
}

export interface PostFilters {
  authorId?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
}
```

**Best Practices:**
- Define interfaces for API responses
- Define interfaces for request payloads
- Export all types used in api.ts and actions.ts
- Use consistent naming conventions
- Keep types co-located with their feature domain

### Repository Organization Rules

**When to Create a New Repository:**
- Each major feature domain gets its own repository
- Repositories map to NestJS backend modules/controllers
- Create new repository when feature has 3+ related endpoints

**When to Split a Repository:**
- api.ts exceeds 150 lines
- actions.ts exceeds 150 lines
- Repository has more than 10 endpoints
- Feature can be logically divided into sub-domains

**Repository Naming:**
- Use plural nouns (posts, users, comments)
- Match NestJS backend module names when possible
- Use kebab-case for multi-word names (user-profiles)

## Component Organization

### Folder Structure
```
components/
├── ui/                      # Shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── layout/                  # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
├── features/                # Feature-specific components
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostForm.tsx
│   │   └── PostList.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
└── shared/                  # Shared components
    ├── LoadingSpinner.tsx
    └── ErrorBoundary.tsx
```

### Component File Structure
```tsx
// 1. Imports (grouped)
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// 2. Types (if small, otherwise separate file)
interface PostCardProps {
  title: string
  content: string
  author: string
}

// 3. Component
export function PostCard({ title, content, author }: PostCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{content}</p>
      <span>{author}</span>
    </article>
  )
}
```

### Naming Conventions
- **Components**: PascalCase (e.g., `PostCard.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `usePosts.ts`)
- **Server Actions**: camelCase (e.g., `createPost`, `deleteUser`)
- **API functions**: camelCase (e.g., `posts.getAll()`, `users.getById()`)
- **Constants**: SCREAMING_SNAKE_CASE for values
- **Types**: PascalCase with descriptive names
- **Files in app/**: kebab-case (e.g., `user-profile/page.tsx`)

## Next.js App Router Architecture

### Route Organization Patterns

#### Group Routes (Organization)
```
app/
├── (public)/              # Public pages
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── (protected)/           # Authenticated pages
│   ├── dashboard/
│   ├── profile/
│   └── layout.tsx
└── (admin)/              # Admin-only pages
    ├── users/
    ├── settings/
    └── layout.tsx
```

**Best Practices:**
- Use group routes to organize without affecting URL structure
- Each group can have its own layout and error boundaries
- Group by authentication level, user role, or feature domain
- Nest groups when you need multiple layers of organization

#### Parallel Routes (@slot)
```
app/
├── dashboard/
│   ├── @analytics/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── default.tsx
│   ├── @team/
│   │   ├── page.tsx
│   │   └── default.tsx
│   ├── layout.tsx        # Receives analytics and team as props
│   └── page.tsx
```

**Best Practices:**
- Use for independent sections that load separately
- Each slot can have its own loading and error states
- Always provide default.tsx for each slot to handle navigation edge cases
- Access slots as props in parent layout
- Keep slot components focused and independent
- Use for dashboards, split views, or multi-panel interfaces

#### Intercepting Routes (Modals)
```
app/
├── photos/
│   ├── [id]/
│   │   └── page.tsx      # Full page view
│   └── page.tsx          # Gallery
└── @modal/
    └── (.)photos/
        └── [id]/
            └── page.tsx  # Modal view
```

**Best Practices:**
- Use `(.)` for same level, `(..)` for one level up, `(..)(..)` for two levels up
- Combine with parallel routes for modal experiences
- Provide both modal and full page versions
- Handle browser back button properly
- Use router.back() to close modals
- Always test direct URL access to intercepted routes

#### Dynamic Routes
```
app/
├── blog/
│   ├── [slug]/          # Single dynamic segment
│   │   └── page.tsx
│   ├── [...tags]/       # Catch-all segment
│   │   └── page.tsx
│   └── [[...slug]]/     # Optional catch-all
│       └── page.tsx
```

**Best Practices:**
- Use [param] for single required parameters
- Use [...param] when you need multiple path segments
- Use [[...param]] when all segments are optional
- Type your params properly with TypeScript
- Validate params in page components
- Use generateStaticParams for static generation

### Special Files Strategy

#### default.tsx Usage
```
app/
├── dashboard/
│   ├── @sidebar/
│   │   ├── default.tsx   # Fallback when sidebar doesn't match route
│   │   └── settings/
│   │       └── page.tsx
│   └── layout.tsx
```

**When to Create:**
- Required for every parallel route slot
- Handles navigation to routes without matching slot content
- Prevents 404 errors during client-side navigation
- Returns null or minimal UI for inactive slots

**Best Practices:**
- Keep default.tsx minimal
- Return null if slot should be hidden
- Return placeholder UI if slot should always show something
- Document why default exists

#### loading.tsx Patterns
```
app/
├── dashboard/
│   ├── loading.tsx       # Dashboard-level loading
│   ├── @analytics/
│   │   └── loading.tsx   # Analytics slot loading
│   └── settings/
│       └── loading.tsx   # Settings page loading
```

**Best Practices:**
- Create loading.tsx at each meaningful boundary
- Use Suspense boundaries for granular loading states
- Match loading UI to final content layout
- Show skeletons rather than spinners when possible
- Keep loading states consistent across app

#### error.tsx Hierarchy
```
app/
├── error.tsx             # Root error boundary
├── (protected)/
│   ├── error.tsx         # Protected section errors
│   └── dashboard/
│       └── error.tsx     # Dashboard-specific errors
```

**Best Practices:**
- Create error boundaries at logical boundaries
- More specific error.tsx files override parent ones
- Always accept error and reset props
- Provide recovery actions
- Log errors appropriately
- Use global-error.tsx only for root layout errors

### Route Segment Config

#### Performance Optimization
```tsx
// app/blog/[slug]/page.tsx
export const dynamic = 'force-static'      # Force static generation
export const dynamicParams = true          # Allow dynamic params at runtime
export const revalidate = 3600             # Revalidate every hour
export const fetchCache = 'force-cache'    # Force caching
export const runtime = 'edge'              # Use edge runtime
export const preferredRegion = 'auto'      # Deploy to optimal region
```

**Configuration Options:**

**dynamic:**
- `'auto'` (default): Automatic based on usage
- `'force-dynamic'`: Always dynamic rendering
- `'force-static'`: Always static generation
- `'error'`: Force static, error if dynamic functions used

**revalidate:**
- `false`: Cache indefinitely
- `0`: Never cache
- `number`: Revalidate after N seconds
- Use with ISR for fresh content

**fetchCache:**
- `'auto'`: Default caching behavior
- `'default-cache'`: Cache unless explicitly opted out
- `'only-cache'`: Only use cache, error if cache miss
- `'force-cache'`: Force caching for all requests
- `'default-no-store'`: Don't cache unless opted in
- `'only-no-store'`: Never cache
- `'force-no-store'`: Force no caching

**runtime:**
- `'nodejs'` (default): Node.js runtime
- `'edge'`: Edge runtime for lower latency

**Best Practices:**
- Use `dynamic = 'force-static'` for truly static pages
- Set revalidate for time-sensitive content
- Use edge runtime for high-traffic, low-latency needs
- Configure at most specific route level possible
- Document why each config is set

### Advanced Routing Patterns

#### Modal with Parallel Routes
```
app/
├── layout.tsx
├── @modal/
│   ├── default.tsx       # Returns null
│   └── (.)items/
│       └── [id]/
│           └── page.tsx  # Modal view
└── items/
    ├── [id]/
    │   └── page.tsx      # Full page view
    └── page.tsx          # List view
```

#### Multi-Panel Dashboard
```
app/
├── dashboard/
│   ├── @main/
│   │   ├── default.tsx
│   │   └── page.tsx
│   ├── @sidebar/
│   │   ├── default.tsx
│   │   └── page.tsx
│   ├── @header/
│   │   ├── default.tsx
│   │   └── page.tsx
│   └── layout.tsx
```

#### Conditional Slot Rendering
```tsx
// app/dashboard/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  const showAnalytics = useAnalyticsPermission()
  
  return (
    <div>
      {children}
      {showAnalytics ? analytics : null}
      {team}
    </div>
  )
}
```

## Data Flow Architecture

### Server Component Data Fetching
```tsx
// app/posts/page.tsx (Server Component)
import { posts } from '@/repositories/posts/api'

export default async function PostsPage() {
  const allPosts = await posts.getAll()
  
  return <PostsList posts={allPosts} />
}
```

### Server Actions with Forms
```tsx
// app/posts/new/page.tsx (Server Component)
import { createPost } from '@/repositories/posts/actions'

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

### Client Component with Server Action
```tsx
// components/features/posts/PostForm.tsx
'use client'

import { useFormState } from 'react-dom'
import { createPost } from '@/repositories/posts/actions'

export function PostForm() {
  const [state, formAction] = useFormState(createPost, null)
  
  return (
    <form action={formAction}>
      <input name="title" required />
      {state?.error && <span>{state.error}</span>}
      <button type="submit">Create</button>
    </form>
  )
}
```

### Data Flow Rules
- **Server Components**: Fetch data directly using repository api.ts
- **Server Actions**: Handle mutations using repository actions.ts
- **Client Components**: Receive data as props or use Server Actions for mutations
- **No API Routes**: All backend communication goes through NestJS backend
- **Cache Tags**: Use consistent tagging strategy for revalidation

## Refactoring Guidelines

### Signs a Component Needs Refactoring
- More than 300 lines
- More than 10 useState hooks
- Deeply nested JSX (4+ levels)
- Multiple unrelated responsibilities
- Difficult to test

### How to Refactor Components
1. Extract constants to separate file
2. Extract types to separate file
3. Extract sub-components
4. Create custom hooks for complex state logic
5. Keep main component as orchestrator only

### Signs a Repository Needs Refactoring
- api.ts exceeds 150 lines
- actions.ts exceeds 150 lines
- More than 10 endpoints in single repository
- Types file exceeds 100 lines
- Related functionality scattered across files

### How to Refactor Repositories
1. Split into sub-domains (e.g., posts → posts/published, posts/drafts)
2. Extract common types to shared types directory
3. Group related endpoints into separate files
4. Create shared API utilities for common patterns
5. Document split reasoning in comments

### Signs a Route Structure Needs Refactoring
- Too many parallel routes (more than 3-4 slots)
- Deep nesting without clear purpose (more than 4 levels)
- Duplicate layouts across routes
- Complex default.tsx files
- Frequent 404s during navigation
- Difficult to reason about URL structure

### How to Refactor Routes
1. Group related routes together
2. Extract shared layouts
3. Simplify parallel route structure
4. Add proper default.tsx files
5. Document complex routing patterns
6. Use route groups for organization
7. Consider splitting into separate route segments

## Code Style

### No Comments Rule
- Code should be self-documenting
- Use descriptive variable and function names
- Extract complex logic into well-named functions
- Only add comments for non-obvious business logic

### Repository Code Style
```typescript
// GOOD: Clear, self-documenting
export const posts = {
  getAll: (params?: PostFilters) =>
    http.get<PostsResponse>('/', { params, next: { tags: ['posts'] } }),
    
  getPublished: () =>
    http.get<Post[]>('/published', { next: { tags: ['posts', 'published'] } })
}

// BAD: Unclear, needs comments
export const posts = {
  get: (p?: any) => http.get<any>('/', { params: p }), // gets all posts
  gp: () => http.get<any>('/pub') // gets published posts
}
```

### Server Actions Code Style
```typescript
// GOOD: Clear error handling and return values
export async function createPost(formData: FormData) {
  try {
    const data = extractPostData(formData)
    await posts.create(data)
    revalidateTag('posts')
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

// BAD: Silent failures, unclear
export async function createPost(fd: FormData) {
  const d = { title: fd.get('t'), content: fd.get('c') }
  await posts.create(d)
  revalidateTag('posts')
}
```