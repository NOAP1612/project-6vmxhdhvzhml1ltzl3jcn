import html2canvas from 'html2canvas';

export const downloadChartAsPNG = async (element: HTMLElement, fileName: string): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff', // Set a white background
      scale: 2, // Increase resolution
    });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName.replace(/ /g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading chart:', error);
    throw new Error('Failed to download chart');
  }
};