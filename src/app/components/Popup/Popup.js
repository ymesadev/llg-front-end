"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Popup.module.css"; // Import CSS Module
import Attorney from '../../../../public/images/transparent-pierre.webp';
import { IoMdChatboxes } from "react-icons/io";
import { PiArrowUpRightThin } from "react-icons/pi";


const Popup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isOpen && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContainer}>

                        <div className={styles.popupContent}>
                            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>✕</button>

                            <Image
                                src={Attorney}
                                alt="Attorney"
                                width={500}
                                height={500}
                                className={styles.attorneyImage}
                            />
                            <div className={styles.content}>              <h2>Free 24/7 Case Review</h2>
                                <p>Get a free case review from our experienced attorneys.</p></div>

                        </div>

                        <Link href="/free-case-evaluation" className={styles.ctaContainer}>
                            <IoMdChatboxes className={styles.icon} />
                            <div className={styles.ctaText}>
                                <p>Message Us Now</p>
                               <span className={styles.ctaLink}>
  Chat with a real attorney now.
</span></div>
                            <PiArrowUpRightThin className={styles.arrowIcon} />
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default Popup;
