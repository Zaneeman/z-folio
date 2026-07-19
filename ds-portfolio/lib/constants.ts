export const SITE_TITLE = "PORTFOLIO";

export const PRIMARY_NAV = [
  { label: "Projects", href: "#projects" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
  { label: "News", href: "#news" },
] as const;

export const INDEX_CATEGORIES_LEFT = [
  "Instragram",
  "About Me",
  "Resume",
] as const;

export const INDEX_CATEGORIES_RIGHT = [
  "Blender/Octane",
  "Rhino/V-Ray",
  "Illustrator/Photoshop",
] as const;

export const PROJECTS = [
  {
    id: 1,
    slug: "01",
    title: "HOLON",
    year: 2025,
    category: "Residential",
    location: "Fayetteville, AR",
    description: "",
    thumbnail: "/images/projects/proj 1/6.jpg",
    images: [
      "/images/projects/proj 1/1.jpg",
      "/images/projects/proj 1/2.jpg",
      "/images/projects/proj 1/3.jpg",
      "/images/projects/proj 1/4.jpg",
      "/images/projects/proj 1/5.jpg",
      "/images/projects/proj 1/6.jpg",
    ],
  },
  {
    id: 2,
    slug: "02",
    title: "unDefined",
    year: 2025,
    category: "Residential",
    location: "Fayetteville, AR",
    description: "",
    thumbnail: "/images/projects/proj 2/thumb.jpg",
    images: [
      "/images/projects/proj 2/01.jpg",
      "/images/projects/proj 2/02.jpg",
      "/images/projects/proj 2/03.jpg",
      "/images/projects/proj 2/04.jpg",
      "/images/projects/proj 2/05.jpg",
      "/images/projects/proj 2/06.jpg",
      "/images/projects/proj 2/07.jpg",
    ],
  },
  {
    id: 3,
    slug: "03",
    title: "Floating Courtyards",
    year: 2025,
    category: "Library",
    location: "Seattle, WA",
    description: "",
    thumbnail: "/images/projects/proj 3/06.jpg",
    images: [
      "/images/projects/proj 3/01.jpg",
      "/images/projects/proj 3/02.jpg",
      "/images/projects/proj 3/03.jpg",
      "/images/projects/proj 3/04.jpg",
      "/images/projects/proj 3/05.jpg",
      "/images/projects/proj 3/06.jpg",
    ],
  },
  {
    id: 4,
    slug: "04",
    title: "River House",
    year: 2025,
    category: "Residential",
    location: "Fayetteville, AR",
    description: "test",
    thumbnail: "/images/projects/proj 1/6.jpg",
    images: [
      "/images/projects/proj 1/1.jpg",
    ],
  },
  {
    id: 5,
    slug: "05",
    title: "River House",
    year: 2025,
    category: "Residential",
    location: "Fayetteville, AR",
    description: "test",
    thumbnail: "/images/projects/proj 1/6.jpg",
    images: [
      "/images/projects/proj 1/1.jpg",
    ],
  },
  {
    id: 6,
    slug: "06",
    title: "River House",
    year: 2025,
    category: "Residential",
    location: "Fayetteville, AR",
    description: "test",
    thumbnail: "/images/projects/proj 1/6.jpg",
    images: [
      "/images/projects/proj 1/1.jpg",
    ],
  },
  {
    id: 7,
    slug: "07",
    title: "River House",
    year: 2025,
    category: "Residential",
    location: "Fayetteville, AR",
    description: "test",
    thumbnail: "/images/projects/proj 1/6.jpg",
    images: [
      "/images/projects/proj 1/1.jpg",
    ],
  },
  {
    id: 8,
    slug: "08",
    title: "River House",
    year: 2025,
    category: "Residential",
    location: "Fayetteville, AR",
    description: "test",
    thumbnail: "/images/projects/proj 1/6.jpg",
    images: [
      "/images/projects/proj 1/1.jpg",
    ],
  },
]

export type Project = (typeof PROJECTS)[number];

export const FEATURED_PROJECT = {
  title: "Zane Ayers - Designer",
  location: "Fay Jones School of Design",
  year: "2028",
  category: "Expected Graduation",
  description:
    "Architecture student pursuing a B.Arch and B.A. in Mathematics with a strong focus on computational design, parametric systems, and spatial logic. Experienced in Rhino and Grasshopper workflows, with the ability to translate conceptual ideas into precise, competition-level drawings and robust digital models. Known for strong communication and collaborative skills developed through tutoring and team-based work, and for adapting quickly to new software and design challenges. Motivated by the intersection of design thinking, mathematical structure, and architectural expression.",
  images: [
    "/images/projects/featured/1x1.001.jpg",
    "/images/projects/featured/1x1.002.jpg",
    "/images/projects/featured/2x1.001.jpg",
    "/images/projects/featured/2x1.003.jpg",
    "/images/projects/featured/2x2.001.jpg",
  ],
};
