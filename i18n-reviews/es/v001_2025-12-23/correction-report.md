# Correction Report

**Language:** Spanish (es)
**Version:** v001_2025-12-23
**Applied:** 2025-12-23T20:31:16.421Z
**Total:** 15

---

## By Issue Type

- **naturalness**: 7
- **accuracy**: 2
- **grammar**: 4
- **terminology**: 2

## Changes

### 1. `site.tagline`
**Issue:** naturalness

**Before:** Herramientas de Desarrollador Gratis

**After:** Herramientas gratuitas para desarrolladores

**Why:** The current translation feels like a literal word-for-word translation. 'Herramientas gratuitas para desarrolladores' is the standard, professional phrasing for a site tagline.

---

### 2. `site.metaTitle`
**Issue:** naturalness

**Before:** OneDevKit - Herramientas de Desarrollador Gratis

**After:** OneDevKit - Herramientas gratuitas para desarrolladores

**Why:** Aligning with the tagline correction for consistency and better Spanish phrasing in search results.

---

### 3. `site.description`
**Issue:** accuracy

**Before:** Herramientas de desarrollo online gratuitas para tareas cotidianas.

**After:** Herramientas de desarrollo online gratuitas para tareas cotidianas: formateador JSON, codificador Base64, decodificador JWT, generador de hashes y más.

**Why:** The current Spanish translation truncated the list of tools present in the English source. Including the list is important for SEO and user information.

---

### 4. `common.dragDrop`
**Issue:** grammar

**Before:** Arrastrar y soltar o clic para subir

**After:** Arrastra y suelta o haz clic para subir

**Why:** The current text mixes infinitives ('Arrastrar') with a noun ('clic'). The suggestion uses the imperative mode consistently ('Drag, drop, or click'), which is standard for UI instructions.

---

### 5. `common.speakingTime`
**Issue:** naturalness

**Before:** Tiempo de habla

**After:** Tiempo de lectura en voz alta

**Why:** 'Tiempo de habla' sounds like 'talk time' (e.g., cell phone minutes). In the context of a word counter, the standard term for reading aloud is 'Tiempo de lectura en voz alta'.

---

### 6. `common.caseSensitive`
**Issue:** naturalness

**Before:** Sensible a mayúsculas

**After:** Distinguir mayúsculas y minúsculas

**Why:** 'Sensible a mayúsculas' is a direct translation of the English idiom (Anglicism). The standard UI term in Spanish is 'Distinguir mayúsculas y minúsculas'.

---

### 7. `common.payload`
**Issue:** terminology

**Before:** Carga Útil

**After:** Payload

**Why:** While 'Carga útil' is the literal translation, in the context of web development (JWTs, API requests), Spanish-speaking developers almost exclusively use the English term 'Payload'.

---

### 8. `common.issuedAt`
**Issue:** accuracy

**Before:** Emitido en

**After:** Fecha de emisión

**Why:** 'Emitido en' can be ambiguous (implying a location). In the context of JWTs ('iat'), it refers to a time, so 'Fecha de emisión' is the precise technical translation.

---

### 9. `tools.json-formatter.description`
**Issue:** naturalness

**Before:** Formatea, valida y embellece datos JSON al instante. Soporta minificación y resaltado de sintaxis.

**After:** Formatea, valida y embellece datos JSON al instante. Permite minificar y resaltar sintaxis.

**Why:** 'Soporta' is often considered a 'false friend' in Spanish (meaning 'to tolerate'). 'Permite' (allows) or 'Admite' is more natural for software capabilities.

---

### 10. `tools.jwt-decoder.description`
**Issue:** grammar

**Before:** Visualiza header, payload y verifica la estructura del token al instante.

**After:** Visualiza el encabezado (header), el payload y verifica la estructura del token al instante.

**Why:** The current text lists English terms without articles, which sounds robotic in Spanish. Adding articles ('el payload') and the Spanish equivalent for header ('el encabezado') improves flow.

---

### 11. `tools.password-generator.keywords`
**Issue:** naturalness

**Before:** generador de contraseñas, contraseña aleatoria, generador de contraseñas seguras, creador de contraseñas fuertes, generar contraseña online

**After:** generador de contraseñas, contraseña aleatoria, contraseñas seguras, crear contraseñas, generar contraseñas online

**Why:** 'Contraseñas fuertes' is a literal translation of 'strong passwords'. The natural collocation in Spanish regarding security is 'contraseñas seguras' or 'robustas'.

---

### 12. `tools.image-compressor.fullName`
**Issue:** grammar

**Before:** Compresor de Imágenes a KB Específico

**After:** Compresor de imágenes a un tamaño específico (KB)

**Why:** The current translation is grammatically awkward. The suggested version clarifies that the compressor targets a specific file size.

---

### 13. `tools.passport-photo.name`
**Issue:** naturalness

**Before:** Foto Pasaporte

**After:** Foto tipo Pasaporte

**Why:** 'Foto Pasaporte' sounds robotic. 'Foto tipo Pasaporte' or 'Foto para pasaporte' is how a native speaker describes this tool.

---

### 14. `pages.about.letUsKnow`
**Issue:** grammar

**Before:** Háznoslo saber

**After:** hacérnoslo saber

**Why:** Context mismatch: This text completes the sentence 'no dudes en...' ('feel free to...'). 'Háznoslo saber' is imperative (Command), which breaks the grammar. It must be the infinitive 'hacérnoslo saber'.

---

### 15. `pages.privacy.notCollected.personal.text`
**Issue:** terminology

**Before:** No pedimos ni almacenamos tu nombre, correo electrónico ni ninguna información identificable

**After:** No pedimos ni almacenamos tu nombre, correo electrónico ni ninguna información de identificación personal

**Why:** 'Información identificable' is vague. The standard legal/technical translation for PII (Personally Identifiable Information) is 'Información de identificación personal'.

---

