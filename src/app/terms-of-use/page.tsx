'use client';

import React from 'react';

export default function TermsOfUsePage() {
  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#f97316', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', marginBottom: '4rem' }}>
        <div className="max-w-7xl px-4">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Terms of Use</h1>
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>Last updated: March 11, 2026</p>
        </div>
      </div>

      <div className="max-w-7xl px-4" style={{ marginBottom: '4rem', maxWidth: '800px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            By accessing and using CaterHub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            2. Use License
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            Permission is granted to temporarily download one copy of the materials (information or software) on CaterHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem', marginLeft: '1.5rem' }}>
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on CaterHub</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or 'mirroring' the materials on any other server</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            3. Disclaimer
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            The materials on CaterHub are provided on an 'as is' basis. CaterHub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            4. Limitations
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            In no event shall CaterHub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CaterHub.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            5. Accuracy of Materials
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            The materials appearing on CaterHub could include technical, typographical, or photographic errors. CaterHub does not warrant that any of the materials on our website are accurate, complete, or current. CaterHub may make changes to the materials contained on our website at any time without notice.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            6. Links
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            CaterHub has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CaterHub of the site. Use of any such linked website is at the user's own risk.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            7. Modifications
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            CaterHub may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            8. Governing Law
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8' }}>
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which CaterHub operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </div>
      </div>
    </main>
  );
}