export const detectInputType = (value: string): 'email' | 'phone' | 'invalid' => {
    const trimmed = value.trim();
    if (trimmed.includes('@') && trimmed.includes('.')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(trimmed)) {
            return 'email';
        }
    }

    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(trimmed.replace(/\D/g, ''))) {
        return 'phone';
    }

    return 'invalid';
};