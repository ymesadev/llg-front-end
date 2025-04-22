"use client";

import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const [isClient, setIsClient] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          <p>Copyright © {isClient ? currentYear : ''} Louis Law Group</p>
          <p>
            All rights reserved. This website and its content are protected by copyright law.
            No part of this website may be reproduced, distributed, or transmitted in any form
            or by any means, including photocopying, recording, or other electronic or mechanical
            methods, without the prior written permission of Louis Law Group, except in the case
            of brief quotations embodied in critical reviews and certain other noncommercial uses
            permitted by copyright law. For permission requests, please contact Louis Law Group directly.
          </p>
        </div>
      </div>
    </footer>
  );
} 