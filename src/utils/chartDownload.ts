import html2canvas from 'html2canvas';

export const downloadChartAsPNG = async (chartElement: HTMLElement, fileName: string) => {
  try {
    // Wait a bit to ensure the chart is fully rendered
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading chart:', error);
    return false;
  }
};