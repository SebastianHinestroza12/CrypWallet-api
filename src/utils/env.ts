/**
 * Obtiene el valor de una variable de entorno.
 * @param key - La clave de la variable de entorno.
 * @returns El valor de la variable de entorno.
 * @throws Lanza un error si la variable de entorno no existe.
 */
export function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`La variable de entorno ${key} no está definida.`);
  }
  return value;
}
