import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/site';
import styles from './HomeServices.module.css';

export default function HomeServices() {
  return <section id="services" className={styles.section} aria-labelledby="home-services-heading">
    <div className={styles.container}>
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>HOW I CAN HELP</p><h2 id="home-services-heading">Start with the problem.<br/><span>Build what solves it.</span></h2></div>
        <p>Missed inquiries, repeated support questions, manual data entry or a broken integration. Start with one task and a useful outcome.</p>
      </header>
      <div className={styles.layout}>
        <figure className={styles.photo}>
          <Image src="/home-studio/field-mapping.webp" alt="Illustrative photograph of source fields being mapped to destination records" width={1536} height={1024} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1050px) 50vw, 620px" loading="lazy"/>
          <figcaption><strong>Connect the work.</strong><span>Fields, ownership and review points, agreed before the build.</span><small>Illustrative planning scene</small></figcaption>
        </figure>
        <div className={styles.services}>{services.map(service => <Link href={`/services/${service.slug}`} key={service.slug} className={styles.service}>
          <span className={styles.number} aria-hidden="true">{service.number}</span>
          <div>
            <h3>{service.name}</h3>
            <p className={styles.promise}>{service.short}</p>
            <p className={styles.description}>{service.description}</p>
            <span className={styles.detail}>Explore {service.name.startsWith('AI') || service.name.startsWith('API') ? service.name : service.name.toLowerCase()} <span aria-hidden="true">→</span></span>
          </div>
          <span className={styles.arrow} aria-hidden="true">↗</span>
        </Link>)}</div>
      </div>
    </div>
  </section>;
}
