import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Conrado Julio",
  DESCRIPTION:
    "Welcome my web portfolio, a portfolio and blog for designers and developers.",
  AUTHOR: "Mark Horn",
};

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}

// Blog Page
// export const BLOG: Page = {
//   TITLE: "Blog",
//   DESCRIPTION: "Writing on topics I am passionate about.",
// }

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
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

