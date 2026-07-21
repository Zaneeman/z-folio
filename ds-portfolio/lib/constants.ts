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
    thumbnail: "/images/projects/Thumbnail - 01.jpg",
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
    thumbnail: "/images/projects/Thumbnail - 02.jpg",
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
    thumbnail: "/images/projects/Thumbnail - 03.jpg",
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
    title: "Parasitic Reclaimation",
    year: 2026,
    category: "Adaptive Re-Use",
    location: "Fayetteville, AR",
    description: "",
    thumbnail: "/images/projects/Thumbnail - 04.jpg",
    images: [
      "/images/projects/proj 4/01.jpg",
      "/images/projects/proj 4/02.jpg",
      "/images/projects/proj 4/03.jpg",
      "/images/projects/proj 4/04.jpg",
      "/images/projects/proj 4/05.jpg",
      "/images/projects/proj 4/06.jpg",
    ],
  },
  {
    id: 5,
    slug: "05",
    title: "A Whispered Weaving",
    year: 2024,
    category: "Art Museum",
    location: "Fayetteville, AR",
    description: "",
    thumbnail: "/images/projects/Thumbnail - 05.jpg",
    images: [
      "/images/projects/proj 5/01.jpg",
      "/images/projects/proj 5/02.jpg",
      "/images/projects/proj 5/03.jpg",
      "/images/projects/proj 5/04.jpg",
      "/images/projects/proj 5/05.jpg",
      "/images/projects/proj 5/06.jpg",
      "/images/projects/proj 5/07.jpg",
    ],
  },
  {
    id: 6,
    slug: "06",
    title: "Modular Mass",
    year: 2024,
    category: "Artist Retreat",
    location: "",
    description: "",
    thumbnail: "/images/projects/Thumbnail - 06.jpg",
    images: [
      "/images/projects/proj 6/01.jpg",
      "/images/projects/proj 6/02.jpg",
      "/images/projects/proj 6/03.jpg",
      "/images/projects/proj 6/04.jpg",
    ],
  },
  {
    id: 7,
    slug: "07",
    title: "The Tower",
    year: 2024,
    category: "Tall Tower",
    location: "",
    description: "",
    thumbnail: "/images/projects/Thumbnail - 07.jpg",
    images: [
      "/images/projects/proj 7/01.jpg",
      "/images/projects/proj 7/02.jpg",
    ],
  },
]

export type Project = (typeof PROJECTS)[number];

export const FEATURED_PROJECT = {
  title: "Zane Ayers",
  location: "Fay Jones School of Design",
  year: "2028",
  category: "Expected Graduation",
  description:
    "Architecture student pursuing a B.Arch and B.A. in Mathematics with a strong focus on computational design, parametric systems, and spatial logic. Experienced in Rhino and Grasshopper workflows, with the ability to translate conceptual ideas into precise, competition-level drawings and robust digital models. Known for strong communication and collaborative skills developed through tutoring and team-based work, and for adapting quickly to new software and design challenges. Motivated by the intersection of design thinking, mathematical structure, and architectural expression.",
  images: [
    "/images/projects/featured/001.jpg",
    "/images/projects/featured/002.jpg",
    "/images/projects/featured/003.jpg",
    "/images/projects/featured/004.jpg",
    "/images/projects/featured/006.jpg",
  ],
};
