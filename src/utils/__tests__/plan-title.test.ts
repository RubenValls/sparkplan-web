import { extractPlanTitle } from "../plan-title";

describe('extractPlanTitle', () => {
  it('should extract title from markdown with # heading', () => {
    const markdown = '# Desarrollo de una Aplicación Móvil\n\nContenido del plan...';
    
    expect(extractPlanTitle(markdown)).toBe('Desarrollo de una Aplicación Móvil');
  });

  it('should return default title when no # heading is found', () => {
    const markdown = 'Contenido sin título\nMás contenido...';
    
    expect(extractPlanTitle(markdown)).toBe('Business Plan');
  });

  it('should handle title with extra spaces', () => {
    const markdown = '#   Mi Plan de Negocio   \n\nContenido...';
    
    expect(extractPlanTitle(markdown)).toBe('Mi Plan de Negocio');
  });

  it('should skip empty lines and find first title', () => {
    const markdown = '\n\n# Título Correcto\n\nContenido...';
    
    expect(extractPlanTitle(markdown)).toBe('Título Correcto');
  });
});