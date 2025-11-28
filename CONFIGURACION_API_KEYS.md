# Configuración de API Keys

## Error: "Provider not connected"

Si ves el error `Provider not connected` o `Set the GOOGLE_GENERATIVE_AI_API_KEY environment variable`, necesitas configurar las API keys en tu archivo `.env`.

## Pasos para Configurar

### 1. Editar el archivo `.env`

Abre el archivo `.env` en la raíz del proyecto y agrega tus API keys:

```env
# OpenAI API Key (requerido si usas modelos de OpenAI)
OPENAI_API_KEY=sk-tu-api-key-aqui

# Google Gemini API Key (requerido si usas modelos de Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=tu-api-key-de-gemini-aqui

# DeepSeek API Key (requerido si usas modelos de DeepSeek)
DEEPSEEK_API_KEY=tu-api-key-de-deepseek-aqui
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

### 2. Obtener API Keys

#### OpenAI
1. Ve a https://platform.openai.com/api-keys
2. Inicia sesión o crea una cuenta
3. Haz clic en "Create new secret key"
4. Copia la clave y pégala en `.env` como `OPENAI_API_KEY`

#### Google Gemini
1. Ve a https://aistudio.google.com/app/api-keys
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la clave y pégala en `.env` como `GOOGLE_GENERATIVE_AI_API_KEY`

#### DeepSeek (opcional)
1. Ve a https://platform.deepseek.com/api_keys
2. Inicia sesión o crea una cuenta
3. Crea una nueva API key
4. Copia la clave y pégala en `.env` como `DEEPSEEK_API_KEY`

### 3. Reiniciar el servidor

Después de agregar las API keys, **reinicia el servidor de desarrollo**:

```bash
# Detén el servidor (Ctrl+C) y vuelve a iniciarlo
npm run dev
```

## Modelos por Defecto

Los agentes están configurados para usar OpenAI por defecto. Si no tienes la API key de Gemini, no necesitas configurarla a menos que quieras usar modelos de Gemini.

### Modelos por defecto actuales:
- **Financial Agent**: `openai/gpt-4o`
- **Weather Agent**: `openai/gpt-4o-mini`

## Solución Rápida

Si solo quieres usar OpenAI y no tienes API key de Gemini:

1. Asegúrate de tener `OPENAI_API_KEY` en tu `.env`
2. No necesitas configurar `GOOGLE_GENERATIVE_AI_API_KEY` si no vas a usar Gemini
3. Los agentes usarán OpenAI automáticamente

## Verificar Configuración

Para verificar que tus API keys están configuradas correctamente:

```bash
# Verificar que el archivo .env existe y tiene las variables
cat .env

# O verificar una variable específica (en Linux/Mac)
echo $OPENAI_API_KEY
```

## Notas Importantes

- ⚠️ **Nunca subas tu archivo `.env` a Git** - ya está en `.gitignore`
- 🔒 Mantén tus API keys seguras y no las compartas
- 💰 Algunos proveedores cobran por uso, revisa sus planes de precios
- 🆓 Google Gemini ofrece un tier gratuito generoso

## Troubleshooting

### Error: "API key not configured"
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que las variables tienen el nombre correcto (sin espacios)
- Reinicia el servidor después de cambiar `.env`

### Error: "Invalid API key"
- Verifica que copiaste la API key completa
- Algunas API keys tienen prefijos (como `sk-` en OpenAI)
- Asegúrate de no tener espacios extra al inicio o final

### El servidor no detecta los cambios en `.env`
- Reinicia el servidor completamente
- Algunos servidores necesitan reiniciarse para cargar nuevas variables de entorno

