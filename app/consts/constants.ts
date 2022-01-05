import { NavItem } from "../types/NavItem";

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Services",
    href: "/services",
    // children: [
    //   {
    //     label: "Info Site",
    //     subLabel: "Static website",
    //     href: "/services",
    //   },
    //   {
    //     label: "E-Commerce",
    //     subLabel: "E-Commerce site",
    //     href: "/e-commerce",
    //   },
    //   {
    //     label: "Functional",
    //     subLabel: "custom functional site",
    //     href: "/custom-site",
    //   },
    // ],
  },
  {
    label: "Get A Quote",
    href: "/quote",
  },
  {
    label: "Demo",
    href: "/demo",
  },
];

/**
 * SEO constants
 */
export const SEO_TITLE = "Tutuly Tech";
export const SEO_DESCRIPTION =
  "Professional software services with full range of solutions helping you build and promote your website";
export const SEO_KEYWORDS =
  "wordpress, shopify, build website, web templates, web design";
export const SEO_OG_IMAGE = "https://chakra-templates.dev/favicon.png";
export const SEO_TWITTER_IMAGE = "https://chakra-templates.dev/favicon.png";
export const PRODUCTION_URL = "https://tutulytech.com";
