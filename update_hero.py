import re

# Leer el archivo CSS
with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar y reemplazar la sección del hero
old_hero = r'''\.hero \{
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var\(--gradient-primary\);
  color: var\(--color-white\);
  padding: var\(--spacing-xl\) var\(--spacing-md\);
  overflow: hidden;
\}

\.hero::before \{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    repeating-linear-gradient\(45deg, transparent, transparent 35px, rgba\(255, 255, 255, \.05\) 35px, rgba\(255, 255, 255, \.05\) 70px\);
  pointer-events: none;
\}'''

new_hero = '''.hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: 
    linear-gradient(rgba(45, 80, 22, 0.7), rgba(45, 80, 22, 0.7)),
    url('hero-background.png') center/cover no-repeat;
  color: var(--color-white);
  padding: var(--spacing-xl) var(--spacing-md);
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  pointer-events: none;
}'''

# Reemplazar
new_content = re.sub(old_hero, new_hero, content)

# Guardar
with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Hero actualizado con imagen de fondo del tejido romboidal!")
