import re

# Leer el archivo HTML
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Agregar enlaces CSS y JS en el head
head_insertion = '''    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="dark-mode.css">
    <script src="dark-mode.js" defer></script>
</head>'''

content = content.replace('    <link rel="stylesheet" href="styles.css">\n</head>', head_insertion)

# 2. Agregar botón toggle después del body
body_insertion = '''<body>
    <!-- TOGGLE MODO OSCURO -->
    <button id="theme-toggle" class="theme-toggle" onclick="toggleTheme()" aria-label="Cambiar tema">
        <span class="theme-toggle-icon">🌙</span>
        <span class="theme-toggle-text">Modo Oscuro</span>
    </button>

    <!-- HEADER -->'''

content = content.replace('<body>\n    <!-- HEADER -->', body_insertion)

# Guardar cambios
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ index.html actualizado con modo oscuro!")
