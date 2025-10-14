#!/usr/bin/env python3
"""
🚀 INSTALADOR AUTOMÁTICO DEL MODELO DE IMÁGENES
Instala todo lo necesario para el modelo de generación de imágenes automáticamente
"""

import os
import sys
import subprocess
import urllib.request
import json
import time
from pathlib import Path

class Colors:
    """Colores para la consola"""
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text):
    """Imprimir encabezado con estilo"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.WHITE}{text.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_step(step, text):
    """Imprimir paso con estilo"""
    print(f"{Colors.BOLD}{Colors.CYAN}[PASO {step}]{Colors.END} {Colors.WHITE}{text}{Colors.END}")

def print_success(text):
    """Imprimir mensaje de éxito"""
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_error(text):
    """Imprimir mensaje de error"""
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_warning(text):
    """Imprimir mensaje de advertencia"""
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")

def print_info(text):
    """Imprimir información"""
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.END}")

def run_command(command, description, check_success=True):
    """Ejecutar comando con feedback visual"""
    print(f"{Colors.PURPLE}🔄 {description}...{Colors.END}")
    
    try:
        if isinstance(command, str):
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
        else:
            result = subprocess.run(command, capture_output=True, text=True)
        
        if result.returncode == 0:
            print_success(f"{description} completado")
            return True, result.stdout
        else:
            if check_success:
                print_error(f"{description} falló")
                print(f"Error: {result.stderr}")
                return False, result.stderr
            else:
                return False, result.stderr
    except Exception as e:
        print_error(f"Error ejecutando {description}: {str(e)}")
        return False, str(e)

def check_python_version():
    """Verificar versión de Python"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print_success(f"Python {version.major}.{version.minor}.{version.micro} ✓")
        return True
    else:
        print_error(f"Python {version.major}.{version.minor}.{version.micro} - Se requiere Python 3.8+")
        return False

def check_ollama_installed():
    """Verificar si Ollama está instalado"""
    success, _ = run_command("ollama --version", "Verificando Ollama", False)
    return success

def install_ollama():
    """Instalar Ollama en Windows"""
    print_info("Descargando Ollama para Windows...")
    
    try:
        # URL de descarga de Ollama para Windows
        url = "https://ollama.com/download/windows"
        installer_path = "ollama-installer.exe"
        
        print(f"{Colors.PURPLE}📥 Descargando Ollama...{Colors.END}")
        urllib.request.urlretrieve(url, installer_path)
        
        print_info("Ejecutando instalador de Ollama...")
        print_warning("Se abrirá el instalador. Sigue las instrucciones y presiona Enter cuando termine.")
        
        # Ejecutar instalador
        subprocess.run([installer_path])
        
        input(f"{Colors.YELLOW}Presiona Enter cuando hayas completado la instalación de Ollama...{Colors.END}")
        
        # Limpiar
        if os.path.exists(installer_path):
            os.remove(installer_path)
        
        return check_ollama_installed()
        
    except Exception as e:
        print_error(f"Error instalando Ollama: {str(e)}")
        return False

def install_python_dependencies():
    """Instalar dependencias de Python"""
    dependencies = [
        "ollama",
        "requests",
        "pillow",
        "numpy",
        "sqlite3",  # Incluido en Python pero lo verificamos
    ]
    
    for dep in dependencies:
        if dep == "sqlite3":
            continue  # sqlite3 viene incluido
            
        success, _ = run_command(
            f"pip install {dep}",
            f"Instalando {dep}"
        )
        if not success:
            return False
    
    return True

def download_image_model():
    """Descargar modelo de imágenes con Ollama"""
    models_to_try = [
        "llava:latest",
        "llava:7b",
        "bakllava:latest"
    ]
    
    for model in models_to_try:
        print_info(f"Intentando descargar modelo: {model}")
        success, output = run_command(
            f"ollama pull {model}",
            f"Descargando modelo {model}",
            False
        )
        
        if success:
            print_success(f"Modelo {model} descargado exitosamente")
            return model
        else:
            print_warning(f"No se pudo descargar {model}, intentando siguiente...")
    
    print_error("No se pudo descargar ningún modelo de imágenes")
    return None

def create_image_processor():
    """Crear script procesador de imágenes"""
    script_content = '''#!/usr/bin/env python3
"""
🖼️ PROCESADOR AUTOMÁTICO DE IMÁGENES
Genera descripciones automáticas de imágenes de productos usando IA
"""

import ollama
import requests
import base64
import json
import sqlite3
from pathlib import Path

class ImageProcessor:
    def __init__(self, model_name="llava:latest"):
        self.model_name = model_name
        self.client = ollama.Client()
    
    def encode_image_url(self, image_url):
        """Descargar y codificar imagen desde URL"""
        try:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            return base64.b64encode(response.content).decode('utf-8')
        except Exception as e:
            print(f"Error descargando imagen {image_url}: {e}")
            return None
    
    def generate_description(self, image_url, product_name=None):
        """Generar descripción de imagen"""
        print(f"🔍 Procesando imagen: {image_url[:50]}...")
        
        # Codificar imagen
        image_b64 = self.encode_image_url(image_url)
        if not image_b64:
            return None
        
        # Crear prompt
        if product_name:
            prompt = f"""Describe esta imagen de producto "{product_name}" para una tienda en línea. 
            Incluye: características visuales, colores, materiales aparentes, y detalles que ayuden a los clientes.
            Responde en español, máximo 200 palabras."""
        else:
            prompt = """Describe esta imagen de producto para una tienda en línea. 
            Incluye: características visuales, colores, materiales aparentes, y detalles que ayuden a los clientes.
            Responde en español, máximo 200 palabras."""
        
        try:
            response = self.client.generate(
                model=self.model_name,
                prompt=prompt,
                images=[image_b64]
            )
            return response['response']
        except Exception as e:
            print(f"Error generando descripción: {e}")
            return None
    
    def process_database_images(self, db_path="database.db", limit=10):
        """Procesar imágenes de la base de datos"""
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Obtener productos con imágenes
        cursor.execute("""
            SELECT id, name, images 
            FROM Product 
            WHERE images IS NOT NULL 
            AND images != '[]'
            LIMIT ?
        """, (limit,))
        
        products = cursor.fetchall()
        processed = 0
        
        for product_id, name, images_str in products:
            try:
                images = json.loads(images_str)
                if images:
                    first_image = images[0]
                    description = self.generate_description(first_image, name)
                    
                    if description:
                        # Actualizar base de datos con descripción
                        cursor.execute("""
                            UPDATE Product 
                            SET ai_description = ? 
                            WHERE id = ?
                        """, (description, product_id))
                        
                        print(f"✅ Procesado: {name[:30]}...")
                        processed += 1
                    else:
                        print(f"❌ Error procesando: {name[:30]}...")
            
            except Exception as e:
                print(f"Error con producto {product_id}: {e}")
        
        conn.commit()
        conn.close()
        
        print(f"\\n📊 Procesados {processed} de {len(products)} productos")

if __name__ == "__main__":
    processor = ImageProcessor()
    processor.process_database_images()
'''
    
    with open("image_processor.py", "w", encoding="utf-8") as f:
        f.write(script_content)
    
    print_success("Script procesador de imágenes creado: image_processor.py")
    return True

def update_database_schema():
    """Actualizar esquema de base de datos para incluir descripciones IA"""
    try:
        import sqlite3
        
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        # Verificar si la columna ya existe
        cursor.execute("PRAGMA table_info(Product)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'ai_description' not in columns:
            cursor.execute("ALTER TABLE Product ADD COLUMN ai_description TEXT")
            print_success("Columna ai_description agregada a la base de datos")
        else:
            print_info("Columna ai_description ya existe")
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        print_error(f"Error actualizando base de datos: {e}")
        return False

def create_test_script():
    """Crear script de prueba"""
    test_content = '''#!/usr/bin/env python3
"""
🧪 PRUEBA DEL MODELO DE IMÁGENES
Verifica que todo funcione correctamente
"""

import ollama
import requests

def test_model():
    """Probar el modelo de imágenes"""
    try:
        client = ollama.Client()
        
        # Probar con imagen de ejemplo
        test_url = "https://via.placeholder.com/300x200/FF0000/FFFFFF?text=TEST"
        
        print("🔍 Probando modelo con imagen de ejemplo...")
        
        # Descargar imagen de prueba
        response = requests.get(test_url)
        
        if response.status_code == 200:
            import base64
            image_b64 = base64.b64encode(response.content).decode('utf-8')
            
            result = client.generate(
                model="llava:latest",
                prompt="Describe esta imagen brevemente en español.",
                images=[image_b64]
            )
            
            print("✅ ÉXITO: El modelo funciona correctamente")
            print(f"📝 Respuesta: {result['response']}")
            return True
        else:
            print("❌ Error descargando imagen de prueba")
            return False
            
    except Exception as e:
        print(f"❌ Error probando modelo: {e}")
        return False

if __name__ == "__main__":
    test_model()
'''
    
    with open("test_image_model.py", "w", encoding="utf-8") as f:
        f.write(test_content)
    
    print_success("Script de prueba creado: test_image_model.py")

def main():
    """Función principal de instalación"""
    print_header("🚀 INSTALADOR AUTOMÁTICO DEL MODELO DE IMÁGENES")
    
    print_info("Este script instalará automáticamente:")
    print("  📦 Ollama (si no está instalado)")
    print("  🐍 Dependencias de Python")
    print("  🤖 Modelo de IA para imágenes")
    print("  🔧 Scripts de procesamiento")
    print("  🗄️ Actualización de base de datos")
    
    input(f"\n{Colors.YELLOW}Presiona Enter para comenzar...{Colors.END}")
    
    # Paso 1: Verificar Python
    print_step(1, "Verificando Python")
    if not check_python_version():
        print_error("Python 3.8+ es requerido")
        return False
    
    # Paso 2: Verificar/Instalar Ollama
    print_step(2, "Verificando Ollama")
    if not check_ollama_installed():
        print_warning("Ollama no está instalado")
        if input("¿Deseas instalar Ollama? (s/n): ").lower() == 's':
            if not install_ollama():
                print_error("No se pudo instalar Ollama")
                return False
        else:
            print_error("Ollama es requerido para continuar")
            return False
    else:
        print_success("Ollama ya está instalado")
    
    # Paso 3: Instalar dependencias Python
    print_step(3, "Instalando dependencias de Python")
    if not install_python_dependencies():
        print_error("Error instalando dependencias")
        return False
    
    # Paso 4: Descargar modelo de imágenes
    print_step(4, "Descargando modelo de IA para imágenes")
    model = download_image_model()
    if not model:
        print_error("No se pudo descargar el modelo")
        return False
    
    # Paso 5: Crear scripts
    print_step(5, "Creando scripts de procesamiento")
    create_image_processor()
    create_test_script()
    
    # Paso 6: Actualizar base de datos
    print_step(6, "Actualizando esquema de base de datos")
    update_database_schema()
    
    # Finalización
    print_header("🎉 INSTALACIÓN COMPLETADA")
    
    print_success("Todo instalado correctamente!")
    print_info("Scripts creados:")
    print(f"  📄 image_processor.py - Procesador principal")
    print(f"  📄 test_image_model.py - Script de prueba")
    
    print_info("Para usar:")
    print("  1. Ejecutar prueba: python test_image_model.py")
    print("  2. Procesar imágenes: python image_processor.py")
    
    if input(f"\n{Colors.YELLOW}¿Ejecutar prueba ahora? (s/n): {Colors.END}").lower() == 's':
        print_info("Ejecutando prueba...")
        run_command("python test_image_model.py", "Probando modelo")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        if success:
            print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 ¡INSTALACIÓN EXITOSA!{Colors.END}")
        else:
            print(f"\n{Colors.RED}{Colors.BOLD}❌ INSTALACIÓN FALLÓ{Colors.END}")
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}⚠️  Instalación cancelada por el usuario{Colors.END}")
    except Exception as e:
        print(f"\n{Colors.RED}❌ Error inesperado: {str(e)}{Colors.END}")