"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowIcon, BoxIcon, ChartIcon, EditIcon, HomeIcon, MailIcon, PhoneIcon, UserIcon, UsersIcon } from "@/components/icons";
import { BuilderShell } from "@/components/builder/builder-shell";
import { displayHomeSlug, type DisplayHome } from "@/components/builder/display-homes/data";
import styles from "./display-home-detail-page.module.css";

type DisplayHomeDetailPageProps = {
  home: DisplayHome;
};

export function DisplayHomeDetailPage({ home }: DisplayHomeDetailPageProps) {
  const statusClass = home.status === "Under review" ? "underReview" : home.status === "Published" ? "published" : "draft";
  const slug = displayHomeSlug(home.name);
  const qrPreviewMarks = useMemo(
    () => Array.from({ length: 49 }, (_, index) => index % 3 === 0 || index % 7 === 0 || index === 24 || index === 32),
    []
  );
  const salesConsultants = useMemo(
    () => ["Jane Smith", "Alex Warren", "Priya Shah"],
    []
  );
  const classificationTags = useMemo(
    () => ["Single storey", "Hamptons", "First home buyer", "Family"],
    []
  );
  const accessOptions = useMemo(
    () => [
      { label: "QR onboarding", value: true, note: "Enabled" },
      { label: "Staff approval", value: true, note: "Enabled" },
      { label: "Selection submissions", value: true, note: "Enabled" },
      { label: "Anonymous browse", value: false, note: "Disabled" },
    ],
    []
  );

  const recentVisits = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const items = [
          { name: "Maya Johnson", contact: "maya@email.com", meta: "Today - 10:24 AM", detail: "47 min visit", source: "Website preview" },
          { name: "Sanjay Patel", contact: "+61 412 000 111", meta: "25 May - 2:14 PM", detail: "31 min visit", source: "Display home tour" },
          { name: "Linda Chen", contact: "lchen@outlook.com", meta: "23 May - 11:02 AM", detail: "55 min visit", source: "QR scan" },
          { name: "Oliver Brown", contact: "oliver@email.com", meta: "22 May - 4:40 PM", detail: "24 min visit", source: "Preview page" },
          { name: "Amelia Wilson", contact: "amelia@email.com", meta: "21 May - 1:36 PM", detail: "42 min visit", source: "Display home tour" },
          { name: "Noah Taylor", contact: "noah@email.com", meta: "20 May - 9:18 AM", detail: "38 min visit", source: "Website preview" },
          { name: "Priya Shah", contact: "priya@email.com", meta: "19 May - 3:12 PM", detail: "29 min visit", source: "QR scan" },
          { name: "Daniel Moore", contact: "daniel@email.com", meta: "18 May - 11:50 AM", detail: "51 min visit", source: "Preview page" },
          { name: "Ava Martin", contact: "ava@email.com", meta: "17 May - 2:05 PM", detail: "34 min visit", source: "Website preview" },
          { name: "Ethan Clark", contact: "ethan@email.com", meta: "16 May - 4:22 PM", detail: "27 min visit", source: "Display home tour" },
        ];

        return items[index % items.length];
      }),
    []
  );

  const recentLeads = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const items = [
          { name: "Maya Johnson", contact: "maya@email.com", meta: "New lead", detail: "Selected Yes, Continue", source: "Tarneit 42 - The Whitmore" },
          { name: "Amelia Wilson", contact: "+61 409 555 120", meta: "Contacted", detail: "Requested callback", source: "Tarneit 42 - The Whitmore" },
          { name: "Noah Taylor", contact: "noah@email.com", meta: "Approved", detail: "Waiting for selections", source: "Werribee 28 - The Aspen" },
          { name: "Sanjay Patel", contact: "+61 412 000 111", meta: "New lead", detail: "Saved 7 products", source: "Hoppers Crossing - The Delray" },
          { name: "Linda Chen", contact: "lchen@outlook.com", meta: "New lead", detail: "Asked for brochure", source: "Tarneit 42 - The Whitmore" },
          { name: "Oliver Brown", contact: "oliver@email.com", meta: "Contacted", detail: "Booked a follow-up", source: "Werribee 28 - The Aspen" },
          { name: "Priya Shah", contact: "priya@email.com", meta: "Approved", detail: "Requested pricing", source: "Hoppers Crossing - The Delray" },
          { name: "Daniel Moore", contact: "daniel@email.com", meta: "New lead", detail: "Needs call back", source: "Brighton 36 - The Hudson" },
          { name: "Ava Martin", contact: "ava@email.com", meta: "Contacted", detail: "Compared three homes", source: "Tarneit 42 - The Whitmore" },
          { name: "Ethan Clark", contact: "ethan@email.com", meta: "Approved", detail: "Waiting for reply", source: "Werribee 28 - The Aspen" },
        ];

        return items[index % items.length];
      }),
    []
  );

  return (
    <BuilderShell>
      <section className={styles.page}>
        <div className={styles.shell}>
          <div className={styles.breadcrumbs}>
            <Link href="/builder/display-homes">Display homes</Link>
            <span>/</span>
            <span>{home.name}</span>
          </div>

          <section className={`${styles.panel} ${styles.hero}`}>
            <div className={styles.heroCopy}>
              <div className={styles.statusRow}>
                <span className={`${styles.statusBadge} ${styles[statusClass]}`}>{home.status}</span>
                <span className={styles.activityMeta}>Preview mode</span>
              </div>
              <div>
                <h1 className={styles.title}>{home.name}</h1>
                <p className={styles.subtitle}>
                  A preview of the display home profile, with the core engagement metrics, product summary,
                  and recent activity in one clean view.
                </p>
              </div>
              <div className={styles.heroActions}>
                <Link className={styles.primaryAction} href="/builder/display-homes/create">
                  <EditIcon size={16} /> Edit home
                </Link>
                <Link className={styles.secondaryAction} href="/builder/display-homes">
                  <ArrowIcon size={16} /> Back to list
                </Link>
              </div>
              <div className={styles.heroSummary}>
                <div className={styles.metaCard}>
                  <small>Address</small>
                  <strong>{home.address}</strong>
                </div>
                <div className={styles.metaCard}>
                  <small>Status</small>
                  <strong>{home.status}</strong>
                </div>
                <div className={styles.metaCard}>
                  <small>Preview slug</small>
                  <strong>{slug}</strong>
                </div>
                <div className={`${styles.metaCard} ${styles.qrMetaCard}`}>
                  <small>Visit QR</small>
                  <div className={styles.qrMini} aria-label="QR code preview">
                    {qrPreviewMarks.map((filled, index) => (
                      <i key={index} className={filled ? "filled" : ""} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div
                aria-hidden="true"
                className={styles.heroImage}
                style={{ backgroundImage: `url("${home.image}")`, backgroundPosition: home.position }}
              />
              <div className={styles.heroOverlay}>
                <div className={styles.overlayCard}>
                  <small>Visits</small>
                  <strong>{home.visits}</strong>
                </div>
                <div className={styles.overlayCard}>
                  <small>Leads</small>
                  <strong>{home.leads}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.stats} aria-label="Display home metrics">
            <article className={styles.statCard}>
              <span className={styles.statIcon}><HomeIcon size={20} /></span>
              <div className={styles.statCopy}>
                <small>Rooms</small>
                <strong>{home.rooms}</strong>
                <span>Floor plan ready</span>
              </div>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statIcon}><UsersIcon size={20} /></span>
              <div className={styles.statCopy}>
                <small>Visits</small>
                <strong>{home.visits}</strong>
                <span>Last 30 days</span>
              </div>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statIcon}><BoxIcon size={20} /></span>
              <div className={styles.statCopy}>
                <small>Tagged products</small>
                <strong>{home.products}</strong>
                <span>Linked to this home</span>
              </div>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statIcon}><ChartIcon size={20} /></span>
              <div className={styles.statCopy}>
                <small>Completion</small>
                <strong>{home.completion}%</strong>
                <span>Setup progress</span>
              </div>
            </article>
          </section>

          <div className={styles.grid}>
            <section className={`${styles.panel} ${styles.section} ${styles.fullWidth}`}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Details</h2>
                  <p>Shared home information that helps the team review this display home at a glance.</p>
                </div>
                <span className={styles.sectionPill}>Preview data</span>
              </div>
              <div className={styles.detailCards}>
                <div className={styles.detailCard}>
                  <small>Address</small>
                  <strong>{home.address}</strong>
                </div>
                <div className={styles.detailCard}>
                  <small>Sales consultants</small>
                  <strong>{salesConsultants.join(", ")}</strong>
                </div>
                <div className={styles.detailCard}>
                  <small>Opening hours</small>
                  <div className={styles.openingHoursRow}>
                    <strong>Mon - Fri 9:00 AM - 6:00 PM</strong>
                    <strong>Saturday 9:00 AM - 6:00 PM</strong>
                    <strong>Sunday 9:00 AM - 6:00 PM</strong>
                  </div>
                </div>
                <div className={styles.detailCard}>
                  <small>Preview slug</small>
                  <strong>{slug}</strong>
                </div>
              </div>
            </section>
          </div>

          <div className={styles.grid}>
            <section className={`${styles.panel} ${styles.section} ${styles.fullWidth}`}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Classification</h2>
                  <p>How this display home is categorised and which access options are enabled.</p>
                </div>
                <span className={styles.sectionPill}>Preview data</span>
              </div>
              <div className={styles.classificationGrid}>
                <div className={styles.classificationCard}>
                  <small>Storey type</small>
                  <strong>Single storey</strong>
                </div>
                <div className={styles.classificationCard}>
                  <small>Design style</small>
                  <strong>Hamptons</strong>
                </div>
                <div className={`${styles.classificationCard} ${styles.classificationWide}`}>
                  <small>Target market</small>
                  <div className={styles.tagRow}>
                    {classificationTags.map((tag) => (
                      <span className={styles.tag} key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={`${styles.classificationCard} ${styles.classificationWide}`}>
                  <small>Access & lead capture</small>
                  <div className={styles.accessList}>
                    {accessOptions.map((item) => (
                      <div className={styles.accessRow} key={item.label}>
                        <span>{item.label}</span>
                        <b className={item.value ? styles.enabled : styles.disabled}>{item.note}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className={styles.grid}>
            <section className={`${styles.panel} ${styles.section}`}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Recent visits</h2>
                  <p>People who visited this home and how long they stayed.</p>
                </div>
                <span className={styles.sectionPill}>{home.visits} visits</span>
              </div>
              <div className={`${styles.peopleList} ${styles.peopleScroll}`}>
                {recentVisits.map((person, index) => (
                  <article className={styles.personItem} key={`${person.name}-${person.source}-${index}`}>
                    <span className={styles.personAvatar}>{person.name.charAt(0)}</span>
                    <div className={styles.personBody}>
                      <div className={styles.personTop}>
                        <strong>{person.name}</strong>
                        <span className={styles.personBadge}>{person.meta}</span>
                      </div>
                      <small>{person.contact}</small>                     
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={`${styles.panel} ${styles.section}`}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Recent leads</h2>
                  <p>Enquiries generated from this display home preview.</p>
                </div>
                <span className={styles.sectionPill}>{home.leads} leads</span>
              </div>
              <div className={`${styles.peopleList} ${styles.peopleScroll}`}>
                {recentLeads.map((person, index) => (
                  <article className={styles.personItem} key={`${person.name}-${person.source}-${index}`}>
                    <span className={`${styles.personAvatar} ${styles.personLeadAvatar}`}>
                      <UserIcon size={16} />
                    </span>
                    <div className={styles.personBody}>
                      <div className={styles.personTop}>
                        <strong>{person.name}</strong>
                        <span className={styles.personBadge}>{person.meta}</span>
                      </div>
                      <small>{person.contact}</small>
                      <span className={styles.personDetail}>{person.detail}</span>
                    </div>
                    <div className={styles.personAside}>
                      <span>{person.source}</span>
                      <div className={styles.personContactIcons}>
                        <MailIcon size={14} />
                        <PhoneIcon size={14} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

        </div>
      </section>
    </BuilderShell>
  );
}
