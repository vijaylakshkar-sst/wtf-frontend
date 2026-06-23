export function BuilderOverview() {
  return (
    <section
      className="builder-main"
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "calc(100vh - 82px)"
      }}
    >
      <div
        style={{
          background: "rgba(255, 253, 249, 0.94)",
          border: "1px solid #e3d9cf",
          borderRadius: 18,
          boxShadow: "0 18px 55px rgba(0, 0, 0, 0.12)",
          maxWidth: 560,
          padding: "34px 30px",
          width: "100%"
        }}
      >
        <p
          style={{
            color: "#a2764d",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.8px",
            margin: "0 0 10px",
            textTransform: "uppercase"
          }}
        >
          Builder dashboard
        </p>
        <h1 style={{ fontSize: 42, letterSpacing: "-1.8px", margin: "0 0 12px" }}>Coming soon</h1>
        <span style={{ color: "#6d6357", display: "block", fontSize: 15, lineHeight: 1.7, maxWidth: 430 }}>
          Dashboard data is not available yet. We&apos;re keeping this space ready for the full builder
          experience.
        </span>
      </div>
    </section>
  );
}
