"use client";
import Layout from "../components/Layout/Layout";
import styles from "./team.module.css";
import Image from "next/image";
import Link from "next/link";
import Results from "../components/Results/Results";
import Services from "../components/Services/Services";
import Steps from "../components/Steps/Steps"; 
import ContactSection from "../components/Contact/ContactSection"; 
import { FaMapMarkerAlt } from "react-icons/fa";

const teamMembers = [
  {
    name: "Pierre Louis, Esq",
    photo: "/images/Pierre-A-Louis-Esq-LLG.jpg",
    description: "Miami Fl",
    link: "/pierre-a-louis-esq",
  },
  {
    name: "Bibin Mannattuparampil, Esq",
    photo: "/images/Bibin-Mannattuparampil-Esq-LLG.jpg",
    description: "Miami, FL ",
    link: "/bibin-mannattuparampil",
  },
  {
    name: "Cathleen Rodriguez, Esq",
    photo: "/images/Cathleen-V-Rodriguez-Esq-LLG.jpg",
    description: "Miami, FL",
    link: "/cathleen-rodriguez-esq",
  },
  {
    name: "Benaejah Simmonds, Esq",
    photo: "/images/Benaejah-Simmonds-Esq-LLG.jpg",
    description: "Miami, FL",
    link: "/benaejah-simmonds-esq",
  },
  {
    name: "Melissa Romero, Esq",
    photo: "/images/Melissa-Romero-Esq.jpg",
    description: "West Palm Beach, FL",
    link: "/melissa-romero-esq",
  },
  {
    name: "Magdaline Mintz, Esq",
    photo: "/images/Magdaline-Mintz-Esq-LLG.jpg",
    description: "Atlanta, GA ",
  },
  {
    name: "Damian Zimmerman, Esq",
    photo: "/images/no-data.jpg",
    description: "Pensacola, FL",
  },
  {
    name: "Marie Fabre",
    photo: "/images/no-data.jpg",
    description: "Miami, Fl",
 
  },
  {
    name: "Olena Perez",
    photo: "/images/olena-perez.jpg",
    description: "Tallahassee, FL",
    
  },
  {
    name: "Matthew Mobley",
    photo: "/images/matthew-mobley.jpg",
    description: "Miami, FL ",
  
  },
  {
    name: "Yonel Mesa",
    photo: "/images/yonel-mesa.jpg",
    description: "Miami, Fl",
    
  },
  {
    name: "Esarine Nervil",
    photo: "/images/esarine-nervil.jpg",
    description: "Miami, FL ",
    
  },
  {
    name: "Romina Murias",
    photo: "/images/no-data.jpg",
    description: "Miami, FL ",
    
  },
  {
    name: "Marie Augustin",
    photo: "/images/marie-augustine.jpg",
    description: "Miami, FL ",
    
  },
  {
    name: "Kellei Johnson",
    photo: "/images/kellei-johnson.jpg",
    description: "Inverness, FL",
   
  },
  {
    name: "Monica Abay",
    photo: "/images/Monica-Abay.jpg",
    description: "Homestead, FL",
    
  },
  {
    name: "Cora Travis",
    photo: "/images/cora-travis.jpg",
    description: "Jupiter, FL ",
    
  },
  {
    name: "Daphney Souriac",
    photo: "/images/daphney-souriac.jpg",
    description: "Miami, FL ",
    
  },
  {
    name: "Jeanmar Negron",
    photo: "/images/jeanmar-negron.jpg",
    description: "Orlando, FL",
    
  },
  {
    name: "Jennifer Dougherty",
    photo: "/images/jennifer-dougherty.jpg",
    description: "Lutz, FL ",
    
  },
  {
    name: "Diana “Dee” Vergara",
    photo: "/images/dee-vergara.jpg",
    description: "Winter Haven, FL ",
    
  },
  {
    name: "Natalia Melendez",
    photo: "/images/no-data.jpg",
    description: "Orlando, FL  ",
    
  },
];

export default function Team() {
  return (
    <Layout>
      <section className={styles.teamsHero}>
        <div className={styles.teamContainer}>
          <h1 className={styles.teampageTitle}>Our Team</h1>
          <p className={styles.teamDescription}>
            When navigating the complex world of insurance claims in Florida, having a seasoned insurance claims lawyer by your side can make all the difference. At Louis Law Group, our team of dedicated attorneys specializes in insurance litigation, offering you the legal expertise needed to maximize your insurance claim.
          </p>

          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <div className={styles.teamInfo}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamTitle}><FaMapMarkerAlt className={styles.locationIcon} />{member.description}</p>
                  {member.link && (
                    <Link href={member.link} className={styles.teamLink}>
                      View Profile
                    </Link>
                  )}
                </div>
                <div className={styles.teamImageContainer}>
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={150}
                    height={150}
                    className={styles.teamImage}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Results />
      <Services />
      <Steps />
      <ContactSection />
    </Layout>
  );
}