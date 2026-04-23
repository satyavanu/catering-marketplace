// Helper functions
function downloadFromServer(downloadUrl: string, documentId: string) {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Droooly_Partner_Agreement_${documentId}.pdf`;
    link.click();
  }
  
  async function downloadAsEmail(documentId: string, saveToAccount: boolean = false) {
    try {
      await fetch('/api/onboarding/send-agreement-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          saveToAccount,
        }),
      });
  
      alert(
        saveToAccount
          ? 'Agreement saved to your account!'
          : 'Agreement sent to your email!'
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  }


  export { downloadFromServer, downloadAsEmail, getClientIP };