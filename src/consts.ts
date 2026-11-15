import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Conrado Julio",
  DESCRIPTION:
    "Portafolio y blog de Julio Conrado, Frontend Engineer.",
  AUTHOR: "Julio Conrado",
};

// Work Page
export const WORK: Page = {
  TITLE: "Trabajo",
  DESCRIPTION: "Lugares donde he trabajado.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Artículos sobre desarrollo web y lo que voy aprendiendo.",
}

// Phrases Page
export const PHRASES: Page = {
  TITLE: "Phrases",
  DESCRIPTION: "Frases que me acompañan.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Proyectos en los que he trabajado.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Busca artículos y proyectos por palabra clave.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Work", 
    HREF: "/work", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
  {
    TEXT: "Blog",
    HREF: "/blog",
  },
  {
    TEXT: "Phrases",
    HREF: "/phrases",
  }
]

// Socials
export const SOCIALS: Socials = [
  {
    NAME: "Email",
    ICON: "email",
    TEXT: "conradojuliosisnero@gmail.com",
    HREF: "mailto:conradojuliosisnero@gmail.com",
  },
  {
    NAME: "Github",
    ICON: "github",
    TEXT: "conradojuliosisnero",
    HREF: "https://github.com/conradojuliosisnero",
  },
  {
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "Julio Conrado",
    HREF: "https://www.linkedin.com/in/julio-conrado-358b09242/",
  },
];


// Formulario de contacto: Edge Function "contact" del proyecto Supabase "portafolio"
export const CONTACT_ENDPOINT = "https://qomtcxcrtqkjvwuofykg.supabase.co/functions/v1/contact"
