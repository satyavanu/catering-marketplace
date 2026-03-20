catering-marketplace
└── catering-marketplace
    └── apps
        └── web
            └── src
                └── app
                    ├── (auth)
                    │   ├── login
                    │   │   └── page.tsx
                    │   ├── signup
                    │   │   └── page.tsx
                    │   ├── forgot-password
                    │   │   └── page.tsx
                    │   └── onboarding
                    │       └── page.tsx
                    ├── (account)
                    │   ├── layout.tsx
                    │   ├── page.tsx
                    │   ├── orders
                    │   │   └── page.tsx
                    │   ├── saved-caterers
                    │   │   └── page.tsx
                    │   ├── events
                    │   │   └── page.tsx
                    │   ├── messages
                    │   │   └── page.tsx
                    │   ├── reviews
                    │   │   └── page.tsx
                    │   ├── payments
                    │   │   └── page.tsx
                    │   └── profile
                    │       └── page.tsx
                    ├── experiences
                    │   ├── layout.tsx
                    │   ├── page.tsx
                    │   ├── [id]
                    │   │   ├── page.tsx          // Dynamic experience page
                    │   │   ├── quote.tsx        // Quote for large groups
                    │   │   ├── book.tsx         // Booking experience
                    │   │   └── payment.tsx      // Payment flow
                    │   └── confirmation
                    │       └── page.tsx         // Confirmation page after booking
                    └── components
                        ├── AccountSidebar.tsx
                        ├── AccountHeader.tsx
                        ├── OrderCard.tsx
                        ├── CatererCard.tsx
                        ├── EventCard.tsx
                        ├── MessageThread.tsx
                        ├── ReviewCard.tsx
                        ├── PaymentCard.tsx
                        ├── ProfileForm.tsx
                        ├── ExperienceCard.tsx     // Component for displaying experiences
                        └── QuoteForm.tsx          // Component for quote form