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
  { name: "Pierre Louis, Esq", photo: "/images/pierre-louis-new.jpg", description: "Miami, FL", link: "/pierre-a-louis-esq" },
  { name: "Bibin Mannattuparampil, Esq", photo: "/images/Bibin-Mannattuparampil-Esq-LLG.jpg", description: "Miami, FL", link: "/bibin-mannattuparampil" },
  { name: "In Memoriam: Citra Joseph, Esq.", photo: "/images/citra-joseph.jpg", description: "Miami, FL", link: "/citra-joseph-esq" },
  { name: "Cathleen Rodriguez, Esq", photo: "/images/Cathleen-V-Rodriguez-Esq-LLG.jpg", description: "Miami, FL", link: "/cathleen-rodriguez-esq" },
  { name: "Benaejah Simmonds, Esq", photo: "/images/Benaejah-Simmonds-Esq-LLG.jpg", description: "Miami, FL", link: "/benaejah-simmonds-esq" },
  { name: "Melissa Romero, Esq", photo: "/images/Melissa-Romero-Esq.jpg", description: "West Palm Beach, FL", link: "/melissa-romero-esq" },
  { name: "Magdaline Mintz, Esq", photo: "/images/Magdaline-Mintz-Esq-LLG.jpg", description: "Atlanta, GA" },
  { name: "Thomas Singer, Esq", photo: "/images/thomas-singer.jpg", description: "Miami, Fl", link:"/thomas-singer-esq" },
  { name: "Brett Conger, Esq", photo: "/images/brett-conger.jpg", description: "Miami, Fl", link:"/brett-conger-esq" },
  { name: "Marie Fabre", photo: "/images/marie-fabre.jpg", description: "Miami, FL",link: "/marie-fabre" },
  { name: "Olena Perez", photo: "/images/olena-perez.jpg", description: "Tallahassee, FL", link: "/olena-perez" },
  { name: "Matthew Mobley", photo: "/images/matthew-mobley.jpg", description: "Miami, FL", link: "/matthew-mobley"},
  { name: "Yonel Mesa", photo: "/images/yonel-mesa.jpg", description: "Miami, FL", link: "/yonel-mesa" },
  { name: "Romina Murias", photo: "/images/romina-murias.jpg", description: "Miami, FL,", link: "/romina-murias" },
  { name: "Marie Augustin", photo: "/images/marie-augustine.jpg", description: "Miami, FL", link: "/marie-augustin" },
  { name: "Kellei Johnson", photo: "/images/kellei-johnson.jpg", description: "Inverness, FL", link: "/kellei-johnson" },
  { name: "Monica Abay", photo: "/images/Monica-Abay.jpg", description: "Homestead, FL",link: "/monica-abay" },
  { name: "Cora Travis", photo: "/images/cora-travis.jpg", description: "Jupiter, FL",link: "/cora-travis" },
   { name: "Diana “Dee” Vergara", photo: "/images/dee-vergara.jpg", description: "Winter Haven, FL",link: "/diana-vergara" },
   

  
  

];
 

export default function Team() {
  return (
    <Layout>
      <section className={styles.teamSection}>
        <div className="container">
          <h1 className={styles.teamSectionTitle}>Our Team</h1>
          <p className={styles.teamDescription}>
            When navigating the complex world of insurance claims in Florida, having a seasoned insurance claims lawyer by your side can make all the difference. At Louis Law Group, our team of dedicated attorneys specializes in insurance litigation, offering you the legal expertise needed to maximize your insurance claim.
          </p>

          {/* Team Grid push */}
          <div className="column-4">
            {teamMembers.map((member, index) => (
              <div key={member.link ? member.link : (member.name ? member.name : index)} className={styles.teamCard}>
                {/* Team Image */}
                <div className={styles.teamImageContainer}>
                  <Image
                    src={member.photo}
                    alt={member.name}
                    className={styles.teamImage}
                    layout="responsive"
                    width={500}
                    height={500}
                  />
                </div>

                {/* Hover Info */}
                <div className={styles.teamInfo}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamTitle}>
                    <FaMapMarkerAlt className={styles.locationIcon} />
                    {member.description}
                  </p>
                  {member.link && (
                    <Link href={member.link} className={styles.teamLink}>
                      View Profile
                    </Link>
                  )}
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