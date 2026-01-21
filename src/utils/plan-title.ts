export function extractPlanTitle(markdownContent: string): string {
  const lines = markdownContent.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('# ')) {
      return trimmedLine.replace(/^#\s+/, '').trim();
    }
  }
  
  return 'Business Plan';
}