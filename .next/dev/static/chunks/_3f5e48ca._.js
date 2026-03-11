(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/caterers/by-country/[country]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ByCountryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const allCaters = [
    {
        id: 1,
        name: 'Elegant Events Catering',
        cuisine: 'French & International',
        image: '👨‍🍳',
        rating: 4.8,
        reviews: 128,
        pricePerPerson: 45,
        specialties: [
            'Weddings',
            'Corporate Events'
        ],
        country: 'United States'
    },
    {
        id: 4,
        name: 'Grill Master BBQ',
        cuisine: 'American BBQ',
        image: '🔥',
        rating: 4.5,
        reviews: 87,
        pricePerPerson: 30,
        specialties: [
            'Parties',
            'Outdoor Events'
        ],
        country: 'United States'
    },
    {
        id: 2,
        name: 'Spice Route Kitchen',
        cuisine: 'Indian & Asian Fusion',
        image: '🍜',
        rating: 4.6,
        reviews: 95,
        pricePerPerson: 35,
        specialties: [
            'Weddings',
            'Parties'
        ],
        country: 'United Kingdom'
    },
    {
        id: 3,
        name: 'Mediterranean Bites',
        cuisine: 'Mediterranean & Greek',
        image: '🥗',
        rating: 4.7,
        reviews: 110,
        pricePerPerson: 40,
        specialties: [
            'Corporate',
            'Private Events'
        ],
        country: 'Australia'
    },
    {
        id: 5,
        name: 'Tokyo Street Kitchen',
        cuisine: 'Japanese',
        image: '🍱',
        rating: 4.9,
        reviews: 142,
        pricePerPerson: 50,
        specialties: [
            'Private Dinners',
            'Sushi Catering'
        ],
        country: 'Japan'
    }
];
function ByCountryPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const country = decodeURIComponent(params.country);
    const filteredCaters = allCaters.filter((c)=>c.country === country);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            backgroundColor: '#f9fafb',
            minHeight: '100vh'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: '#f97316',
                    color: 'white',
                    paddingTop: '4rem',
                    paddingBottom: '2rem',
                    marginBottom: '2rem'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl px-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/caterers",
                            style: {
                                color: 'white',
                                textDecoration: 'none',
                                marginBottom: '1rem',
                                display: 'inline-block'
                            },
                            children: "← Back to All Caterers"
                        }, void 0, false, {
                            fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            style: {
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '0.5rem'
                            },
                            children: [
                                "Caterers in ",
                                country
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '1rem',
                                opacity: 0.9
                            },
                            children: [
                                filteredCaters.length,
                                " caterers found"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl px-4",
                style: {
                    marginBottom: '4rem'
                },
                children: filteredCaters.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    },
                    children: filteredCaters.map((cater)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/caters/${cater.id}`,
                            style: {
                                textDecoration: 'none'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    backgroundColor: 'white',
                                    borderRadius: '0.75rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s',
                                    border: '1px solid #e5e7eb',
                                    cursor: 'pointer'
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '100%',
                                            height: '180px',
                                            backgroundColor: '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '3.5rem'
                                        },
                                        children: cater.image
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                                        lineNumber: 124,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '1.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    color: '#111827',
                                                    marginBottom: '0.5rem'
                                                },
                                                children: cater.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                                                lineNumber: 128,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: '#6b7280',
                                                    fontSize: '0.875rem',
                                                    marginBottom: '0.75rem'
                                                },
                                                children: cater.cuisine
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                                                lineNumber: 131,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: '1rem',
                                                    marginBottom: '1rem'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: '#fbbf24',
                                                        fontSize: '0.875rem'
                                                    },
                                                    children: [
                                                        "★ ",
                                                        cater.rating,
                                                        " (",
                                                        cater.reviews,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                                                lineNumber: 134,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '1.125rem',
                                                    fontWeight: 'bold',
                                                    color: '#f97316'
                                                },
                                                children: [
                                                    "From $",
                                                    cater.pricePerPerson,
                                                    "/person"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                                                lineNumber: 139,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                                        lineNumber: 127,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                                lineNumber: 105,
                                columnNumber: 17
                            }, this)
                        }, cater.id, false, {
                            fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                            lineNumber: 104,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                    lineNumber: 102,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        padding: '3rem',
                        backgroundColor: 'white',
                        borderRadius: '0.75rem'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '1.125rem',
                            color: '#6b7280'
                        },
                        children: [
                            "No caterers found in ",
                            country,
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                        lineNumber: 149,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                    lineNumber: 148,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/caterers/by-country/[country]/page.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(ByCountryPage, "+jVsTcECDRo3yq2d7EQxlN9Ixog=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = ByCountryPage;
var _c;
__turbopack_context__.k.register(_c, "ByCountryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_3f5e48ca._.js.map