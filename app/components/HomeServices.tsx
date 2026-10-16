import Link from 'next/link';
import { services } from '@/lib/site';
import styles from './HomeServices.module.css';

export default function HomeServices() {
  return <section id="services" className={styles.section} aria-labelledby="home-services-heading">
    <div className="shell">
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>HOW I CAN HELP</p><h2 id="home-services-heading">Start with the problem.<br/>Build what solves it.</h2></div>
        <p>Missed inquiries, repeated support questions, manual data entry or a broken integration. Start with one task and a useful outcome.</p>
      </header>
      <div className={styles.services}>{services.map(service => <Link href={`/services/${service.slug}`} key={service.slug} className={styles.service}>
        <div className={styles.serviceLabel}><span>{service.number}</span><h3>{service.name}</h3><span className={styles.arrow} aria-hidden="true">↗</span></div>
        <p className={styles.promise}>{service.short}</p>
        <p className={styles.description}>{service.description}</p>
        <span className={styles.detail}>Explore {service.name.startsWith('AI') || service.name.startsWith('API') ? service.name : service.name.toLowerCase()} <span aria-hidden="true">→</span></span>
      </Link>)}</div>
    </div>
  </section>;
}
