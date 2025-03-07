// components/Footer.js

import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a2b49', color: '#ffffff', padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        
        {/* Column 1: Legal */}
        <div style={{ minWidth: '200px', flex: '1' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Legal</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, lineHeight: '1.6' }}>
            <li><a href="/ada-compliance/" style={linkStyle}>Ada Compliance</a></li>
            <li><a href="/terms-of-use-agreement/" style={linkStyle}>Terms of Use Agreement</a></li>
            <li><a href="/privacy-policy/" style={linkStyle}>Privacy</a></li>
          </ul>
        </div>

        {/* Column 2: Practice Areas */}
        <div style={{ minWidth: '200px', flex: '1' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Practice Areas</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, lineHeight: '1.6' }}>
            <li><a href="/property-damage-claims" style={linkStyle}>Property Damage Claims</a></li>
            <li><a href="/social-security-disability-lawyers" style={linkStyle}>SSDI Claims</a></li>
            <li><a href="/personal-injury-attorneys" style={linkStyle}>Personal Injury</a></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div style={{ minWidth: '200px', flex: '1' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Resources</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, lineHeight: '1.6' }}>
            <li><a href="/resources" style={linkStyle}>Blog</a></li>
            <li><a href="/job-id-00001" style={linkStyle}>Careers</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright section */}
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', lineHeight: '1.5', maxWidth: '1400px', margin: '2rem auto 0' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          Copyright © 2025 Louis Law Group
        </p>
        <p style={{ marginBottom: '1rem' }}>
          All rights reserved. This website and its content are protected by copyright law. 
          No part of this website may be reproduced, distributed, or transmitted in any form or by any means, 
          including photocopying, recording, or other electronic or mechanical methods, without the prior written permission 
          of Louis Law Group, except in the case of brief quotations embodied in critical reviews and certain other 
          noncommercial uses permitted by copyright law. For permission requests, please contact Louis Law Group directly.
        </p>
      </div>
    </footer>
  );
}

const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
};