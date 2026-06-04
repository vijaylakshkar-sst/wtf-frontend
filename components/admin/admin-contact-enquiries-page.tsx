import { AdminShell } from "@/components/admin/admin-shell";
import { EyeIcon, MailIcon, PhoneIcon, SearchIcon, UsersIcon } from "@/components/icons";

const enquiryStats = [
  { label: "Total enquiries", value: "126", note: "+18 this week", icon: MailIcon },
  { label: "New enquiries", value: "24", note: "Awaiting response", icon: UsersIcon },
  { label: "High priority", value: "8", note: "Needs quick follow-up", icon: PhoneIcon },
  { label: "Closed", value: "72", note: "Resolved this month", icon: EyeIcon },
] as const;

const enquiries = [
  { id: "ENQ-1001", name: "Aarav Sharma", email: "aarav@example.com", phone: "+61 400 123 221", type: "Customer enquiry", subject: "Need help finding saved products", status: "New", priority: "High", date: "Today" },
  { id: "ENQ-1002", name: "Mia Anderson", email: "mia@acmesurfaces.example", phone: "+61 402 554 018", type: "Supplier enquiry", subject: "Supplier verification update", status: "In progress", priority: "Medium", date: "2h ago" },
  { id: "ENQ-1003", name: "James Carter", email: "james@clarendon.example", phone: "+61 410 882 620", type: "Builder enquiry", subject: "Display home publishing issue", status: "New", priority: "High", date: "Yesterday" },
  { id: "ENQ-1004", name: "Olivia Brown", email: "olivia@example.com", phone: "+61 433 910 774", type: "General enquiry", subject: "Privacy request details", status: "Closed", priority: "Low", date: "3 days ago" },
] as const;

export function AdminContactEnquiriesPage() {
  return (
    <AdminShell>
      <section className="builder-main admin-main">
        <header className="admin-page-header">
          <div>
            <p>Contact us enquiries</p>
            <h1>Contact enquiries</h1>
            <span>View and manage enquiries submitted from the Contact Us form.</span>
          </div>
          <label className="admin-search">
            <SearchIcon size={17} />
            <input aria-label="Search contact enquiries" placeholder="Search enquiries..." />
          </label>
        </header>

        <section className="admin-stats" aria-label="Contact enquiry metrics">
          {enquiryStats.map(({ icon: Icon, ...stat }) => (
            <article key={stat.label}>
              <span><Icon size={22} /></span>
              <div>
                <small>{stat.label}</small>
                <strong>{stat.value}</strong>
                <em>{stat.note}</em>
              </div>
            </article>
          ))}
        </section>

        <section className="admin-panel admin-list-panel admin-contact-enquiries-table">
          <header>
            <div><h2>Enquiry list</h2><p>Contact form submissions with customer details, subject, priority and status.</p></div>
            <button type="button">Export</button>
          </header>
          <div className="admin-table">
            <div className="admin-row contact-enquiry-row admin-row-head"><span>Name</span><span>Contact</span><span>Type</span><span>Subject</span><span>Priority</span><span>Status</span><span>Date</span><span>Actions</span></div>
            {enquiries.map((enquiry) => (
              <div className="admin-row contact-enquiry-row" key={enquiry.id}>
                <strong><i>{enquiry.name.slice(0, 2).toUpperCase()}</i><span>{enquiry.name}<small>{enquiry.id}</small></span></strong>
                <span>{enquiry.email}<small>{enquiry.phone}</small></span>
                <span>{enquiry.type}</span>
                <span>{enquiry.subject}</span>
                <span>{enquiry.priority}</span>
                <em className={enquiry.status.toLowerCase().replace(" ", "-")}>{enquiry.status}</em>
                <span>{enquiry.date}</span>
                <div className="admin-user-actions">
                  <button aria-label={`View enquiry from ${enquiry.name}`} title="View enquiry" type="button"><EyeIcon size={16} /></button>
                  <button aria-label={`Email ${enquiry.name}`} title="Email" type="button"><MailIcon size={16} /></button>
                  <button aria-label={`Call ${enquiry.name}`} title="Call" type="button"><PhoneIcon size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
