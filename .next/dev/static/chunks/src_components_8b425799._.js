(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/HeroSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const HeroSection = ()=>{
    _s();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleSearch = (e)=>{
        e.preventDefault();
        console.log('Search:', searchQuery, 'Location:', location);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        style: {
            backgroundImage: `url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: 'white',
            paddingTop: '8rem',
            paddingBottom: '8rem',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '600px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1
                }
            }, void 0, false, {
                fileName: "[project]/src/components/HeroSection.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '400px',
                    height: '400px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    zIndex: 2
                }
            }, void 0, false, {
                fileName: "[project]/src/components/HeroSection.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    bottom: '-80px',
                    left: '-80px',
                    width: '300px',
                    height: '300px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '50%',
                    zIndex: 2
                }
            }, void 0, false, {
                fileName: "[project]/src/components/HeroSection.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl px-4",
                style: {
                    position: 'relative',
                    zIndex: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'center',
                            marginBottom: '3rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'inline-block',
                                    marginBottom: '1rem'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        display: 'inline-block',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: '#fed7aa',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                    },
                                    children: "✨ Welcome to CaterHub"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/HeroSection.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/HeroSection.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: '3.5rem',
                                    fontWeight: 'bold',
                                    marginBottom: '1rem',
                                    lineHeight: '1.2'
                                },
                                children: "Find the Perfect Catering Service"
                            }, void 0, false, {
                                fileName: "[project]/src/components/HeroSection.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '1.125rem',
                                    color: '#fed7aa',
                                    marginBottom: '0.5rem'
                                },
                                children: "Discover and book trusted catering services for your next event"
                            }, void 0, false, {
                                fileName: "[project]/src/components/HeroSection.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '0.875rem',
                                    color: 'rgba(255, 255, 255, 0.9)'
                                },
                                children: "From intimate dinners to grand celebrations, we connect you with the best caterers"
                            }, void 0, false, {
                                fileName: "[project]/src/components/HeroSection.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/HeroSection.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '0.75rem',
                            padding: '2rem',
                            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
                            maxWidth: '56rem',
                            margin: '0 auto'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSearch,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    gap: '1rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#111827',
                                                    marginBottom: '0.5rem'
                                                },
                                                children: "🍽️ Cuisine Type"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/HeroSection.tsx",
                                                lineNumber: 111,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Italian, Indian, Fusion...",
                                                value: searchQuery,
                                                onChange: (e)=>setSearchQuery(e.target.value),
                                                style: {
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    color: '#111827',
                                                    transition: 'border-color 0.3s'
                                                },
                                                onFocus: (e)=>e.currentTarget.style.borderColor = '#f97316',
                                                onBlur: (e)=>e.currentTarget.style.borderColor = '#e5e7eb'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/HeroSection.tsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/HeroSection.tsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#111827',
                                                    marginBottom: '0.5rem'
                                                },
                                                children: "📍 Location"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/HeroSection.tsx",
                                                lineNumber: 135,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "New York, London...",
                                                value: location,
                                                onChange: (e)=>setLocation(e.target.value),
                                                style: {
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    color: '#111827',
                                                    transition: 'border-color 0.3s'
                                                },
                                                onFocus: (e)=>e.currentTarget.style.borderColor = '#f97316',
                                                onBlur: (e)=>e.currentTarget.style.borderColor = '#e5e7eb'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/HeroSection.tsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/HeroSection.tsx",
                                        lineNumber: 134,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#111827',
                                                    marginBottom: '0.5rem'
                                                },
                                                children: "📅 Event Date"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/HeroSection.tsx",
                                                lineNumber: 159,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                style: {
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    color: '#111827',
                                                    transition: 'border-color 0.3s',
                                                    cursor: 'pointer'
                                                },
                                                onFocus: (e)=>e.currentTarget.style.borderColor = '#f97316',
                                                onBlur: (e)=>e.currentTarget.style.borderColor = '#e5e7eb'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/HeroSection.tsx",
                                                lineNumber: 162,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/HeroSection.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'flex-end'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            style: {
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#f97316',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.3s, transform 0.2s',
                                                fontSize: '0.875rem'
                                            },
                                            onMouseEnter: (e)=>{
                                                e.currentTarget.style.backgroundColor = '#ea580c';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            },
                                            onMouseLeave: (e)=>{
                                                e.currentTarget.style.backgroundColor = '#f97316';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            },
                                            children: "🔍 Search"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/HeroSection.tsx",
                                            lineNumber: 181,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/HeroSection.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/HeroSection.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/HeroSection.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeroSection.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'center',
                            marginTop: '2rem'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '0.875rem',
                                color: 'rgba(255, 255, 255, 0.9)'
                            },
                            children: "👇 Browse by categories below to get started"
                        }, void 0, false, {
                            fileName: "[project]/src/components/HeroSection.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeroSection.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/HeroSection.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/HeroSection.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(HeroSection, "6Cow7X3cle4/G2K0LnRxmjVEEs8=");
_c = HeroSection;
const __TURBOPACK__default__export__ = HeroSection;
var _c;
__turbopack_context__.k.register(_c, "HeroSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CategoryTabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const categories = [
    {
        id: 1,
        name: 'Wedding Catering',
        description: 'Premium catering services for your special day. From intimate ceremonies to grand receptions.',
        count: 245,
        icon: '💍'
    },
    {
        id: 2,
        name: 'Corporate Catering',
        description: 'Professional catering for business events, conferences, and corporate meetings.',
        count: 189,
        icon: '🏢'
    },
    {
        id: 3,
        name: 'Birthday Catering',
        description: 'Fun and festive catering for birthday celebrations of all sizes.',
        count: 167,
        icon: '🎂'
    },
    {
        id: 4,
        name: 'Private Chef',
        description: 'Exclusive private chef services for intimate dinners and special occasions.',
        count: 124,
        icon: '👨‍🍳'
    }
];
const CategoryTabs = ()=>{
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const activeCategory = categories[activeTab];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        style: {
            paddingTop: '4rem',
            paddingBottom: '4rem',
            backgroundColor: 'white'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '3rem',
                            textAlign: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: '1.875rem',
                                    fontWeight: 'bold',
                                    color: '#111827',
                                    marginBottom: '1rem'
                                },
                                children: "Explore by Category"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CategoryTabs.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: '#6b7280'
                                },
                                children: "Find the perfect catering service for your event type"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CategoryTabs.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CategoryTabs.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '2rem',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        },
                        children: categories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab(index),
                                style: {
                                    padding: '0.75rem 1.5rem',
                                    border: activeTab === index ? 'none' : '1px solid #e5e7eb',
                                    backgroundColor: activeTab === index ? '#f97316' : 'white',
                                    color: activeTab === index ? 'white' : '#111827',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.3s',
                                    fontSize: '0.875rem'
                                },
                                onMouseEnter: (e)=>{
                                    if (activeTab !== index) {
                                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                                    }
                                },
                                onMouseLeave: (e)=>{
                                    if (activeTab !== index) {
                                        e.currentTarget.style.backgroundColor = 'white';
                                    }
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginRight: '0.5rem'
                                        },
                                        children: category.icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CategoryTabs.tsx",
                                        lineNumber: 89,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    category.name
                                ]
                            }, category.id, true, {
                                fileName: "[project]/src/components/CategoryTabs.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/CategoryTabs.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: '#f9fafb',
                            borderRadius: '0.75rem',
                            padding: '2rem',
                            border: '1px solid #e5e7eb',
                            animation: 'fadeIn 0.3s ease-in'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    marginBottom: '1.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '3rem'
                                        },
                                        children: activeCategory.icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CategoryTabs.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#111827',
                                                    marginBottom: '0.5rem'
                                                },
                                                children: activeCategory.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/CategoryTabs.tsx",
                                                lineNumber: 108,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: '#6b7280',
                                                    marginBottom: '0.5rem'
                                                },
                                                children: activeCategory.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/CategoryTabs.tsx",
                                                lineNumber: 111,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: '#f97316',
                                                    fontWeight: '600',
                                                    fontSize: '0.875rem'
                                                },
                                                children: [
                                                    activeCategory.count,
                                                    "+ Available Caterers"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/CategoryTabs.tsx",
                                                lineNumber: 114,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/CategoryTabs.tsx",
                                        lineNumber: 107,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/CategoryTabs.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                style: {
                                    marginTop: '1rem',
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#f97316',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s'
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#ea580c',
                                onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#f97316',
                                children: [
                                    "Browse ",
                                    activeCategory.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/CategoryTabs.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CategoryTabs.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CategoryTabs.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `
            }, void 0, false, {
                fileName: "[project]/src/components/CategoryTabs.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CategoryTabs.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CategoryTabs, "9RTnV4k8xQ8Z7mmUeyiKoXdA+A8=");
_c = CategoryTabs;
const __TURBOPACK__default__export__ = CategoryTabs;
var _c;
__turbopack_context__.k.register(_c, "CategoryTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/LatestMenus.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const mockMenus = [
    {
        id: 1,
        name: 'Gourmet Wedding Feast',
        caterer: 'Elegant Bites Catering',
        description: 'Sophisticated multi-course dinner',
        image: '🍗',
        price: 45,
        priceLabel: '$45',
        minGuests: 50,
        cuisines: [
            'Italian Cuisine'
        ],
        dietary: [
            'Halal'
        ]
    },
    {
        id: 2,
        name: 'Corporate Lunch Buffet',
        caterer: 'BizCater Services',
        description: 'Professional business catering',
        image: '🍱',
        price: 30,
        priceLabel: '$30',
        minGuests: 20,
        cuisines: [
            'Continental'
        ],
        dietary: [
            'Vegetarian'
        ]
    },
    {
        id: 3,
        name: 'BBQ Party Platter',
        caterer: 'Smoky Delights',
        description: 'Delicious grilled specialties',
        image: '🍖',
        price: 25,
        priceLabel: '$25',
        minGuests: 30,
        cuisines: [
            'American BBQ'
        ],
        dietary: [
            'Kosher'
        ]
    },
    {
        id: 4,
        name: 'Luxury Canapé Selection',
        caterer: "Chef's Finest",
        description: 'Premium appetizers and bites',
        image: '🥂',
        price: 55,
        priceLabel: '$55',
        minGuests: 20,
        cuisines: [
            'French'
        ],
        dietary: [
            'Gluten-free'
        ]
    }
];
const LatestMenus = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "menus",
        style: {
            paddingTop: '4rem',
            paddingBottom: '4rem',
            backgroundColor: '#f9fafb'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '3rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontSize: '1.875rem',
                                        fontWeight: 'bold',
                                        color: '#111827',
                                        marginBottom: '0.5rem'
                                    },
                                    children: "Latest Menus"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/LatestMenus.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#6b7280'
                                    },
                                    children: "Delicious new offerings for your events"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/LatestMenus.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/LatestMenus.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "#",
                            style: {
                                color: '#f97316',
                                fontWeight: '600',
                                textDecoration: 'none',
                                fontSize: '0.875rem'
                            },
                            children: "View All Menus →"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LatestMenus.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LatestMenus.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem'
                    },
                    children: mockMenus.map((menu)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                backgroundColor: 'white',
                                borderRadius: '0.75rem',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s',
                                border: '1px solid #e5e7eb'
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
                                        height: '200px',
                                        backgroundColor: '#f3f4f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '4rem',
                                        borderBottom: '1px solid #e5e7eb'
                                    },
                                    children: menu.image
                                }, void 0, false, {
                                    fileName: "[project]/src/components/LatestMenus.tsx",
                                    lineNumber: 111,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
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
                                                marginBottom: '0.25rem'
                                            },
                                            children: menu.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LatestMenus.tsx",
                                            lineNumber: 129,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '0.75rem',
                                                color: '#6b7280',
                                                marginBottom: '0.75rem'
                                            },
                                            children: menu.caterer
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LatestMenus.tsx",
                                            lineNumber: 132,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '0.875rem',
                                                color: '#6b7280',
                                                marginBottom: '1rem',
                                                minHeight: '2.5rem'
                                            },
                                            children: menu.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LatestMenus.tsx",
                                            lineNumber: 137,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginBottom: '1rem'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#111827'
                                                },
                                                children: [
                                                    "From ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '1.25rem',
                                                            color: '#f97316'
                                                        },
                                                        children: menu.priceLabel
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/LatestMenus.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 26
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " per person"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/LatestMenus.tsx",
                                                lineNumber: 143,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LatestMenus.tsx",
                                            lineNumber: 142,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginBottom: '1rem',
                                                paddingBottom: '1rem',
                                                borderBottom: '1px solid #e5e7eb'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '0.75rem',
                                                        color: '#6b7280',
                                                        marginBottom: '0.5rem'
                                                    },
                                                    children: [
                                                        "Min. ",
                                                        menu.minGuests,
                                                        " Guests"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/LatestMenus.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: '0.5rem'
                                                    },
                                                    children: [
                                                        menu.cuisines.map((cuisine, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '0.7rem',
                                                                    color: '#6b7280',
                                                                    padding: '0.25rem 0.5rem',
                                                                    backgroundColor: '#f3f4f6',
                                                                    borderRadius: '0.25rem'
                                                                },
                                                                children: cuisine
                                                            }, idx, false, {
                                                                fileName: "[project]/src/components/LatestMenus.tsx",
                                                                lineNumber: 155,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))),
                                                        menu.dietary.map((diet, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '0.7rem',
                                                                    color: '#6b7280',
                                                                    padding: '0.25rem 0.5rem',
                                                                    backgroundColor: '#f3f4f6',
                                                                    borderRadius: '0.25rem'
                                                                },
                                                                children: diet
                                                            }, idx, false, {
                                                                fileName: "[project]/src/components/LatestMenus.tsx",
                                                                lineNumber: 160,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/LatestMenus.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/LatestMenus.tsx",
                                            lineNumber: 149,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: {
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#f5f5f5',
                                                color: '#111827',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.5rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                fontSize: '0.875rem'
                                            },
                                            onMouseEnter: (e)=>{
                                                e.currentTarget.style.backgroundColor = '#f97316';
                                                e.currentTarget.style.color = 'white';
                                                e.currentTarget.style.borderColor = '#f97316';
                                            },
                                            onMouseLeave: (e)=>{
                                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                e.currentTarget.style.color = '#111827';
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                            },
                                            children: "View Details"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LatestMenus.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/LatestMenus.tsx",
                                    lineNumber: 127,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, menu.id, true, {
                            fileName: "[project]/src/components/LatestMenus.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/src/components/LatestMenus.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/LatestMenus.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/LatestMenus.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = LatestMenus;
const __TURBOPACK__default__export__ = LatestMenus;
var _c;
__turbopack_context__.k.register(_c, "LatestMenus");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CustomerReviews.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const mockReviews = [
    {
        id: 1,
        author: 'Sarah Johnson',
        rating: 5,
        text: 'Absolutely fantastic! The food was delicious and the service was impeccable. Highly recommended!',
        service: 'Elegant Events Catering'
    },
    {
        id: 2,
        author: 'Michael Chen',
        rating: 5,
        text: 'Best corporate catering we have used. Professional, on-time, and the food was amazing.',
        service: 'Mediterranean Bites'
    },
    {
        id: 3,
        author: 'Emily Rodriguez',
        rating: 4,
        text: 'Great selection of vegetarian options. Would definitely book again for our next event.',
        service: 'Farm to Table Delights'
    },
    {
        id: 4,
        author: 'David Thompson',
        rating: 5,
        text: 'Outstanding quality and attention to detail. Made our wedding reception unforgettable!',
        service: 'Elegant Events Catering'
    },
    {
        id: 5,
        author: 'Jessica Lee',
        rating: 4,
        text: 'Excellent variety and fresh ingredients. The team was very accommodating with our dietary restrictions.',
        service: 'Spice Route Kitchen'
    },
    {
        id: 6,
        author: 'Robert Martinez',
        rating: 5,
        text: 'Premium service at reasonable prices. Would definitely recommend to anyone planning an event.',
        service: 'Grill Master BBQ'
    }
];
const CustomerReviews = ()=>{
    _s();
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [displayCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(2); // Show 2 reviews by default
    const totalSlides = Math.ceil(mockReviews.length / displayCount);
    const handlePrev = ()=>{
        setCurrentIndex((prev)=>prev === 0 ? totalSlides - 1 : prev - 1);
    };
    const handleNext = ()=>{
        setCurrentIndex((prev)=>prev === totalSlides - 1 ? 0 : prev + 1);
    };
    const getVisibleReviews = ()=>{
        const startIndex = currentIndex * displayCount;
        return mockReviews.slice(startIndex, startIndex + displayCount);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "reviews",
        style: {
            paddingTop: '4rem',
            paddingBottom: '4rem',
            backgroundColor: '#f9fafb'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: '3rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: '1.875rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1rem'
                            },
                            children: "Customer Reviews"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CustomerReviews.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: '#6b7280'
                            },
                            children: "See what our customers are saying"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CustomerReviews.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CustomerReviews.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: 'relative',
                        marginBottom: '2rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-2",
                            children: getVisibleReviews().map((review)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        backgroundColor: 'white',
                                        borderRadius: '0.5rem',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #e5e7eb'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: '1rem'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: '2.5rem',
                                                            height: '2.5rem',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#f97316',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.875rem'
                                                        },
                                                        children: review.author.charAt(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/CustomerReviews.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                style: {
                                                                    fontWeight: '600',
                                                                    color: '#111827',
                                                                    fontSize: '0.95rem'
                                                                },
                                                                children: review.author
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/CustomerReviews.tsx",
                                                                lineNumber: 126,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    color: '#fbbf24',
                                                                    fontSize: '0.75rem',
                                                                    letterSpacing: '0.05em'
                                                                },
                                                                children: '★'.repeat(review.rating)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/CustomerReviews.tsx",
                                                                lineNumber: 129,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/CustomerReviews.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/CustomerReviews.tsx",
                                                lineNumber: 108,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CustomerReviews.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#6b7280',
                                                fontSize: '0.875rem',
                                                lineHeight: '1.6',
                                                marginBottom: '1rem',
                                                fontStyle: 'italic'
                                            },
                                            children: [
                                                '"',
                                                review.text,
                                                '"'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/CustomerReviews.tsx",
                                            lineNumber: 137,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#f97316',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            },
                                            children: review.service
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CustomerReviews.tsx",
                                            lineNumber: 142,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, review.id, true, {
                                    fileName: "[project]/src/components/CustomerReviews.tsx",
                                    lineNumber: 95,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/CustomerReviews.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '1rem',
                                marginTop: '2rem'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handlePrev,
                                    style: {
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '50%',
                                        backgroundColor: '#f97316',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background-color 0.3s'
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#ea580c',
                                    onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#f97316',
                                    title: "Previous reviews",
                                    children: "←"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CustomerReviews.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: '0.5rem'
                                    },
                                    children: Array.from({
                                        length: totalSlides
                                    }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentIndex(index),
                                            style: {
                                                width: '0.75rem',
                                                height: '0.75rem',
                                                borderRadius: '50%',
                                                backgroundColor: index === currentIndex ? '#f97316' : '#d1d5db',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.3s'
                                            },
                                            title: `Go to slide ${index + 1}`
                                        }, index, false, {
                                            fileName: "[project]/src/components/CustomerReviews.tsx",
                                            lineNumber: 178,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CustomerReviews.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleNext,
                                    style: {
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '50%',
                                        backgroundColor: '#f97316',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background-color 0.3s'
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#ea580c',
                                    onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '#f97316',
                                    title: "Next reviews",
                                    children: "→"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CustomerReviews.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CustomerReviews.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'center',
                                marginTop: '1rem',
                                color: '#6b7280',
                                fontSize: '0.875rem'
                            },
                            children: [
                                "Slide ",
                                currentIndex + 1,
                                " of ",
                                totalSlides
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CustomerReviews.tsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CustomerReviews.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CustomerReviews.tsx",
            lineNumber: 80,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/CustomerReviews.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CustomerReviews, "5VOpUVxLt/k+ApuxJ+ZnwPLJG9g=");
_c = CustomerReviews;
const __TURBOPACK__default__export__ = CustomerReviews;
var _c;
__turbopack_context__.k.register(_c, "CustomerReviews");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_8b425799._.js.map