export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fondo:              "hsl(var(--fondo) / <alpha-value>)",
        superficie:         "hsl(var(--superficie) / <alpha-value>)",
        borde:              "hsl(var(--borde) / <alpha-value>)",
        texto:              "hsl(var(--texto) / <alpha-value>)",
        "texto-suave":      "hsl(var(--texto-suave) / <alpha-value>)",
        marca:              "hsl(var(--marca) / <alpha-value>)",
        "marca-contraste":  "hsl(var(--marca-contraste) / <alpha-value>)",
        acento:             "hsl(var(--acento) / <alpha-value>)",
        exito:              "hsl(var(--exito) / <alpha-value>)",
        alerta:             "hsl(var(--alerta) / <alpha-value>)",
        peligro:            "hsl(var(--peligro) / <alpha-value>)",
      },
      borderRadius: { DEFAULT: "var(--radio)", lg: "var(--radio)" },
      fontFamily: { titulo: "var(--fuente-titulo)", texto: "var(--fuente-texto)" },
    },
  },
}
