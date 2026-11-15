# Aleluya-Git · web de proyectos

Web estática (HTML + CSS + JS, sin dependencias ni compilación) que presenta OpenLaser Studio, OpenRouteAI, Electronic Front Panel Designer y Open LVGL Studio.

## Publicar en GitHub Pages

1. Crea un repositorio público llamado **`Aleluya-Git.github.io`** (así la web queda en `https://aleluya-git.github.io/`).
   Si prefieres otro nombre, por ejemplo `proyectos`, la web quedará en `https://aleluya-git.github.io/proyectos/`.
2. Sube el contenido de esta carpeta a la raíz de la rama `main` (`index.html`, `assets/`, `.nojekyll`, `README.md`).
3. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)` → **Save**.
4. En uno o dos minutos la web está en línea.

Desde la línea de comandos:

```bash
cd web-proyectos
git init -b main
git add .
git commit -m "Web de proyectos"
git remote add origin https://github.com/Aleluya-Git/Aleluya-Git.github.io.git
git push -u origin main
```

## Cambiar contenido

- **Idioma**: la web está en español e inglés (botones ES/EN arriba a la derecha; también `?lang=en` en la URL). Cada texto está dos veces en `index.html`, como `<span class="es">…</span><span class="en">…</span>`.
- **Fuente de los títulos (BN Machine)**: copia `BNMachine.woff2` o `BNMachine.ttf` en `assets/fonts/`. Mientras no esté, los títulos usan Bricolage Grotesque. BN Machine figura como gratuita solo para uso personal: compruébalo antes de usarla en una web pública.
- **Pantallas de cada programa**: están en `assets/img/screens/` y se configuran en `assets/js/main.js` (objeto `SCREENS`). Cada pantalla tiene título, descripción y una imagen por idioma (`src: { es, en, fr, de }`); si una pantalla tiene varias, aparecen los botones de idioma en la ventana. Los puntos de la barra de la ventana pasan de una pantalla a otra.
- **Guías de cada programa**: `openlaser.html`, `openroute.html`, `efpd.html` y `lvgl.html`. El texto (introducción, pasos, zonas numeradas de la ventana, galería y consejos) está en `assets/data/<programa>.js`. Los menús, barras e iconos están en `assets/data/<programa>-ui.js` y se generaron a partir del código fuente de cada programa; los iconos están en `assets/icons/<programa>/`.
- **Logos e iconos de los programas**: `assets/img/logos/`.
- **Colores**: variables al principio de `assets/css/style.css` (`--laser`, `--route`, `--panel`, `--lvgl`).
- **Demos interactivas**: `assets/js/main.js`, una sección por proyecto.
