import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        // --- ألوان التأثير الزجاجي والنيون الجديدة ---
        background: "#0F111A", // أسود كحلي عميق جداً
        foreground: "#FFFFFF", // أبيض ناصع للنصوص
        border: "rgba(255, 255, 255, 0.08)", // حدود زجاجية خفيفة
        input: "rgba(255, 255, 255, 0.05)", // خلفية خانات الإدخال
        ring: "#8B5CF6", // لون حلقة التركيز (Focus) البنفسجي
        
        primary: {
          DEFAULT: "#8B5CF6", // البنفسجي النيون
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "rgba(255, 255, 255, 0.03)", // شفاف جداً للزجاج
          foreground: "#A1A1AA", // رمادي للنصوص الفرعية
        },
        accent: {
          DEFAULT: "#3B82F6", // أزرق نيون للمسات
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.02)", // خلفية الكروت الزجاجية
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#151520",
          foreground: "#A1A1AA",
        },
        popover: {
          DEFAULT: "#0A0A0F",
          foreground: "#FFFFFF",
        },

        // --- الألوان الافتراضية اللي متلمستش عشان ميحصلش تعارض ---
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;