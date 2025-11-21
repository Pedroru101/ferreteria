import re

# Leer el archivo HTML actual
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Leer el nuevo contenido
with open('medidas-nuevas.html', 'r', encoding='utf-8') as f:
    new_section = f.read()

# Patrón para encontrar la sección de medidas disponibles
pattern = r'<!-- SECCIÓN 4: MEDIDAS DISPONIBLES -->.*?</section>'

# Reemplazar
new_content = re.sub(pattern, new_section.strip(), content, flags=re.DOTALL)

# Guardar
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Sección de medidas actualizada correctamente!")
