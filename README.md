# Countries

Proyecto Angular para la visualización y gestión de información de países.

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/countries.git
   cd countries
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configuración adicional**
   - Asegúrate de tener Node.js v20+ y npm instalados.
   - Para desarrollo SSR, revisa la configuración de Express en [`src/server.ts`](src/server.ts).

## Comandos principales

- **Desarrollo**
  ```bash
  ng serve
  ```
  Accede a [http://localhost:4200](http://localhost:4200)

- **Build producción**
  ```bash
  ng build --configuration=production
  ```

- **Tests unitarios**
  ```bash
  ng test
  ```

- **Cobertura de tests**
  ```bash
  ng test --code-coverage
  ```

- **Lint**
  ```bash
  ng lint
  ```

- **SSR (Server Side Rendering)**
  ```bash
  npm run build
  npm run serve:ssr:countries
  ```

- **E2E (Cypress)**
  ```bash
  npx cypress open
  ```

## CI/CD

El proyecto incluye un workflow de GitHub Actions en [`.github/workflows/ci.yml`](.github/workflows/ci.yml) que ejecuta:

- Lint (`npm run lint`)
- Tests unitarios con cobertura (`npm run test -- --watch=false --code-coverage`)
- Build de producción (`npm run build -- --configuration=production`)
- Publicación del reporte de cobertura como artefacto

Puedes ver el estado y logs de CI/CD en la pestaña "Actions" de tu repositorio en GitHub.

## Decisiones arquitectónicas

- **Angular Standalone Components:** Se utilizan componentes standalone para mayor modularidad y carga eficiente.
- **SSR (Server Side Rendering):** Implementado con Express y Angular Universal para mejorar SEO y tiempos de carga.
- **Gestión de estado:** Se emplean stores reactivos personalizados (por ejemplo, [`FavoritesStore`](src/app/core/store/favorites.store.ts)).
- **Pruebas:**  
  - Unitarias con Jasmine/Karma.
  - E2E con Cypress.
  - Cobertura mínima recomendada: 80%.
- **Estilo:**  
  - Angular Material para UI.
  - SCSS como preprocesador de estilos.
- **Linting:**  
  - Configuración estricta con angular-eslint.
- **Internacionalización:**  
  - Preparado para i18n mediante Angular.

## Estructura de carpetas

- `src/app/` - Código fuente principal de la aplicación.
- `src/server.ts` - Entrada SSR con Express.
- `cypress/` - Tests end-to-end.
- `.github/workflows/` - Configuración de CI/CD.
- `coverage/` - Reportes de cobertura de tests.

## Recursos adicionales

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Angular Material](https://material.angular.io/)
- [Cypress Documentation](https://docs.cypress.io/)

---