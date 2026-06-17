import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans, IBM_Plex_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

// TODO: reemplazar con el Pixel ID real de la cuenta de Meta Ads
const META_PIXEL_ID = "PIXEL_ID_AQUI"

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
})

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

const ibmMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Diseños JK — Puertas Corredizas a Medida | San Justo, La Matanza",
  description: "Fabricamos e instalamos puertas corredizas a medida en CABA y Gran Buenos Aires. Sin obra. Precio exacto en minutos. Fabricantes directos en San Justo, La Matanza.",
  keywords: [
    "puertas corredizas a medida",
    "puertas corredizas CABA",
    "puertas corredizas GBA",
    "instalación puertas corredizas",
    "San Justo La Matanza",
    "fabricantes puertas corredizas",
    "puertas sin obra",
    "diseños JK",
    "puerta plegable a medida",
  ],
  openGraph: {
    title: "Diseños JK — Puertas Corredizas a Medida",
    description: "Fabricamos e instalamos puertas corredizas a medida en CABA y GBA. Sin obra. Precio exacto por WhatsApp.",
    type: "website",
    locale: "es_AR",
    siteName: "Diseños JK",
    images: [
      {
        url: "/puerta-granero.webp",
        width: 1200,
        height: 630,
        alt: "Puertas corredizas a medida — Diseños JK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diseños JK — Puertas Corredizas a Medida",
    description: "Fabricamos e instalamos puertas corredizas a medida en CABA y GBA.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://disenosjk.vercel.app" },
}

// JSON-LD LocalBusiness schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "name": "Diseños JK",
  "description": "Fabricación e instalación de puertas corredizas a medida en San Justo, La Matanza y Gran Buenos Aires. Sin obra. Precio exacto en minutos.",
  "url": "https://disenosjk.vercel.app",
  "image": "https://disenosjk.vercel.app/puerta-granero.webp",
  // TODO: reemplazar con número real cuando el cliente lo confirme
  // "telephone": "+54-9-11-XXXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Venezuela y Arieta",
    "addressLocality": "San Justo",
    "addressRegion": "Buenos Aires",
    "postalCode": "1754",
    "addressCountry": "AR",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -34.67480,
    "longitude": -58.55850,
  },
  "hasMap": "https://maps.google.com/maps?q=Venezuela+y+Arieta+San+Justo+La+Matanza",
  "areaServed": [
    "San Justo", "La Matanza", "Ciudad Autónoma de Buenos Aires", "Gran Buenos Aires",
    "Morón", "Lomas de Zamora", "Avellaneda", "Lanús", "Quilmes", "Tigre",
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "15:00",
    },
  ],
  "priceRange": "$$",
  "sameAs": [
    "https://instagram.com/disenosjk_",
    "https://www.mercadolibre.com.ar/tienda/disenosjk",
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable} ${ibmMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Transiciones de sección — activa section-hidden en todas las secciones excepto el hero */}
        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  function init(){
    var sections = document.querySelectorAll('main > * > section:not(:first-child), main section[id]');
    sections.forEach(function(s,i){
      if(s.closest('.hero-grid')) return;
      s.classList.add('section-hidden');
      if(i>0) s.style.transitionDelay = '0.05s';
    });
    function check(){
      sections.forEach(function(s){
        var r = s.getBoundingClientRect();
        if(r.top < window.innerHeight*0.92 && r.bottom>0){
          s.classList.remove('section-hidden');
          s.classList.add('section-visible');
        }
      });
    }
    check();
    window.addEventListener('scroll', check, {passive:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
        `}} />
      </head>
      <body>
        {children}
        {/* Meta Pixel — carga después de la interacción del usuario para no bloquear LCP */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }} alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  )
}
