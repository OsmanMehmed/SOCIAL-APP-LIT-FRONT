Reglas del contexto para el frontend
------------------------------------

Este documento lista las reglas operativas para `SOCIAL-APP-LIT-FRONT`.

--------------------------------------------------------------------------------
RULE 1: SOURCE OF TRUTH - Unstaged changes only
--------------------------------------------------------------------------------
- Regla principal: No rescatar ni usar informacion del contexto conversacional de la IA.
- Base de la verdad: usar unicamente los cambios unstaged presentes en el repositorio
  (`git status --porcelain`, `git diff`) para preparar mensajes, commits o decisiones.

Reglas operativas:
  1. Ejecutar `git status --porcelain` y `git diff` antes de generar cualquier salida
     relacionada con cambios de codigo.
  2. Si necesita leer archivos, abrirlos directamente desde el workspace (ej.:
     `git diff <file>` o `cat <file>`), no usar resumenes previos de chat.
  3. Documentar en el commit message que archivos/diffs se incluyen.

--------------------------------------------------------------------------------
RULE 2: URL BEHAVIOR - No @ and no user IDs in URLs
--------------------------------------------------------------------------------
- Regla: Las URLs de la aplicacion no deben contener el caracter `@` ni identificadores
  internos (IDs) de usuario. Cuando haya que referenciar a un usuario en la URL,
  usar el `username` limpio (sin `@`).

Ejemplos:
  - Correcto: `/profile/frank33`, `/dm/ana.cocina`, `/post/{postId}`
  - Incorrecto: `/profile/@frank33`, `/profile/user-6`, `/dm/@ana.cocina`, `/dm/user-1`

Reglas operativas:
  - Limpiar cualquier parametro que contenga `@` al iniciarse la carga de la pagina.
  - Usar `window.history.replaceState(null, '', '/profile/<username>')` para
    dejar la URL canonica cuando sea necesario.

--------------------------------------------------------------------------------
RULE 3: DISPLAY LAYER - @ only for rendering
--------------------------------------------------------------------------------
- Regla: El prefijo `@` se anade unicamente en la capa de presentacion (UI). Los
  componentes deben recibir y transmitir `username` sin `@`.

Reglas operativas:
  1. `app-mini-profile` debe renderizar `@${this.username}` (agregar `@` solo al render).
  2. Todos los componentes que llamen a `app-mini-profile` deben pasar `username`
     ya limpio (sin `@`).
  3. Si el backend retorna `username` con `@`, limpiarlo antes de usarlo en props
     (ej.: `username.replace(/^@/, '')`).

Ejemplo corto (render):
  render() { return html`<span>@${this.username}</span>` }

--------------------------------------------------------------------------------
RULE 4: NAVIGATION - Always use cleaned username
--------------------------------------------------------------------------------
- Regla: Cuando se navegue (internamente) usar siempre el `username` limpio.

Reglas operativas:
  - Antes de `navigate('/profile/...')` limpiar `@` del valor a usar.
  - Nunca construir rutas con IDs de usuario.

--------------------------------------------------------------------------------
RULE 5: LOGIN INPUT - Visual @ but send clean username
--------------------------------------------------------------------------------
- Regla: En la pantalla de login se muestra visualmente `@usuario` mientras el
  usuario escribe, pero lo que se envia al backend es el `username` sin `@`.

Reglas operativas:
  1. Mostrar `@` en el campo de entrada como decoracion visual.
  2. Al enviar, limpiar el `@` y enviar `username` (ej.: `username.replace(/^@/, '')`).
  3. Mostrar mensajes de error claros en caso de fallo (ej.: "Introduce usuario y contrasena."
     o "Usuario o contrasena incorrectos.").

--------------------------------------------------------------------------------
RULE 6: BACKEND API CONTRACT - Backend expects IDs
--------------------------------------------------------------------------------
- Regla: Salvo para autenticacion (login), los endpoints del backend reciben
  identificadores (IDs) de usuario, no `username`.

Reglas operativas:
  1. El frontend debe resolver `username -> id` antes de llamar a APIs que requieran IDs
     (por ejemplo: crear conversacion, enviar mensaje, operaciones CRUD sobre recursos
      que esperan `userId`).
  2. La unica excepcion es el endpoint de autenticacion: se envia `username` (sin `@`).

--------------------------------------------------------------------------------
RULE 7: URL CLEANUP - Canonicalization
--------------------------------------------------------------------------------
- Regla: Si se detecta que la URL entrante contiene `@` en el parametro de usuario,
  limpiarla automaticamente sin forzar una navegacion adicional visible.

Reglas operativas:
  - Al cargar la pagina, si `param` contiene `@`, ejecutar:
    ```js
    const clean = param.replace(/^@/, '');
    if (param !== clean) window.history.replaceState(null, '', `/dm/${clean}`);
    ```

--------------------------------------------------------------------------------
RULE 8: AFFECTED FILES (referencia rapida)
--------------------------------------------------------------------------------
- Lista indicativa de archivos modificados o relevantes:
  - `src/components/app-mini-profile.ts`
  - `src/pages/page-feed.ts`
  - `src/pages/page-profile.ts`
  - `src/pages/page-search.ts`
  - `src/pages/page-direct-message.ts`
  - `src/pages/page-conversations.ts`
  - `src/pages/page-login.ts`

--------------------------------------------------------------------------------
RULE 9: SUMMARY (quick reference)
--------------------------------------------------------------------------------
- URLs always use `username` (no `@`, no user IDs): `/profile/{username}`, `/dm/{username}`.
- The `@` prefix appears only in the UI rendering and in the visual login input.
- Backend calls (except login) must use IDs;
  frontend resolves `username -> id` before calling such APIs.

--------------------------------------------------------------------------------
RULE 10: COMMAND SHORTCUT - "2A"
--------------------------------------------------------------------------------
- Regla: Si el usuario envia exactamente `2A`, el asistente debe generar dos sugerencias
  de mensajes de commit en ingles (una tecnica y otra de alto nivel) basadas exclusivamente
  en los cambios unstaged del repositorio frontend y backend.

Reglas operativas:
  1. Comprobar `git status --porcelain` y `git diff` para identificar los diffs unstaged.
  2. Generar dos nombres en ingles por cada repositorio (backend y frontend):
     - Una alternativa tecnica (p. ej. "Fix X to handle Y").
     - Una alternativa de alto nivel (p. ej. "Refactor X to improve Y").
  3. Incluir en la respuesta una breve lista de los archivos clave que justifican cada
     sugerencia de commit.

--------------------------------------------------------------------------------
RULE 11: NO-COMMENTS
--------------------------------------------------------------------------------
- Regla: No dejar nunca comentarios en el codigo ni anadir nuevos comentarios en este
  repositorio.

--------------------------------------------------------------------------------
NOTA FINAL
--------------------------------------------------------------------------------
Estas reglas fueron solicitadas para garantizar trazabilidad y evitar dependencia en
la memoria conversacional de la IA. Aplicar siempre los pasos operativos indicados
antes de generar resumenes, commit messages o tomar decisiones sobre cambios.
