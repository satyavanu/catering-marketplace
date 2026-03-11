import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Example: Fetch caterers from a database or an external API
    const caterers = [
        { id: 1, name: 'Caterer One', services: ['Wedding', 'Corporate'], description: 'Best caterer in town.' },
        { id: 2, name: 'Caterer Two', services: ['Birthday', 'Event'], description: 'Delicious food for every occasion.' },
    ];

    return NextResponse.json(caterers);
}

// Additional API routes (e.g., POST, PUT, DELETE) can be added here as needed.