# Translation Review Request

You are reviewing Spanish translations for OneDevKit, a developer tools website.

## Your Task

Review each translation below and identify any issues. For each problematic translation, provide:
1. The translation key
2. The issue type (accuracy, naturalness, terminology, formality, grammar)
3. Your suggested correction
4. Brief explanation

## Guidelines

- **Accuracy**: Does the translation accurately convey the English meaning?
- **Naturalness**: Does it sound natural to native Spanish speakers?
- **Terminology**: Are technical terms translated consistently and correctly?
- **Formality**: Is the formality level appropriate (professional but accessible)?
- **Grammar**: Is the grammar correct?

## Important Notes

- Keep brand names "OneDevKit" unchanged
- Keep placeholders like `{year}`, `{value}` unchanged
- Technical terms (JSON, Base64, UUID, JWT, etc.) can stay in English
- URLs and code examples should not be translated

## Output Format

Please respond ONLY with a JSON array of corrections. If everything is correct, respond with an empty array `[]`.

```json
[
  {
    "key": "tools.json-formatter.description",
    "issue": "naturalness",
    "current": "current translation text",
    "suggested": "improved translation text",
    "explanation": "Brief explanation of why this change improves the translation"
  }
]
```

---

# Translations to Review

| Key | English | ES |
|-----|---------|-----|
| `site.name` | OneDevKit | OneDevKit |
| `site.tagline` | Free Online Developer Tools | Herramientas de Desarrollador Gratis |
| `site.description` | Free online developer tools for everyday tasks. JSON formatter, Base64 encoder, URL encoder, JWT decoder, hash generator, timestamp converter, password generator, UUID generator, and more. | Herramientas de desarrollo online gratuitas para tareas cotidianas. |
| `site.metaTitle` | OneDevKit - Free Online Developer Tools | OneDevKit - Herramientas de Desarrollador Gratis |
| `site.metaDescription` | A collection of free, privacy-focused developer tools. All processing happens in your browser - no data is sent to servers. | Colección de herramientas de desarrollo gratuitas y enfocadas en la privacidad. |
| `nav.home` | Home | Inicio |
| `nav.tools` | Tools | Herramientas |
| `nav.about` | About | Acerca de |
| `nav.contact` | Contact | Contacto |
| `nav.faq` | FAQ | Preguntas Frecuentes |
| `nav.privacy` | Privacy Policy | Política de Privacidad |
| `nav.terms` | Terms of Service | Términos de Servicio |
| `nav.language` | Language | Idioma |
| `common.copy` | Copy | Copiar |
| `common.copied` | Copied! | ¡Copiado! |
| `common.download` | Download | Descargar |
| `common.clear` | Clear | Limpiar |
| `common.reset` | Reset | Restablecer |
| `common.upload` | Upload | Subir |
| `common.dragDrop` | Drag & drop or click to upload | Arrastrar y soltar o clic para subir |
| `common.processing` | Processing... | Procesando... |
| `common.error` | Error | Error |
| `common.success` | Success | Éxito |
| `common.loading` | Loading... | Cargando... |
| `common.cancel` | Cancel | Cancelar |
| `common.save` | Save | Guardar |
| `common.delete` | Delete | Eliminar |
| `common.edit` | Edit | Editar |
| `common.close` | Close | Cerrar |
| `common.apply` | Apply | Aplicar |
| `common.generate` | Generate | Generar |
| `common.convert` | Convert | Convertir |
| `common.format` | Format | Formatear |
| `common.validate` | Validate | Validar |
| `common.encode` | Encode | Codificar |
| `common.decode` | Decode | Decodificar |
| `common.input` | Input | Entrada |
| `common.output` | Output | Salida |
| `common.result` | Result | Resultado |
| `common.preview` | Preview | Vista Previa |
| `common.options` | Options | Opciones |
| `common.settings` | Settings | Configuración |
| `common.selectAll` | Select All | Seleccionar Todo |
| `common.loadSample` | Load Sample | Cargar Ejemplo |
| `common.howToUse` | How to Use | Cómo Usar |
| `common.faq` | FAQ | Preguntas Frecuentes |
| `common.relatedTools` | Related Tools | Herramientas Relacionadas |
| `common.shareThisTool` | Share this tool | Compartir esta herramienta |
| `common.reportIssue` | Report an issue | Reportar un problema |
| `common.madeWith` | Made with | Hecho con |
| `common.privacy` | Your data never leaves your browser | Tus datos nunca salen de tu navegador |
| `common.minify` | Minify | Minificar |
| `common.beautify` | Beautify | Embellecer |
| `common.swap` | Swap | Intercambiar |
| `common.compare` | Compare | Comparar |
| `common.test` | Test | Probar |
| `common.check` | Check | Verificar |
| `common.run` | Run | Ejecutar |
| `common.refresh` | Refresh | Actualizar |
| `common.useCurrent` | Use Current | Usar Actual |
| `common.enterText` | Enter text | Introducir texto |
| `common.enterJson` | Enter JSON | Introducir JSON |
| `common.enterUrl` | Enter URL | Introducir URL |
| `common.enterCode` | Enter code | Introducir código |
| `common.pasteHere` | Paste here... | Pegar aquí... |
| `common.typeHere` | Type here... | Escribir aquí... |
| `common.selectFile` | Select File | Seleccionar Archivo |
| `common.dropFile` | Drop file here | Soltar archivo aquí |
| `common.noFileSelected` | No file selected | Ningún archivo seleccionado |
| `common.indentation` | Indentation | Sangría |
| `common.spaces` | Spaces | Espacios |
| `common.tabs` | Tabs | Tabulaciones |
| `common.length` | Length | Longitud |
| `common.size` | Size | Tamaño |
| `common.count` | Count | Cantidad |
| `common.total` | Total | Total |
| `common.characters` | Characters | Caracteres |
| `common.words` | Words | Palabras |
| `common.lines` | Lines | Líneas |
| `common.paragraphs` | Paragraphs | Párrafos |
| `common.sentences` | Sentences | Oraciones |
| `common.readingTime` | Reading time | Tiempo de lectura |
| `common.speakingTime` | Speaking time | Tiempo de habla |
| `common.minutes` | min | min |
| `common.seconds` | sec | seg |
| `common.bytes` | bytes | bytes |
| `common.keys` | Keys | Claves |
| `common.depth` | Depth | Profundidad |
| `common.valid` | Valid | Válido |
| `common.invalid` | Invalid | Inválido |
| `common.matches` | Matches | Coincidencias |
| `common.noMatches` | No matches | Sin coincidencias |
| `common.caseSensitive` | Case sensitive | Sensible a mayúsculas |
| `common.globalSearch` | Global search | Búsqueda global |
| `common.multiline` | Multiline | Multilínea |
| `common.originalText` | Original Text | Texto Original |
| `common.modifiedText` | Modified Text | Texto Modificado |
| `common.differences` | Differences | Diferencias |
| `common.additions` | Additions | Adiciones |
| `common.deletions` | Deletions | Eliminaciones |
| `common.unchanged` | Unchanged | Sin cambios |
| `common.unifiedView` | Unified View | Vista Unificada |
| `common.splitView` | Split View | Vista Dividida |
| `common.uppercase` | UPPERCASE | MAYÚSCULAS |
| `common.lowercase` | lowercase | minúsculas |
| `common.titleCase` | Title Case | Tipo Título |
| `common.sentenceCase` | Sentence case | Tipo oración |
| `common.camelCase` | camelCase | camelCase |
| `common.pascalCase` | PascalCase | PascalCase |
| `common.snakeCase` | snake_case | snake_case |
| `common.kebabCase` | kebab-case | kebab-case |
| `common.constantCase` | CONSTANT_CASE | CONSTANT_CASE |
| `common.strength` | Strength | Fortaleza |
| `common.weak` | Weak | Débil |
| `common.medium` | Medium | Media |
| `common.strong` | Strong | Fuerte |
| `common.veryStrong` | Very Strong | Muy Fuerte |
| `common.includeUppercase` | Include Uppercase | Incluir Mayúsculas |
| `common.includeLowercase` | Include Lowercase | Incluir Minúsculas |
| `common.includeNumbers` | Include Numbers | Incluir Números |
| `common.includeSymbols` | Include Symbols | Incluir Símbolos |
| `common.excludeAmbiguous` | Exclude Ambiguous | Excluir Ambiguos |
| `common.quantity` | Quantity | Cantidad |
| `common.generateNew` | Generate New | Generar Nuevo |
| `common.bulkGenerate` | Bulk Generate | Generar en Lote |
| `common.copyAll` | Copy All | Copiar Todo |
| `common.timestamp` | Timestamp | Marca de Tiempo |
| `common.date` | Date | Fecha |
| `common.time` | Time | Hora |
| `common.timezone` | Timezone | Zona Horaria |
| `common.local` | Local | Local |
| `common.utc` | UTC | UTC |
| `common.iso` | ISO 8601 | ISO 8601 |
| `common.relative` | Relative | Relativo |
| `common.header` | Header | Encabezado |
| `common.payload` | Payload | Carga Útil |
| `common.signature` | Signature | Firma |
| `common.expired` | Expired | Expirado |
| `common.notExpired` | Not Expired | No Expirado |
| `common.issuedAt` | Issued At | Emitido en |
| `common.expiresAt` | Expires At | Expira en |
| `common.algorithm` | Algorithm | Algoritmo |
| `common.hash` | Hash | Hash |
| `common.md5` | MD5 | MD5 |
| `common.sha1` | SHA-1 | SHA-1 |
| `common.sha256` | SHA-256 | SHA-256 |
| `common.sha512` | SHA-512 | SHA-512 |
| `common.urlSafe` | URL Safe | Seguro para URL |
| `common.lineBreaks` | Line Breaks | Saltos de línea |
| `common.startWithLorem` | Start with Lorem ipsum | Empezar con Lorem ipsum |
| `common.outputType` | Output Type | Tipo de Salida |
| `common.wordCount` | Word Count | Cantidad de Palabras |
| `common.sentenceCount` | Sentence Count | Cantidad de Oraciones |
| `common.paragraphCount` | Paragraph Count | Cantidad de Párrafos |
| `common.listItems` | List Items | Elementos de Lista |
| `common.qrCode` | QR Code | Código QR |
| `common.text` | Text | Texto |
| `common.url` | URL | URL |
| `common.errorCorrectionLevel` | Error Correction | Corrección de Errores |
| `common.low` | Low | Bajo |
| `common.high` | High | Alto |
| `common.quality` | Quality | Calidad |
| `common.width` | Width | Ancho |
| `common.height` | Height | Alto |
| `common.aspectRatio` | Aspect Ratio | Relación de Aspecto |
| `common.backgroundColor` | Background Color | Color de Fondo |
| `common.foregroundColor` | Foreground Color | Color de Primer Plano |
| `common.transparent` | Transparent | Transparente |
| `common.downloadPng` | Download PNG | Descargar PNG |
| `common.downloadSvg` | Download SVG | Descargar SVG |
| `common.downloadJpg` | Download JPG | Descargar JPG |
| `common.component` | Component | Componente |
| `common.fullUrl` | Full URL | URL Completa |
| `common.home` | Home | Inicio |
| `common.tools` | Tools | Herramientas |
| `common.toggleDarkMode` | Toggle dark mode | Alternar modo oscuro |
| `common.outputPlaceholder` | Result will appear here | El resultado aparecerá aquí |
| `common.formattedJsonPlaceholder` | Formatted JSON will appear here | El JSON formateado aparecerá aquí |
| `common.decodedPlaceholder` | Decoded content will appear here | El contenido decodificado aparecerá aquí |
| `common.encodedPlaceholder` | Encoded content will appear here | El contenido codificado aparecerá aquí |
| `common.hashPlaceholder` | Hash values will appear here | Los valores hash aparecerán aquí |
| `common.previewPlaceholder` | Preview will appear here | La vista previa aparecerá aquí |
| `categories.Code Tools` | Code Tools | Herramientas de Código |
| `categories.Generators` | Generators | Generadores |
| `categories.Text & Data` | Text & Data | Texto y Datos |
| `categories.Image Tools` | Image Tools | Herramientas de Imagen |
| `tools.json-formatter.name` | JSON Formatter | Formateador JSON |
| `tools.json-formatter.fullName` | JSON Formatter & Validator | Formateador y Validador JSON |
| `tools.json-formatter.description` | Format, validate, and beautify JSON data instantly. Supports minification and syntax highlighting. | Formatea, valida y embellece datos JSON al instante. Soporta minificación y resaltado de sintaxis. |
| `tools.json-formatter.shortDescription` | Format, validate & beautify | Formatea, valida y embellece |
| `tools.json-formatter.metaTitle` | JSON Formatter & Validator - Free Online Tool \| OneDevKit | Formateador y Validador JSON - Herramienta Online Gratis \| OneDevKit |
| `tools.json-formatter.metaDescription` | Free online JSON formatter and validator. Beautify, minify, and validate JSON with syntax highlighting. No signup required, works offline. | Formateador y validador JSON online gratuito. Embellece, minifica y valida JSON con resaltado de sintaxis. |
| `tools.json-formatter.keywords` | json formatter, json validator, json beautifier, format json online, json lint, json parser, beautify json, minify json | formateador json, validador json, embellecedor json, formatear json online, json lint, parser json, embellecer json, minificar json |
| `tools.json-formatter.howTo.title` | How to Use | Cómo Usar |
| `tools.json-formatter.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.json-formatter.faq` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.base64-encoder.name` | Base64 Encoder | Codificador Base64 |
| `tools.base64-encoder.fullName` | Base64 Encoder & Decoder | Codificador y Decodificador Base64 |
| `tools.base64-encoder.description` | Encode text to Base64 or decode Base64 to readable text. Supports file uploads and URL-safe encoding. | Codifica texto a Base64 o decodifica Base64 a texto legible. Soporta carga de archivos y codificación segura para URL. |
| `tools.base64-encoder.shortDescription` | Encode & decode Base64 | Codifica y decodifica Base64 |
| `tools.base64-encoder.metaTitle` | Base64 Encoder & Decoder - Free Online Tool \| OneDevKit | Codificador y Decodificador Base64 - Herramienta Online Gratis \| OneDevKit |
| `tools.base64-encoder.metaDescription` | Free Base64 encoder and decoder. Convert text to Base64 or decode Base64 strings. Supports file uploads and URL-safe encoding. | Codificador y decodificador Base64 gratuito. Convierte texto a Base64 o decodifica cadenas Base64. |
| `tools.base64-encoder.keywords` | base64 encoder, base64 decoder, base64 converter, encode base64, decode base64 online | codificador base64, decodificador base64, convertidor base64, codificar base64, decodificar base64 online |
| `tools.base64-encoder.howTo.title` | How to Use | Cómo Usar |
| `tools.base64-encoder.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.base64-encoder.faq` | [object Object],[object Object] | [object Object],[object Object] |
| `tools.url-encoder.name` | URL Encoder | Codificador URL |
| `tools.url-encoder.fullName` | URL Encoder & Decoder | Codificador y Decodificador URL |
| `tools.url-encoder.description` | Encode special characters for URLs or decode URL-encoded strings. Essential for web development and API work. | Codifica caracteres especiales para URLs o decodifica cadenas codificadas. Esencial para desarrollo web y trabajo con APIs. |
| `tools.url-encoder.shortDescription` | Encode & decode URLs | Codifica y decodifica URLs |
| `tools.url-encoder.metaTitle` | URL Encoder & Decoder - Free Online Tool \| OneDevKit | Codificador y Decodificador URL - Herramienta Online Gratis \| OneDevKit |
| `tools.url-encoder.metaDescription` | Free URL encoder and decoder. Encode special characters for URLs or decode URL-encoded strings. Essential for web development. | Codificador y decodificador URL gratuito. Codifica caracteres especiales para URLs o decodifica cadenas codificadas. |
| `tools.url-encoder.keywords` | url encoder, url decoder, percent encoding, urlencode online, url escape, encode url parameters | codificador url, decodificador url, codificación porcentual, urlencode online, escapar url, codificar parámetros url |
| `tools.url-encoder.howTo.title` | How to Use | Cómo Usar |
| `tools.url-encoder.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.url-encoder.faq` | [object Object] | [object Object] |
| `tools.jwt-decoder.name` | JWT Decoder | Decodificador JWT |
| `tools.jwt-decoder.fullName` | JWT Decoder & Inspector | Decodificador e Inspector JWT |
| `tools.jwt-decoder.description` | Decode and inspect JSON Web Tokens (JWT). View header, payload, and verify token structure instantly. | Decodifica e inspecciona JSON Web Tokens (JWT). Visualiza header, payload y verifica la estructura del token al instante. |
| `tools.jwt-decoder.shortDescription` | Decode & inspect JWTs | Decodifica e inspecciona JWTs |
| `tools.jwt-decoder.metaTitle` | JWT Decoder & Inspector - Free Online Tool \| OneDevKit | Decodificador e Inspector JWT - Herramienta Online Gratis \| OneDevKit |
| `tools.jwt-decoder.metaDescription` | Free JWT decoder and inspector. Decode JSON Web Tokens to view header, payload, and signature. Debug authentication issues easily. | Decodificador e inspector JWT gratuito. Decodifica JSON Web Tokens para ver header, payload y firma. |
| `tools.jwt-decoder.keywords` | jwt decoder, jwt debugger, json web token decoder, jwt parser, decode jwt online, jwt inspector | decodificador jwt, depurador jwt, decodificador json web token, parser jwt, decodificar jwt online, inspector jwt |
| `tools.jwt-decoder.howTo.title` | How to Use | Cómo Usar |
| `tools.jwt-decoder.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.jwt-decoder.faq` | [object Object],[object Object] | [object Object],[object Object] |
| `tools.password-generator.name` | Password Generator | Generador de Contraseñas |
| `tools.password-generator.fullName` | Password Generator | Generador de Contraseñas |
| `tools.password-generator.description` | Generate secure, random passwords for your accounts. Cryptographically secure with customizable options. | Genera contraseñas seguras y aleatorias para tus cuentas. Criptográficamente seguro con opciones personalizables. |
| `tools.password-generator.shortDescription` | Secure random passwords | Contraseñas aleatorias seguras |
| `tools.password-generator.metaTitle` | Password Generator - Create Strong Passwords \| OneDevKit | Generador de Contraseñas - Crea Contraseñas Seguras \| OneDevKit |
| `tools.password-generator.metaDescription` | Generate secure, random passwords instantly. Customize length and character types. Cryptographically secure random generation. | Genera contraseñas seguras y aleatorias al instante. Personaliza longitud y tipos de caracteres. |
| `tools.password-generator.keywords` | password generator, random password, secure password generator, strong password creator, generate password online | generador de contraseñas, contraseña aleatoria, generador de contraseñas seguras, creador de contraseñas fuertes, generar contraseña online |
| `tools.password-generator.howTo.title` | How to Use | Cómo Usar |
| `tools.password-generator.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.password-generator.faq` | [object Object],[object Object] | [object Object],[object Object] |
| `tools.uuid-generator.name` | UUID Generator | Generador UUID |
| `tools.uuid-generator.fullName` | UUID Generator | Generador UUID |
| `tools.uuid-generator.description` | Generate random UUIDs (v4) instantly. Create unique identifiers for databases, APIs, and applications. | Genera UUIDs aleatorios (v4) al instante. Crea identificadores únicos para bases de datos, APIs y aplicaciones. |
| `tools.uuid-generator.shortDescription` | Generate unique IDs | Genera IDs únicos |
| `tools.uuid-generator.metaTitle` | UUID Generator - Generate Random UUIDs \| OneDevKit | Generador UUID - Genera UUIDs Aleatorios \| OneDevKit |
| `tools.uuid-generator.metaDescription` | Generate random UUID v4 identifiers instantly. Create unique IDs for databases, APIs, and applications. Bulk generation supported. | Genera identificadores UUID v4 aleatorios al instante. Crea IDs únicos para bases de datos y APIs. |
| `tools.uuid-generator.keywords` | uuid generator, guid generator, random uuid, uuid v4, unique id generator, generate uuid online | generador uuid, generador guid, uuid aleatorio, uuid v4, generador de id único, generar uuid online |
| `tools.uuid-generator.howTo.title` | How to Use | Cómo Usar |
| `tools.uuid-generator.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.uuid-generator.faq` | [object Object],[object Object] | [object Object],[object Object] |
| `tools.hash-generator.name` | Hash Generator | Generador de Hash |
| `tools.hash-generator.fullName` | Hash Generator | Generador de Hash |
| `tools.hash-generator.description` | Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text. Useful for checksums and data integrity verification. | Genera hashes MD5, SHA-1, SHA-256 y SHA-512 desde texto. Útil para checksums y verificación de integridad. |
| `tools.hash-generator.shortDescription` | MD5, SHA-1, SHA-256 hashes | Hashes MD5, SHA-1, SHA-256 |
| `tools.hash-generator.metaTitle` | Hash Generator - MD5, SHA-1, SHA-256, SHA-512 \| OneDevKit | Generador de Hash - MD5, SHA-1, SHA-256, SHA-512 \| OneDevKit |
| `tools.hash-generator.metaDescription` | Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text. Free online hash generator for checksums and data integrity. | Genera hashes MD5, SHA-1, SHA-256 y SHA-512 desde texto. Generador de hash online gratuito. |
| `tools.hash-generator.keywords` | hash generator, md5 generator, sha256 generator, sha1 hash, sha512 online, checksum generator, hash calculator | generador de hash, generador md5, generador sha256, hash sha1, sha512 online, generador de checksum, calculadora de hash |
| `tools.hash-generator.howTo.title` | How to Use | Cómo Usar |
| `tools.hash-generator.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.hash-generator.faq` | [object Object],[object Object] | [object Object],[object Object] |
| `tools.lorem-ipsum.name` | Lorem Ipsum | Lorem Ipsum |
| `tools.lorem-ipsum.fullName` | Lorem Ipsum Generator | Generador Lorem Ipsum |
| `tools.lorem-ipsum.description` | Generate placeholder text for your designs, mockups, and prototypes in paragraphs, sentences, or words. | Genera texto de relleno para tus diseños, maquetas y prototipos en párrafos, oraciones o palabras. |
| `tools.lorem-ipsum.shortDescription` | Placeholder text | Texto de relleno |
| `tools.lorem-ipsum.metaTitle` | Lorem Ipsum Generator - Placeholder Text \| OneDevKit | Generador Lorem Ipsum - Texto de Relleno \| OneDevKit |
| `tools.lorem-ipsum.metaDescription` | Generate Lorem Ipsum placeholder text for designs and mockups. Choose paragraphs, sentences, or words. | Genera texto de relleno Lorem Ipsum para diseños y maquetas. Elige párrafos, oraciones o palabras. |
| `tools.lorem-ipsum.keywords` | lorem ipsum generator, placeholder text, dummy text generator, lipsum, sample text generator | generador lorem ipsum, texto de relleno, generador de texto ficticio, lipsum, generador de texto de ejemplo |
| `tools.lorem-ipsum.howTo.title` | How to Use | Cómo Usar |
| `tools.lorem-ipsum.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.lorem-ipsum.faq` | [object Object] | [object Object] |
| `tools.qr-code-generator.name` | QR Code Generator | Generador QR |
| `tools.qr-code-generator.fullName` | QR Code Generator | Generador de Códigos QR |
| `tools.qr-code-generator.description` | Generate QR codes for URLs, text, and other data. Create scannable codes that work with any smartphone. | Genera códigos QR para URLs, texto y otros datos. Crea códigos escaneables que funcionan con cualquier smartphone. |
| `tools.qr-code-generator.shortDescription` | Create QR codes | Crea códigos QR |
| `tools.qr-code-generator.metaTitle` | QR Code Generator - Create Free QR Codes \| OneDevKit | Generador de Códigos QR - Crea Códigos QR Gratis \| OneDevKit |
| `tools.qr-code-generator.metaDescription` | Generate QR codes for URLs, text, WiFi, and more. Free QR code generator with customizable colors and sizes. | Genera códigos QR para URLs, texto, WiFi y más. Generador de códigos QR gratuito con colores personalizables. |
| `tools.qr-code-generator.keywords` | qr code generator, create qr code, qr code maker, free qr code, generate qr code online, qr code creator | generador de códigos qr, crear código qr, creador de códigos qr, código qr gratis, generar código qr online, creador qr |
| `tools.qr-code-generator.howTo.title` | How to Use | Cómo Usar |
| `tools.qr-code-generator.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.qr-code-generator.faq` | [object Object],[object Object] | [object Object],[object Object] |
| `tools.timestamp-converter.name` | Timestamp Converter | Convertidor Timestamp |
| `tools.timestamp-converter.fullName` | Unix Timestamp Converter | Convertidor de Timestamp Unix |
| `tools.timestamp-converter.description` | Convert Unix timestamps to human-readable dates and vice versa. Supports multiple date formats and timezones. | Convierte timestamps Unix a fechas legibles y viceversa. Soporta múltiples formatos de fecha y zonas horarias. |
| `tools.timestamp-converter.shortDescription` | Unix time ↔ Date | Tiempo Unix ↔ Fecha |
| `tools.timestamp-converter.metaTitle` | Unix Timestamp Converter - Date to Timestamp \| OneDevKit | Convertidor de Timestamp Unix - Fecha a Timestamp \| OneDevKit |
| `tools.timestamp-converter.metaDescription` | Convert Unix timestamps to human-readable dates and vice versa. Support for multiple date formats and timezones. | Convierte timestamps Unix a fechas legibles y viceversa. Soporte para múltiples formatos y zonas horarias. |
| `tools.timestamp-converter.keywords` | unix timestamp converter, epoch converter, timestamp to date, date to timestamp, unix time converter | convertidor timestamp unix, convertidor epoch, timestamp a fecha, fecha a timestamp, convertidor tiempo unix |
| `tools.timestamp-converter.howTo.title` | How to Use | Cómo Usar |
| `tools.timestamp-converter.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.timestamp-converter.faq` | [object Object] | [object Object] |
| `tools.regex-tester.name` | Regex Tester | Probador Regex |
| `tools.regex-tester.fullName` | Regex Tester & Debugger | Probador y Depurador Regex |
| `tools.regex-tester.description` | Test and debug regular expressions in real-time. See matches highlighted, capture groups, and detailed explanations. | Prueba y depura expresiones regulares en tiempo real. Ve coincidencias resaltadas, grupos de captura y explicaciones detalladas. |
| `tools.regex-tester.shortDescription` | Test regex patterns | Prueba patrones regex |
| `tools.regex-tester.metaTitle` | Regex Tester & Debugger - Test Regular Expressions \| OneDevKit | Probador y Depurador Regex - Prueba Expresiones Regulares \| OneDevKit |
| `tools.regex-tester.metaDescription` | Test and debug regular expressions in real-time. See matches highlighted with capture groups. Free online regex tester. | Prueba y depura expresiones regulares en tiempo real. Ve coincidencias resaltadas con grupos de captura. |
| `tools.regex-tester.keywords` | regex tester, regular expression tester, regex debugger, regex validator, test regex online, regex checker | probador regex, probador de expresiones regulares, depurador regex, validador regex, probar regex online, verificador regex |
| `tools.regex-tester.howTo.title` | How to Use | Cómo Usar |
| `tools.regex-tester.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.regex-tester.faq` | [object Object] | [object Object] |
| `tools.color-picker.name` | Color Picker | Selector de Color |
| `tools.color-picker.fullName` | Color Picker & Converter | Selector y Convertidor de Color |
| `tools.color-picker.description` | Pick colors and convert between HEX, RGB, HSL, and HSV formats. Generate color palettes and copy values instantly. | Selecciona colores y convierte entre formatos HEX, RGB, HSL y HSV. Genera paletas de colores y copia valores al instante. |
| `tools.color-picker.shortDescription` | HEX, RGB, HSL converter | Convertidor HEX, RGB, HSL |
| `tools.color-picker.metaTitle` | Color Picker & Converter - HEX, RGB, HSL \| OneDevKit | Selector y Convertidor de Color - HEX, RGB, HSL \| OneDevKit |
| `tools.color-picker.metaDescription` | Pick colors and convert between HEX, RGB, HSL, and HSV formats. Generate color palettes for your designs. | Selecciona colores y convierte entre formatos HEX, RGB, HSL y HSV. Genera paletas para tus diseños. |
| `tools.color-picker.keywords` | color picker, hex to rgb, rgb to hex, color converter, hsl converter, color palette generator | selector de color, hex a rgb, rgb a hex, convertidor de color, convertidor hsl, generador de paleta de colores |
| `tools.color-picker.howTo.title` | How to Use | Cómo Usar |
| `tools.color-picker.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.color-picker.faq` | [object Object] | [object Object] |
| `tools.diff-checker.name` | Diff Checker | Comparador Diff |
| `tools.diff-checker.fullName` | Text Diff Checker | Comparador de Texto Diff |
| `tools.diff-checker.description` | Compare two texts and see the differences highlighted. Find additions, deletions, and modifications instantly. | Compara dos textos y ve las diferencias resaltadas. Encuentra adiciones, eliminaciones y modificaciones al instante. |
| `tools.diff-checker.shortDescription` | Compare text differences | Compara diferencias de texto |
| `tools.diff-checker.metaTitle` | Diff Checker - Compare Text Online \| OneDevKit | Comparador Diff - Compara Texto Online \| OneDevKit |
| `tools.diff-checker.metaDescription` | Compare two texts and see differences highlighted. Find additions, deletions, and changes. Free online diff tool. | Compara dos textos y ve las diferencias resaltadas. Encuentra adiciones, eliminaciones y cambios. |
| `tools.diff-checker.keywords` | diff checker, text compare, compare text online, diff tool, text difference, compare files online | comparador diff, comparar texto, comparar texto online, herramienta diff, diferencia de texto, comparar archivos online |
| `tools.diff-checker.howTo.title` | How to Use | Cómo Usar |
| `tools.diff-checker.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.diff-checker.faq` | [object Object] | [object Object] |
| `tools.markdown-preview.name` | Markdown Preview | Vista Markdown |
| `tools.markdown-preview.fullName` | Markdown Editor & Preview | Editor y Vista Previa Markdown |
| `tools.markdown-preview.description` | Write Markdown and see live preview. Supports GitHub Flavored Markdown with syntax highlighting and export options. | Escribe Markdown y ve la vista previa en vivo. Soporta GitHub Flavored Markdown con resaltado de sintaxis y opciones de exportación. |
| `tools.markdown-preview.shortDescription` | Live Markdown preview | Vista previa Markdown en vivo |
| `tools.markdown-preview.metaTitle` | Markdown Editor & Preview - Live Preview \| OneDevKit | Editor y Vista Previa Markdown - Vista Previa en Vivo \| OneDevKit |
| `tools.markdown-preview.metaDescription` | Write Markdown with live preview. Supports GitHub Flavored Markdown, tables, code blocks, and more. | Escribe Markdown con vista previa en vivo. Soporta GitHub Flavored Markdown, tablas, bloques de código y más. |
| `tools.markdown-preview.keywords` | markdown editor, markdown preview, markdown online, github markdown, markdown to html, md editor | editor markdown, vista previa markdown, markdown online, github markdown, markdown a html, editor md |
| `tools.markdown-preview.howTo.title` | How to Use | Cómo Usar |
| `tools.markdown-preview.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.markdown-preview.faq` | [object Object] | [object Object] |
| `tools.word-counter.name` | Word Counter | Contador de Palabras |
| `tools.word-counter.fullName` | Word Counter | Contador de Palabras |
| `tools.word-counter.description` | Count words, characters, sentences, and paragraphs instantly. Get reading time and speaking time estimates. | Cuenta palabras, caracteres, oraciones y párrafos al instante. Obtén estimaciones de tiempo de lectura y habla. |
| `tools.word-counter.shortDescription` | Count words & characters | Cuenta palabras y caracteres |
| `tools.word-counter.metaTitle` | Word Counter - Count Words & Characters \| OneDevKit | Contador de Palabras - Cuenta Palabras y Caracteres \| OneDevKit |
| `tools.word-counter.metaDescription` | Count words, characters, sentences, and paragraphs instantly. Get reading and speaking time estimates. Free online word counter. | Cuenta palabras, caracteres, oraciones y párrafos al instante. Obtén estimaciones de tiempo de lectura. |
| `tools.word-counter.keywords` | word counter, character count, word count online, letter counter, text counter, count words in text | contador de palabras, contador de caracteres, cuenta palabras online, contador de letras, contador de texto, contar palabras en texto |
| `tools.word-counter.howTo.title` | How to Use | Cómo Usar |
| `tools.word-counter.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.word-counter.faq` | [object Object],[object Object] | [object Object],[object Object] |
| `tools.case-converter.name` | Case Converter | Convertidor de Texto |
| `tools.case-converter.fullName` | Text Case Converter | Convertidor de Mayúsculas/Minúsculas |
| `tools.case-converter.description` | Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more. | Convierte texto entre MAYÚSCULAS, minúsculas, Título, camelCase, snake_case, kebab-case y más. |
| `tools.case-converter.shortDescription` | Change text case | Cambia formato de texto |
| `tools.case-converter.metaTitle` | Case Converter - Change Text Case \| OneDevKit | Convertidor de Texto - Cambia Formato de Texto \| OneDevKit |
| `tools.case-converter.metaDescription` | Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more. Free online case converter. | Convierte texto entre MAYÚSCULAS, minúsculas, Título, camelCase, snake_case y más. |
| `tools.case-converter.keywords` | case converter, uppercase to lowercase, title case converter, camelcase converter, snake case, text case changer | convertidor de texto, mayúsculas a minúsculas, convertidor tipo título, convertidor camelcase, snake case, cambiador de formato de texto |
| `tools.case-converter.howTo.title` | How to Use | Cómo Usar |
| `tools.case-converter.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.case-converter.faq` | [object Object] | [object Object] |
| `tools.image-compressor.name` | Image Compressor | Compresor de Imágenes |
| `tools.image-compressor.fullName` | Image Compressor to Specific KB | Compresor de Imágenes a KB Específico |
| `tools.image-compressor.description` | Compress images to exact file size (20KB, 50KB, 100KB). Perfect for passport photos, job applications, and government forms. | Comprime imágenes a tamaño exacto (20KB, 50KB, 100KB). Perfecto para fotos de pasaporte, solicitudes de empleo y formularios gubernamentales. |
| `tools.image-compressor.shortDescription` | Compress to exact KB | Comprime a KB exactos |
| `tools.image-compressor.metaTitle` | Image Compressor to Specific KB Size \| OneDevKit | Compresor de Imágenes a KB Específico \| OneDevKit |
| `tools.image-compressor.metaDescription` | Compress images to exact file size - 20KB, 50KB, 100KB. Perfect for passport photos, job applications, and government forms. Free, private. | Comprime imágenes a tamaño exacto - 20KB, 50KB, 100KB. Perfecto para fotos de pasaporte y formularios. Gratis y privado. |
| `tools.image-compressor.keywords` | image compressor, compress image to 20kb, compress image to 50kb, reduce image size, image size reducer, compress photo online | compresor de imágenes, comprimir imagen a 20kb, comprimir imagen a 50kb, reducir tamaño de imagen, reductor de tamaño de imagen, comprimir foto online |
| `tools.image-compressor.howTo.title` | How to Use | Cómo Usar |
| `tools.image-compressor.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.image-compressor.faq` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.passport-photo.name` | Passport Photo | Foto Pasaporte |
| `tools.passport-photo.fullName` | Passport Photo Maker | Creador de Fotos de Pasaporte |
| `tools.passport-photo.description` | Create passport and visa photos for any country. Resize to exact dimensions and compress to required file size. | Crea fotos de pasaporte y visa para cualquier país. Redimensiona a dimensiones exactas y comprime al tamaño requerido. |
| `tools.passport-photo.shortDescription` | Passport & visa photos | Fotos pasaporte y visa |
| `tools.passport-photo.metaTitle` | Passport Photo Maker - Create Passport Photos \| OneDevKit | Creador de Fotos de Pasaporte - Crea Fotos de Pasaporte \| OneDevKit |
| `tools.passport-photo.metaDescription` | Create passport and visa photos for any country. Resize to exact dimensions (2x2 inches, 35x45mm). Free passport photo maker. | Crea fotos de pasaporte y visa para cualquier país. Redimensiona a dimensiones exactas (2x2 pulgadas, 35x45mm). |
| `tools.passport-photo.keywords` | passport photo maker, passport photo size, visa photo, 2x2 passport photo, 35x45mm photo, passport photo online | creador foto pasaporte, tamaño foto pasaporte, foto visa, foto pasaporte 2x2, foto 35x45mm, foto pasaporte online |
| `tools.passport-photo.howTo.title` | How to Use | Cómo Usar |
| `tools.passport-photo.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.passport-photo.faq` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.social-media-resizer.name` | Social Media Resizer | Redimensionador Social |
| `tools.social-media-resizer.fullName` | Social Media Image Resizer | Redimensionador de Imágenes para Redes Sociales |
| `tools.social-media-resizer.description` | Resize images for Instagram, LinkedIn, Twitter, Facebook, YouTube, Pinterest, TikTok, Snapchat, Discord, Twitch, Threads, WhatsApp. Batch processing, custom sizes, background fill. | Redimensiona imágenes para Instagram, LinkedIn, Twitter, Facebook, YouTube, Pinterest, TikTok, Snapchat, Discord, Twitch, Threads, WhatsApp. Procesamiento por lotes, tamaños personalizados, relleno de fondo. |
| `tools.social-media-resizer.shortDescription` | Instagram, LinkedIn, Twitter sizes | Tamaños Instagram, LinkedIn, Twitter |
| `tools.social-media-resizer.metaTitle` | Social Media Image Resizer - Instagram, Facebook, Twitter \| OneDevKit | Redimensionador de Imágenes para Redes Sociales - Instagram, Facebook, Twitter \| OneDevKit |
| `tools.social-media-resizer.metaDescription` | Resize images for all social media platforms. Instagram, Facebook, LinkedIn, Twitter, YouTube, TikTok, and more. Free with batch processing. | Redimensiona imágenes para todas las redes sociales. Instagram, Facebook, LinkedIn, Twitter, YouTube, TikTok y más. |
| `tools.social-media-resizer.keywords` | social media image resizer, instagram photo size, linkedin image size, twitter image dimensions, facebook cover photo size, resize image for social media | redimensionador redes sociales, tamaño foto instagram, tamaño imagen linkedin, dimensiones imagen twitter, tamaño portada facebook, redimensionar imagen para redes sociales |
| `tools.social-media-resizer.howTo.title` | How to Use | Cómo Usar |
| `tools.social-media-resizer.howTo.steps` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `tools.social-media-resizer.faq` | [object Object],[object Object],[object Object] | [object Object],[object Object],[object Object] |
| `pages.404.title` | Page Not Found | Página No Encontrada |
| `pages.404.metaDescription` | The page you're looking for doesn't exist. Return to OneDevKit's free online developer tools. | La página que buscas no existe. Vuelve a las herramientas de desarrollador de OneDevKit. |
| `pages.404.keywords` | 404, page not found, error | 404, página no encontrada, error |
| `pages.404.description` | Sorry, the page you're looking for doesn't exist or has been moved. | Lo sentimos, la página que buscas no existe o ha sido movida. |
| `pages.404.goHome` | Go Home | Ir al Inicio |
| `pages.404.reportIssue` | Report Issue | Reportar Problema |
| `pages.home.title` | Free Online Developer Tools | Herramientas de Desarrollador Gratis |
| `pages.home.metaDescription` | A collection of free, privacy-focused developer tools. All processing happens in your browser - no data is sent to servers. | Colección de herramientas de desarrollo gratuitas y enfocadas en la privacidad. Todo el procesamiento ocurre en tu navegador. |
| `pages.home.keywords` | developer tools, online tools, JSON formatter, Base64 encoder, URL encoder, JWT decoder, hash generator, password generator, UUID generator, free tools | herramientas de desarrollador, herramientas online, formateador JSON, codificador Base64, herramientas gratis |
| `pages.home.heroTitle` | Free Online Developer Tools | Herramientas de Desarrollador Gratis |
| `pages.home.heroDescription` | Fast, privacy-focused tools for everyday development tasks. No signup required. | Herramientas rápidas y enfocadas en la privacidad para tareas de desarrollo. Sin registro. |
| `pages.home.availableTools` | Available Tools | Herramientas Disponibles |
| `pages.home.whyChoose` | Why Choose OneDevKit? | ¿Por qué elegir OneDevKit? |
| `pages.home.features.privacy.title` | Privacy First | Privacidad Primero |
| `pages.home.features.privacy.description` | All tools run entirely in your browser. Your data never leaves your device. | Todas las herramientas funcionan en tu navegador. Tus datos nunca salen de tu dispositivo. |
| `pages.home.features.fast.title` | Lightning Fast | Ultra Rápido |
| `pages.home.features.fast.description` | No server requests needed. Get instant results with every action. | Sin solicitudes al servidor. Obtén resultados instantáneos. |
| `pages.home.features.free.title` | 100% Free | 100% Gratis |
| `pages.home.features.free.description` | No subscriptions, no signups, no hidden costs. Just free tools. | Sin suscripciones, sin registros, sin costos ocultos. Solo herramientas gratis. |
| `pages.home.features.responsive.title` | Works Everywhere | Funciona en Todos Lados |
| `pages.home.features.responsive.description` | Responsive design works on desktop, tablet, and mobile devices. | Diseño responsivo para escritorio, tablet y móvil. |
| `pages.about.title` | About OneDevKit | Acerca de OneDevKit |
| `pages.about.metaDescription` | Learn about OneDevKit - free, privacy-focused developer tools that run entirely in your browser. | Conoce OneDevKit - herramientas de desarrollo gratuitas y enfocadas en la privacidad. |
| `pages.about.keywords` | about onedevkit, developer tools, free online tools, privacy-focused tools | acerca de onedevkit, herramientas de desarrollador, herramientas gratis |
| `pages.about.heading` | About OneDevKit | Acerca de OneDevKit |
| `pages.about.mission.title` | Our Mission | Nuestra Misión |
| `pages.about.mission.text1` | OneDevKit was created with a simple mission: to provide developers with free, fast, and privacy-focused tools for everyday tasks. We believe that essential developer utilities should be accessible to everyone, regardless of budget or technical expertise. | OneDevKit fue creado con una misión simple: proporcionar a los desarrolladores herramientas gratuitas, rápidas y enfocadas en la privacidad para tareas cotidianas. Creemos que las utilidades esenciales para desarrolladores deben ser accesibles para todos, independientemente del presupuesto o experiencia técnica. |
| `pages.about.mission.text2` | Every tool on OneDevKit runs entirely in your browser. Your data never leaves your device, and we don't track, store, or sell any information you enter into our tools. | Cada herramienta en OneDevKit se ejecuta completamente en tu navegador. Tus datos nunca salen de tu dispositivo, y no rastreamos, almacenamos ni vendemos ninguna información que ingreses en nuestras herramientas. |
| `pages.about.whyBuilt.title` | Why We Built This | Por Qué Creamos Esto |
| `pages.about.whyBuilt.intro` | As developers ourselves, we were frustrated with existing online tools that: | Como desarrolladores, estábamos frustrados con las herramientas online existentes que: |
| `pages.about.whyBuilt.items` | Required unnecessary signups or subscriptions,Sent your data to remote servers,Were cluttered with intrusive ads,Loaded slowly with excessive JavaScript,Didn't work well on mobile devices | Requerían registros o suscripciones innecesarias,Enviaban tus datos a servidores remotos,Estaban llenas de anuncios intrusivos,Cargaban lentamente con JavaScript excesivo,No funcionaban bien en dispositivos móviles |
| `pages.about.whyBuilt.conclusion` | We set out to build the toolkit we wished existed: simple, fast, private, and free. | Nos propusimos construir el kit de herramientas que deseábamos: simple, rápido, privado y gratuito. |
| `pages.about.ourTools.title` | Our Tools | Nuestras Herramientas |
| `pages.about.ourTools.intro` | We currently offer the following free developer tools: | Actualmente ofrecemos las siguientes herramientas gratuitas para desarrolladores: |
| `pages.about.ourTools.moreComing` | More tools are coming soon. Have a suggestion? | Próximamente más herramientas. ¿Tienes alguna sugerencia? |
| `pages.about.privacyCommitment.title` | Privacy Commitment | Compromiso de Privacidad |
| `pages.about.privacyCommitment.intro` | Privacy isn't just a feature for us - it's a core principle. Here's what that means: | La privacidad no es solo una característica para nosotros - es un principio fundamental. Esto es lo que significa: |
| `pages.about.privacyCommitment.items` | [object Object],[object Object],[object Object],[object Object],[object Object] | [object Object],[object Object],[object Object],[object Object],[object Object] |
| `pages.about.privacyCommitment.readMore` | Read our full | Lee nuestra |
| `pages.about.contactSection.title` | Contact Us | Contáctanos |
| `pages.about.contactSection.text` | We'd love to hear from you! Whether you have feedback, suggestions, or just want to say hello, feel free to | ¡Nos encantaría saber de ti! Ya sea que tengas comentarios, sugerencias o simplemente quieras saludar, no dudes en |
| `pages.about.letUsKnow` | Let us know | Háznoslo saber |
| `pages.about.getInTouch` | get in touch | ponerte en contacto |
| `pages.contact.title` | Contact Us | Contáctanos |
| `pages.contact.metaDescription` | Get in touch with the OneDevKit team. We'd love to hear your feedback and suggestions. | Ponte en contacto con el equipo de OneDevKit. Nos encantaría escuchar tus comentarios. |
| `pages.contact.keywords` | contact onedevkit, feedback, support, suggestions | contacto onedevkit, comentarios, soporte |
| `pages.contact.heading` | Contact Us | Contáctanos |
| `pages.contact.intro` | We'd love to hear from you! Whether you have questions, suggestions, or feedback about OneDevKit, don't hesitate to reach out. | ¡Nos encantaría saber de ti! Ya sea que tengas preguntas, sugerencias o comentarios sobre OneDevKit, no dudes en comunicarte. |
| `pages.contact.getInTouch` | Get in Touch | Ponte en Contacto |
| `pages.contact.email.title` | Email | Correo Electrónico |
| `pages.contact.email.description` | Best for detailed questions or feedback | Ideal para preguntas detalladas o comentarios |
| `pages.contact.twitter.description` | Follow us for updates and quick questions | Síguenos para actualizaciones y preguntas rápidas |
| `pages.contact.topics.title` | What Can We Help With? | ¿En Qué Podemos Ayudarte? |
| `pages.contact.topics.suggestions.title` | Tool Suggestions: | Sugerencias de Herramientas: |
| `pages.contact.topics.suggestions.text` | Have an idea for a new developer tool? We're always looking to expand our toolkit. | ¿Tienes una idea para una nueva herramienta? Siempre buscamos expandir nuestro kit. |
| `pages.contact.topics.bugs.title` | Bug Reports: | Reportes de Errores: |
| `pages.contact.topics.bugs.text` | Found something that's not working correctly? Let us know and we'll fix it. | ¿Encontraste algo que no funciona correctamente? Avísanos y lo arreglaremos. |
| `pages.contact.topics.features.title` | Feature Requests: | Solicitudes de Funciones: |
| `pages.contact.topics.features.text` | Want to see improvements to existing tools? Share your ideas. | ¿Quieres ver mejoras en las herramientas existentes? Comparte tus ideas. |
| `pages.contact.topics.feedback.title` | General Feedback: | Comentarios Generales: |
| `pages.contact.topics.feedback.text` | Any thoughts about your experience using OneDevKit. | Cualquier opinión sobre tu experiencia usando OneDevKit. |
| `pages.contact.topics.partnership.title` | Partnership Inquiries: | Consultas de Asociación: |
| `pages.contact.topics.partnership.text` | Interested in collaborating or integrating with OneDevKit. | ¿Interesado en colaborar o integrar con OneDevKit? |
| `pages.contact.response.title` | Response Time | Tiempo de Respuesta |
| `pages.contact.response.text` | We typically respond to emails within 24-48 hours during weekdays. For urgent matters, please mention "URGENT" in your subject line. | Normalmente respondemos a los correos en 24-48 horas durante días laborables. Para asuntos urgentes, menciona "URGENTE" en el asunto. |
| `pages.contact.beforeReach.title` | Before Reaching Out | Antes de Contactarnos |
| `pages.contact.beforeReach.text` | You might find your answer in one of these resources: | Podrías encontrar tu respuesta en uno de estos recursos: |
| `pages.contact.beforeReach.faq` | Common questions and answers | Preguntas y respuestas comunes |
| `pages.contact.beforeReach.about` | Learn more about OneDevKit | Conoce más sobre OneDevKit |
| `pages.contact.beforeReach.privacy` | How we handle your data | Cómo manejamos tus datos |
| `pages.faq.title` | Frequently Asked Questions | Preguntas Frecuentes |
| `pages.faq.metaDescription` | Common questions about OneDevKit tools. Learn how our privacy-focused developer tools work. | Preguntas comunes sobre las herramientas de OneDevKit. |
| `pages.faq.keywords` | faq, help, questions, support | faq, ayuda, preguntas, soporte |
| `pages.faq.heading` | Frequently Asked Questions | Preguntas Frecuentes |
| `pages.faq.intro` | Find answers to common questions about OneDevKit and our developer tools. | Encuentra respuestas a preguntas comunes sobre OneDevKit y nuestras herramientas para desarrolladores. |
| `pages.faq.items` | [object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object] | [object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object] |
| `pages.faq.moreQuestions.title` | Still Have Questions? | ¿Aún Tienes Preguntas? |
| `pages.faq.moreQuestions.text` | If you couldn't find what you're looking for, feel free to | Si no encontraste lo que buscas, no dudes en |
| `pages.faq.moreQuestions.contactUs` | contact us | contactarnos |
| `pages.privacy.title` | Privacy Policy | Política de Privacidad |
| `pages.privacy.metaDescription` | OneDevKit privacy policy. Learn how we protect your privacy - all tools run in your browser. | Política de privacidad de OneDevKit. Todas las herramientas funcionan en tu navegador. |
| `pages.privacy.keywords` | privacy policy, data protection, GDPR, CCPA | política de privacidad, protección de datos |
| `pages.privacy.heading` | Privacy Policy | Política de Privacidad |
| `pages.privacy.lastUpdated` | Last Updated | Última Actualización |
| `pages.privacy.date` | December 2024 | Diciembre 2024 |
| `pages.privacy.overview.title` | Overview | Resumen |
| `pages.privacy.overview.text` | At OneDevKit, your privacy is our top priority. This Privacy Policy explains how we handle information when you use our website and tools. The short version: we collect almost nothing, and your data never leaves your browser. | En OneDevKit, tu privacidad es nuestra máxima prioridad. Esta Política de Privacidad explica cómo manejamos la información cuando usas nuestro sitio web y herramientas. La versión corta: casi no recolectamos nada, y tus datos nunca salen de tu navegador. |
| `pages.privacy.notCollected.title` | Information We Don't Collect | Información Que No Recolectamos |
| `pages.privacy.notCollected.intro` | We want to be crystal clear about what we don't collect: | Queremos ser absolutamente claros sobre lo que no recolectamos: |
| `pages.privacy.notCollected.personal.title` | Personal Information: | Información Personal: |
| `pages.privacy.notCollected.personal.text` | We don't ask for or store your name, email, or any identifying information | No pedimos ni almacenamos tu nombre, correo electrónico ni ninguna información identificable |
| `pages.privacy.notCollected.toolData.title` | Tool Input Data: | Datos de Herramientas: |
| `pages.privacy.notCollected.toolData.text` | Any data you enter into our tools (JSON, text, passwords, etc.) is processed entirely in your browser and never sent to our servers | Cualquier dato que ingreses en nuestras herramientas (JSON, texto, contraseñas, etc.) se procesa completamente en tu navegador y nunca se envía a nuestros servidores |
| `pages.privacy.notCollected.files.title` | Files: | Archivos: |
| `pages.privacy.notCollected.files.text` | Files you upload to our tools are never transferred to our servers | Los archivos que subes a nuestras herramientas nunca se transfieren a nuestros servidores |
| `pages.privacy.notCollected.passwords.title` | Passwords or Sensitive Data: | Contraseñas o Datos Sensibles: |
| `pages.privacy.notCollected.passwords.text` | We never see, store, or have access to any sensitive data you process using our tools | Nunca vemos, almacenamos ni tenemos acceso a ningún dato sensible que proceses usando nuestras herramientas |
| `pages.privacy.collected.title` | Information We May Collect | Información Que Podemos Recolectar |
| `pages.privacy.collected.intro` | We use privacy-respecting analytics to understand basic traffic patterns. This may include: | Usamos analíticas que respetan la privacidad para entender patrones básicos de tráfico. Esto puede incluir: |
| `pages.privacy.collected.pageViews.title` | Page Views: | Vistas de Página: |
| `pages.privacy.collected.pageViews.text` | Which pages are visited (without identifying who visited them) | Qué páginas se visitan (sin identificar quién las visitó) |
| `pages.privacy.collected.referrer.title` | Referrer: | Referente: |
| `pages.privacy.collected.referrer.text` | How you found our site (e.g., search engine, direct link) | Cómo encontraste nuestro sitio (ej. motor de búsqueda, enlace directo) |
| `pages.privacy.collected.device.title` | Device Type: | Tipo de Dispositivo: |
| `pages.privacy.collected.device.text` | General device category (desktop, mobile, tablet) | Categoría general del dispositivo (escritorio, móvil, tablet) |
| `pages.privacy.collected.country.title` | Country: | País: |
| `pages.privacy.collected.country.text` | Approximate geographic location at the country level | Ubicación geográfica aproximada a nivel de país |
| `pages.privacy.collected.note` | This data is aggregated and anonymous - we cannot identify individual users. | Estos datos son agregados y anónimos - no podemos identificar usuarios individuales. |
| `pages.privacy.howToolsWork.title` | How Our Tools Work | Cómo Funcionan Nuestras Herramientas |
| `pages.privacy.howToolsWork.intro` | All OneDevKit tools are designed with privacy in mind: | Todas las herramientas de OneDevKit están diseñadas con la privacidad en mente: |
| `pages.privacy.howToolsWork.browser.title` | Client-Side Processing: | Procesamiento en el Cliente: |
| `pages.privacy.howToolsWork.browser.text` | All tools run entirely in your browser using JavaScript | Todas las herramientas se ejecutan completamente en tu navegador usando JavaScript |
| `pages.privacy.howToolsWork.noServer.title` | No Server Communication: | Sin Comunicación con Servidor: |
| `pages.privacy.howToolsWork.noServer.text` | Data you enter is never sent to our servers or any third party | Los datos que ingresas nunca se envían a nuestros servidores ni a terceros |
| `pages.privacy.howToolsWork.noStorage.title` | No Storage: | Sin Almacenamiento: |
| `pages.privacy.howToolsWork.noStorage.text` | We don't store your input data anywhere - when you close the page, it's gone | No almacenamos tus datos de entrada en ningún lugar - cuando cierras la página, desaparecen |
| `pages.privacy.howToolsWork.inspect.title` | Verifiable: | Verificable: |
| `pages.privacy.howToolsWork.inspect.text` | You can inspect our code using your browser's developer tools to verify this | Puedes inspeccionar nuestro código usando las herramientas de desarrollador de tu navegador para verificar esto |
| `pages.privacy.cookies.title` | Cookies | Cookies |
| `pages.privacy.cookies.intro` | We use minimal cookies for essential functionality only: | Usamos cookies mínimas solo para funcionalidad esencial: |
| `pages.privacy.cookies.theme.title` | Theme Preference: | Preferencia de Tema: |
| `pages.privacy.cookies.theme.text` | Remembers your light/dark mode choice | Recuerda tu elección de modo claro/oscuro |
| `pages.privacy.cookies.language.title` | Language Preference: | Preferencia de Idioma: |
| `pages.privacy.cookies.language.text` | Remembers your preferred language | Recuerda tu idioma preferido |
| `pages.privacy.cookies.analytics.title` | Analytics (if enabled): | Analíticas (si están habilitadas): |
| `pages.privacy.cookies.analytics.text` | Anonymous analytics cookies that don't track personal information | Cookies de analíticas anónimas que no rastrean información personal |
| `pages.privacy.cookies.note` | We do not use advertising cookies, tracking pixels, or third-party marketing tools. | No usamos cookies publicitarias, píxeles de rastreo ni herramientas de marketing de terceros. |
| `pages.privacy.thirdParty.title` | Third-Party Services | Servicios de Terceros |
| `pages.privacy.thirdParty.intro` | We minimize the use of third-party services. When we do use them, we choose privacy-respecting options: | Minimizamos el uso de servicios de terceros. Cuando los usamos, elegimos opciones que respetan la privacidad: |
| `pages.privacy.thirdParty.hosting.title` | Hosting: | Alojamiento: |
| `pages.privacy.thirdParty.hosting.text` | Our site is hosted on secure, reputable infrastructure | Nuestro sitio está alojado en infraestructura segura y de buena reputación |
| `pages.privacy.thirdParty.analyticsService.title` | Analytics: | Analíticas: |
| `pages.privacy.thirdParty.analyticsService.text` | We use privacy-focused analytics that don't track individual users | Usamos analíticas enfocadas en la privacidad que no rastrean usuarios individuales |
| `pages.privacy.thirdParty.cdn.title` | CDN: | CDN: |
| `pages.privacy.thirdParty.cdn.text` | We may use content delivery networks to serve static assets quickly | Podemos usar redes de distribución de contenido para servir activos estáticos rápidamente |
| `pages.privacy.thirdParty.note` | We do not use social media widgets, advertising networks, or other tracking-heavy third-party services. | No usamos widgets de redes sociales, redes publicitarias ni otros servicios de terceros con mucho rastreo. |
| `pages.privacy.children.title` | Children's Privacy | Privacidad de Menores |
| `pages.privacy.children.text` | OneDevKit is a general-purpose developer tools website. We do not knowingly collect information from children under 13. Since we don't collect personal information from anyone, this is not a concern for our service. | OneDevKit es un sitio web de herramientas para desarrolladores de propósito general. No recolectamos conscientemente información de niños menores de 13 años. Como no recolectamos información personal de nadie, esto no es una preocupación para nuestro servicio. |
| `pages.privacy.changes.title` | Changes to This Policy | Cambios a Esta Política |
| `pages.privacy.changes.text` | We may update this Privacy Policy from time to time. When we make changes, we'll update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically. | Podemos actualizar esta Política de Privacidad de vez en cuando. Cuando hagamos cambios, actualizaremos la fecha de "Última Actualización" en la parte superior de esta página. Te animamos a revisar esta política periódicamente. |
| `pages.privacy.contactSection.title` | Contact Us | Contáctanos |
| `pages.privacy.contactSection.text` | If you have any questions about this Privacy Policy or our privacy practices, please contact us at | Si tienes alguna pregunta sobre esta Política de Privacidad o nuestras prácticas de privacidad, contáctanos en |
| `pages.terms.title` | Terms of Service | Términos de Servicio |
| `pages.terms.metaDescription` | OneDevKit terms of service. Read the terms for using our free developer tools. | Términos de servicio de OneDevKit para usar nuestras herramientas gratuitas. |
| `pages.terms.keywords` | terms of service, terms and conditions, legal | términos de servicio, condiciones legales |
| `pages.terms.heading` | Terms of Service | Términos de Servicio |
| `pages.terms.lastUpdated` | Last Updated | Última Actualización |
| `pages.terms.date` | December 2024 | Diciembre 2024 |
| `pages.terms.acceptance.title` | 1. Acceptance of Terms | 1. Aceptación de Términos |
| `pages.terms.acceptance.text` | By accessing and using OneDevKit ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. | Al acceder y usar OneDevKit ("el Servicio"), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con estos términos, por favor no uses nuestro Servicio. |
| `pages.terms.description.title` | 2. Description of Service | 2. Descripción del Servicio |
| `pages.terms.description.text` | OneDevKit provides free, browser-based developer tools for various purposes including text manipulation, encoding/decoding, formatting, and other utilities. All tools run entirely in your browser and do not require server-side processing of your data. | OneDevKit proporciona herramientas gratuitas para desarrolladores basadas en navegador para diversos propósitos incluyendo manipulación de texto, codificación/decodificación, formateo y otras utilidades. Todas las herramientas se ejecutan completamente en tu navegador y no requieren procesamiento del lado del servidor de tus datos. |
| `pages.terms.useOfService.title` | 3. Use of Service | 3. Uso del Servicio |
| `pages.terms.useOfService.intro` | You agree to use OneDevKit only for lawful purposes. You must not: | Aceptas usar OneDevKit solo para propósitos legales. No debes: |
| `pages.terms.useOfService.items` | Use the Service for any illegal or unauthorized purpose,Attempt to interfere with or disrupt the Service or servers,Attempt to access areas of the Service that you are not authorized to access,Use automated systems or software to extract data from the Service,Transmit any viruses, malware, or other harmful code | Usar el Servicio para cualquier propósito ilegal o no autorizado,Intentar interferir o interrumpir el Servicio o los servidores,Intentar acceder a áreas del Servicio a las que no estás autorizado a acceder,Usar sistemas automatizados o software para extraer datos del Servicio,Transmitir virus, malware u otro código dañino |
| `pages.terms.intellectual.title` | 4. Intellectual Property | 4. Propiedad Intelectual |
| `pages.terms.intellectual.text` | The Service and its original content, features, and functionality are owned by OneDevKit and are protected by international copyright, trademark, and other intellectual property laws. You may use our tools for personal and commercial purposes, but you may not copy, modify, or redistribute the website itself without permission. | El Servicio y su contenido original, características y funcionalidad son propiedad de OneDevKit y están protegidos por leyes internacionales de derechos de autor, marcas registradas y otras leyes de propiedad intelectual. Puedes usar nuestras herramientas para propósitos personales y comerciales, pero no puedes copiar, modificar o redistribuir el sitio web en sí sin permiso. |
| `pages.terms.userContent.title` | 5. User Content | 5. Contenido del Usuario |
| `pages.terms.userContent.intro` | Any data you enter into our tools remains entirely yours. Since all processing happens in your browser: | Cualquier dato que ingreses en nuestras herramientas sigue siendo completamente tuyo. Como todo el procesamiento ocurre en tu navegador: |
| `pages.terms.userContent.items` | We never see, access, or store your input data,You retain all rights to any content you process using our tools,You are responsible for ensuring you have the right to use any data you input | Nunca vemos, accedemos ni almacenamos tus datos de entrada,Retienes todos los derechos sobre cualquier contenido que proceses usando nuestras herramientas,Eres responsable de asegurar que tienes derecho a usar cualquier dato que ingreses |
| `pages.terms.disclaimer.title` | 6. Disclaimer of Warranties | 6. Descargo de Garantías |
| `pages.terms.disclaimer.intro` | The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that: | El Servicio se proporciona "tal cual" y "según disponibilidad" sin garantías de ningún tipo, ya sean expresas o implícitas. No garantizamos que: |
| `pages.terms.disclaimer.items` | The Service will be uninterrupted or error-free,The results from using our tools will be accurate or reliable,Any errors in the Service will be corrected | El Servicio será ininterrumpido o libre de errores,Los resultados de usar nuestras herramientas serán precisos o confiables,Cualquier error en el Servicio será corregido |
| `pages.terms.disclaimer.note` | You use the Service at your own risk. Always verify important results independently. | Usas el Servicio bajo tu propio riesgo. Siempre verifica los resultados importantes de forma independiente. |
| `pages.terms.limitation.title` | 7. Limitation of Liability | 7. Limitación de Responsabilidad |
| `pages.terms.limitation.intro` | To the fullest extent permitted by law, OneDevKit shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from: | En la máxima medida permitida por la ley, OneDevKit no será responsable por ningún daño indirecto, incidental, especial, consecuente o punitivo, ni por ninguna pérdida de beneficios o ingresos, ya sea incurrida directa o indirectamente, ni por ninguna pérdida de datos, uso, buena voluntad u otras pérdidas intangibles resultantes de: |
| `pages.terms.limitation.items` | Your use or inability to use the Service,Any unauthorized access to or use of our servers,Any errors or omissions in any content,Any other matter relating to the Service | Tu uso o incapacidad para usar el Servicio,Cualquier acceso no autorizado o uso de nuestros servidores,Cualquier error u omisión en cualquier contenido,Cualquier otro asunto relacionado con el Servicio |
| `pages.terms.changesToTerms.title` | 8. Changes to Terms | 8. Cambios a los Términos |
| `pages.terms.changesToTerms.text` | We reserve the right to modify these Terms of Service at any time. When we make changes, we will update the "Last Updated" date at the top of this page. Your continued use of the Service after any changes indicates your acceptance of the new terms. | Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Cuando hagamos cambios, actualizaremos la fecha de "Última Actualización" en la parte superior de esta página. Tu uso continuado del Servicio después de cualquier cambio indica tu aceptación de los nuevos términos. |
| `pages.terms.governing.title` | 9. Governing Law | 9. Ley Aplicable |
| `pages.terms.governing.text` | These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. | Estos Términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin tener en cuenta los principios de conflicto de leyes. |
| `pages.terms.contactSection.title` | 10. Contact Us | 10. Contáctanos |
| `pages.terms.contactSection.text` | If you have any questions about these Terms of Service, please contact us at | Si tienes alguna pregunta sobre estos Términos de Servicio, contáctanos en |
| `footer.company` | Company | Empresa |
| `footer.legal` | Legal | Legal |
| `footer.followUs` | Follow Us | Síguenos |
| `footer.allRightsReserved` | All rights reserved. | Todos los derechos reservados. |
| `footer.copyright` | © {year} OneDevKit. All rights reserved. | © {year} OneDevKit. Todos los derechos reservados. |
| `footer.disclaimer` | Tools provided "as is" without warranty. | Herramientas proporcionadas "tal cual" sin garantía. |
| `errors.404.title` | Page Not Found | Página No Encontrada |
| `errors.404.message` | The page you're looking for doesn't exist. | La página que buscas no existe. |
| `errors.404.cta` | Go Home | Ir al Inicio |
| `errors.generic.title` | Something went wrong | Algo salió mal |
| `errors.generic.message` | Please try again later. | Por favor, inténtalo de nuevo más tarde. |

---

**Total translations:** 560
**Generated:** 2025-12-23T07:35:32.591Z
