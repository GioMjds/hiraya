# **Next.js Frontend Folder Structure Guide**

This documentation serves as contributors guide in maintaining the design architecture of the frontend in Next.js using other tools (to see in **`package.json`**). After you read the **`CONTRIBUTING.md`** and before working on this project

## **Why This Folder Structure and it's Purpose?**

*This focuses in maintaining the Next.js frontend for their separation of concerns such as API client calls into backend, component-based features, layouting, UI components, global state managements, form validations, types, and even custom scripts to run for ease of testing, linting, and building it into production-based codebase.*

## **Basics of Next.js and it's folder structure**

```folder
project-root/
├──__tests__/                          -> Jest test files for Jest testing of components
├── app/
│   └── (auth)/                        -> Group route 
│       |── page-route/                -> name of the route
|       |   └── page.tsx               -> Server Component Page by default
│       |── layout.tsx                 -> Each group route has an layout
|       |── favicon.ico                -> Web Application's favicon file
|       |── globals.css                -> Global styling throughout the app
|       └── page.tsx                   -> By default, it is the homepage route
├── components/
│   ├── layout/                        -> Primary layouting components
│   ├── ui/                            -> shadcn UI components to use
│   └── icons/                         -> SVG-related custom icons
├── configs/                           -> Configuration files
|── features/                          -> Feature-based components, hooks and types
├── hooks/                             -> Custom Hooks to use
├── lib/                               -> Library files
├── public/
├── repositories/                      -> API client calls using fetch.ts
|   └── feature-name/                  -> Feature-specific API client calls
|       ├── api.ts                     -> API client calls
|       ├── types.ts                   -> Types related to the feature
|       └── index.ts                   -> Barrel exporting
├── scripts/                           -> Custom scripts
├── stores/                            -> Zustand global state management
├── types/                             -> Other types to set
├── utils/                             -> Utility files and functions
├── .env.example                       -> environment variables to put what's new to update
├── package.json
└── README.md
```

*Each subfolders has an `index.ts` for barrel exporting and `types.ts` for it's type usage if applicable.*

## **How Barrel Exporting Works?**

`index.ts`

```ts
export * from './feature';
```

`component/feature.ts`

```ts
export function Feature() {
    return
}
```

**So when importing, it must goes:**

`page.tsx`

```ts
import { Feature } from "@/component";
```

## **Layered Architecture Instructions**

### **`app/`**

- Next.js App Router, starts the routing

### **`components/`**

- Reusable components all throughout the frontend application

  #### **`layout/`**
  
  - Functional components for layouts to use in each group routes with per `layout.tsx`
  
  #### **`ui/`**
  
  - `shadcn` pre-built components to reuse
  
  #### **`icons/`**
  
  - SVG-related custom icons

### **`configs/`**

- Custom configuration files

### **`features/`**

- Feature-based components, hooks, and types

### **`lib/`**

- Library-specific custom usages

### **`public/`**

- Public assets even static metadata's such as `robots.txt`, `sitemap.xml`, `manifest.json`

### **`repositories/`**

- Fetch API calls using custom Factory Pattern, calling the API endpoints

### **`scripts/`**

- Custom scripts to run if needed

### **`stores/`**

- Zustand global state management files

### **`types/`**

- Global type declarations

### **`utils/`**

- Utility files and functions to consume globally

---

*This folder structure guide is subject to change as the project evolves. Contributors are encouraged to provide feedback and suggest improvements to enhance the maintainability and scalability of the codebase.*
